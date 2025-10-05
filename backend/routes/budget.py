from flask import Blueprint, request, jsonify
from utils.json_handler import json_handler
from datetime import datetime

budget_bp = Blueprint('budget', __name__)

@budget_bp.route('', methods=['GET'])
def get_budget():
    """Get budget overview (requires budget-related permissions)"""
    try:
        budget = json_handler.read_json('budget.json', {})
        
        if not budget:
            return jsonify({
                'success': False,
                'message': 'Budget data not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': budget
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch budget'
        }), 500

@budget_bp.route('/category/<category_name>', methods=['PUT'])
def update_budget_category(category_name):
    """Update budget category (requires edit_budget permission)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        budget = json_handler.read_json('budget.json', {})
        
        if not budget:
            return jsonify({
                'success': False,
                'message': 'Budget data not found'
            }), 404
        
        # Find and update category
        categories = budget.get('categories', [])
        category_found = False
        
        for i, category in enumerate(categories):
            if category.get('name') == category_name:
                # Update category with new data
                categories[i] = {**category, **data}
                category_found = True
                break
        
        if not category_found:
            return jsonify({
                'success': False,
                'message': 'Category not found'
            }), 404
        
        # Recalculate totals
        total_budgeted = sum(cat.get('budgeted', 0) for cat in categories)
        total_spent = sum(cat.get('spent', 0) for cat in categories)
        total_remaining = total_budgeted - total_spent
        
        budget['total'] = total_budgeted
        budget['spent'] = total_spent
        budget['remaining'] = total_remaining
        budget['categories'] = categories
        
        # Update forecast if needed
        if 'forecast' in budget:
            budget['forecast']['projectedTotal'] = total_budgeted
            budget['forecast']['overBudget'] = max(0, total_spent - total_budgeted)
        
        success = json_handler.write_json('budget.json', budget)
        
        if success:
            return jsonify({
                'success': True,
                'data': budget,
                'message': 'Budget category updated successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to update budget category'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to update budget category'
        }), 500

@budget_bp.route('/history', methods=['POST'])
def add_budget_entry():
    """Add budget history entry (requires edit_budget permission)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Validate required fields
        required_fields = ['amount', 'category', 'description']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        budget = json_handler.read_json('budget.json', {})
        
        if not budget:
            return jsonify({
                'success': False,
                'message': 'Budget data not found'
            }), 404
        
        # Create new history entry
        new_entry = {
            'date': data.get('date', datetime.now().strftime('%Y-%m-%d')),
            'amount': float(data['amount']),
            'category': data['category'],
            'description': data['description']
        }
        
        # Add to history
        history = budget.get('history', [])
        history.append(new_entry)
        budget['history'] = history
        
        # Update category spent amount
        categories = budget.get('categories', [])
        category_found = False
        
        for category in categories:
            if category.get('name') == data['category']:
                category['spent'] = category.get('spent', 0) + float(data['amount'])
                category['remaining'] = category.get('budgeted', 0) - category['spent']
                category_found = True
                break
        
        if not category_found:
            return jsonify({
                'success': False,
                'message': 'Category not found'
            }), 400
        
        # Recalculate totals
        total_budgeted = sum(cat.get('budgeted', 0) for cat in categories)
        total_spent = sum(cat.get('spent', 0) for cat in categories)
        total_remaining = total_budgeted - total_spent
        
        budget['total'] = total_budgeted
        budget['spent'] = total_spent
        budget['remaining'] = total_remaining
        budget['categories'] = categories
        
        # Update forecast
        if 'forecast' in budget:
            budget['forecast']['projectedTotal'] = total_budgeted
            budget['forecast']['overBudget'] = max(0, total_spent - total_budgeted)
        
        success = json_handler.write_json('budget.json', budget)
        
        if success:
            return jsonify({
                'success': True,
                'data': budget,
                'message': 'Budget entry added successfully'
            }), 201
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to add budget entry'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to add budget entry'
        }), 500

@budget_bp.route('/categories', methods=['GET'])
def get_budget_categories():
    """Get budget categories"""
    try:
        budget = json_handler.read_json('budget.json', {})
        
        if not budget:
            return jsonify({
                'success': False,
                'message': 'Budget data not found'
            }), 404
        
        categories = budget.get('categories', [])
        
        return jsonify({
            'success': True,
            'data': categories
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch budget categories'
        }), 500

@budget_bp.route('/history', methods=['GET'])
def get_budget_history():
    """Get budget history"""
    try:
        budget = json_handler.read_json('budget.json', {})
        
        if not budget:
            return jsonify({
                'success': False,
                'message': 'Budget data not found'
            }), 404
        
        history = budget.get('history', [])
        
        # Sort by date (newest first)
        history.sort(key=lambda x: x.get('date', ''), reverse=True)
        
        return jsonify({
            'success': True,
            'data': history
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch budget history'
        }), 500

@budget_bp.route('/forecast', methods=['GET'])
def get_budget_forecast():
    """Get budget forecast"""
    try:
        budget = json_handler.read_json('budget.json', {})
        
        if not budget:
            return jsonify({
                'success': False,
                'message': 'Budget data not found'
            }), 404
        
        forecast = budget.get('forecast', {})
        
        return jsonify({
            'success': True,
            'data': forecast
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch budget forecast'
        }), 500
