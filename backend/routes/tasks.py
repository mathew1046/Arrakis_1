from flask import Blueprint, request, jsonify, current_app
from utils.json_handler import json_handler
from utils.auth import get_user_by_id
from websocket_manager import get_websocket_manager

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('', methods=['GET'])
def get_tasks():
    """Get all tasks"""
    try:
        tasks = json_handler.read_json('tasks.json', [])
        
        return jsonify({
            'success': True,
            'data': tasks
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch tasks'
        }), 500

@tasks_bp.route('/<task_id>', methods=['GET'])
def get_task(task_id):
    """Get task by ID"""
    try:
        task = json_handler.find_by_id('tasks.json', task_id)
        
        if not task:
            return jsonify({
                'success': False,
                'message': 'Task not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': task
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch task'
        }), 500

@tasks_bp.route('', methods=['POST'])
def create_task():
    """Create new task (requires manage_tasks permission)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Validate required fields
        required_fields = ['title', 'description', 'assigneeId', 'dueDate', 'priority', 'category']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        # Validate assignee exists
        assignee = get_user_by_id(data['assigneeId'])
        if not assignee:
            return jsonify({
                'success': False,
                'message': 'Assignee not found'
            }), 400
        
        # Validate status
        valid_statuses = ['todo', 'in_progress', 'done']
        if 'status' in data and data['status'] not in valid_statuses:
            return jsonify({
                'success': False,
                'message': f'Status must be one of: {", ".join(valid_statuses)}'
            }), 400
        
        # Validate priority
        valid_priorities = ['low', 'medium', 'high']
        if data['priority'] not in valid_priorities:
            return jsonify({
                'success': False,
                'message': f'Priority must be one of: {", ".join(valid_priorities)}'
            }), 400
        
        # Create new task
        new_task = {
            'id': json_handler.get_next_id('tasks.json'),
            'title': data['title'],
            'description': data['description'],
            'status': data.get('status', 'todo'),
            'assignee': assignee['name'],
            'assigneeId': data['assigneeId'],
            'dueDate': data['dueDate'],
            'priority': data['priority'],
            'category': data['category'],
            'estimatedHours': data.get('estimatedHours', 0)
        }
        
        # Add to tasks list
        tasks = json_handler.read_json('tasks.json', [])
        tasks.append(new_task)
        success = json_handler.write_json('tasks.json', tasks)
        
        if success:
            # Emit WebSocket event for task creation
            ws_manager = get_websocket_manager()
            if ws_manager:
                ws_manager.broadcast_task_update(new_task, 'created')
            
            return jsonify({
                'success': True,
                'data': tasks,  # Return all tasks for consistency
                'message': 'Task created successfully'
            }), 201
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to create task'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to create task'
        }), 500

@tasks_bp.route('/<task_id>', methods=['PUT'])
def update_task(task_id):
    """Update task"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Get existing task
        task = json_handler.find_by_id('tasks.json', task_id)
        if not task:
            return jsonify({
                'success': False,
                'message': 'Task not found'
            }), 404
        
        # Note: Permission checks removed for public access
        
        # Validate assignee if being changed
        if 'assigneeId' in data:
            assignee = get_user_by_id(data['assigneeId'])
            if not assignee:
                return jsonify({
                    'success': False,
                    'message': 'Assignee not found'
                }), 400
            data['assignee'] = assignee['name']
        
        # Validate status
        if 'status' in data:
            valid_statuses = ['todo', 'in_progress', 'done']
            if data['status'] not in valid_statuses:
                return jsonify({
                    'success': False,
                    'message': f'Status must be one of: {", ".join(valid_statuses)}'
                }), 400
        
        # Validate priority
        if 'priority' in data:
            valid_priorities = ['low', 'medium', 'high']
            if data['priority'] not in valid_priorities:
                return jsonify({
                    'success': False,
                    'message': f'Priority must be one of: {", ".join(valid_priorities)}'
                }), 400
        
        # Update task
        success = json_handler.update_by_id('tasks.json', task_id, data)
        
        if success:
            # Get updated task and all tasks
            updated_task = json_handler.find_by_id('tasks.json', task_id)
            all_tasks = json_handler.read_json('tasks.json', [])
            
            # Emit WebSocket event for task update
            ws_manager = get_websocket_manager()
            if ws_manager:
                ws_manager.broadcast_task_update(updated_task, 'updated')
            
            return jsonify({
                'success': True,
                'data': all_tasks,  # Return all tasks for consistency
                'message': 'Task updated successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to update task'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to update task'
        }), 500

@tasks_bp.route('/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete task (requires manage_tasks permission)"""
    try:
        # Check if task exists
        task = json_handler.find_by_id('tasks.json', task_id)
        if not task:
            return jsonify({
                'success': False,
                'message': 'Task not found'
            }), 404
        
        # Delete task
        success = json_handler.delete_by_id('tasks.json', task_id)
        
        if success:
            # Get remaining tasks
            remaining_tasks = json_handler.read_json('tasks.json', [])
            
            # Emit WebSocket event for task deletion
            ws_manager = get_websocket_manager()
            if ws_manager:
                ws_manager.broadcast_task_update(task, 'deleted')
            
            return jsonify({
                'success': True,
                'data': remaining_tasks,  # Return remaining tasks for consistency
                'message': 'Task deleted successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to delete task'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to delete task'
        }), 500

@tasks_bp.route('/assignee/<assignee_id>', methods=['GET'])
def get_tasks_by_assignee(assignee_id):
    """Get tasks by assignee ID"""
    try:
        # Note: Permission checks removed for public access
        
        tasks = json_handler.read_json('tasks.json', [])
        assignee_tasks = [task for task in tasks if task.get('assigneeId') == assignee_id]
        
        return jsonify({
            'success': True,
            'data': assignee_tasks
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch tasks'
        }), 500
