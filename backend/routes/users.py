from flask import Blueprint, request, jsonify
from utils.json_handler import json_handler
from utils.auth import hash_password, get_user_by_id

users_bp = Blueprint('users', __name__)

@users_bp.route('', methods=['GET'])
def get_users():
    """Get all users (requires view_all or manage_crew permission)"""
    try:
        users = json_handler.read_json('users.json', [])
        
        # Remove passwords from response
        users_without_passwords = []
        for user in users:
            user_copy = user.copy()
            user_copy.pop('password', None)
            users_without_passwords.append(user_copy)
        
        return jsonify({
            'success': True,
            'data': users_without_passwords
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch users'
        }), 500

@users_bp.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user by ID"""
    try:
        user = get_user_by_id(user_id)
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': user
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch user'
        }), 500

@users_bp.route('', methods=['POST'])
def create_user():
    """Create new user (requires manage_crew permission)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Validate required fields
        required_fields = ['name', 'role', 'email', 'username', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        # Check if username already exists
        users = json_handler.read_json('users.json', [])
        if any(user.get('username') == data['username'] for user in users):
            return jsonify({
                'success': False,
                'message': 'Username already exists'
            }), 400
        
        # Check if email already exists
        if any(user.get('email') == data['email'] for user in users):
            return jsonify({
                'success': False,
                'message': 'Email already exists'
            }), 400
        
        # Hash password
        hashed_password = hash_password(data['password'])
        
        # Create new user
        new_user = {
            'id': json_handler.get_next_id('users.json'),
            'name': data['name'],
            'role': data['role'],
            'email': data['email'],
            'username': data['username'],
            'password': hashed_password,
            'avatar': data.get('avatar', ''),
            'permissions': data.get('permissions', [])
        }
        
        # Add to users list
        users.append(new_user)
        success = json_handler.write_json('users.json', users)
        
        if success:
            # Return user without password
            user_response = new_user.copy()
            user_response.pop('password')
            
            return jsonify({
                'success': True,
                'data': user_response,
                'message': 'User created successfully'
            }), 201
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to create user'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to create user'
        }), 500

@users_bp.route('/<user_id>', methods=['PUT'])
def update_user(user_id):
    """Update user (requires manage_crew permission)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Get existing user
        user = json_handler.find_by_id('users.json', user_id)
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        # Check for username conflicts (if username is being changed)
        if 'username' in data and data['username'] != user['username']:
            users = json_handler.read_json('users.json', [])
            if any(u.get('username') == data['username'] and u.get('id') != user_id for u in users):
                return jsonify({
                    'success': False,
                    'message': 'Username already exists'
                }), 400
        
        # Check for email conflicts (if email is being changed)
        if 'email' in data and data['email'] != user['email']:
            users = json_handler.read_json('users.json', [])
            if any(u.get('email') == data['email'] and u.get('id') != user_id for u in users):
                return jsonify({
                    'success': False,
                    'message': 'Email already exists'
                }), 400
        
        # Hash password if provided
        if 'password' in data:
            data['password'] = hash_password(data['password'])
        
        # Update user
        success = json_handler.update_by_id('users.json', user_id, data)
        
        if success:
            # Return updated user without password
            updated_user = json_handler.find_by_id('users.json', user_id)
            if updated_user:
                updated_user.pop('password', None)
            
            return jsonify({
                'success': True,
                'data': updated_user,
                'message': 'User updated successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to update user'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to update user'
        }), 500

@users_bp.route('/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete user (requires manage_crew permission)"""
    try:
        # Check if user exists
        user = json_handler.find_by_id('users.json', user_id)
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        # Note: Self-deletion prevention removed for public access
        
        # Delete user
        success = json_handler.delete_by_id('users.json', user_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'User deleted successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to delete user'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to delete user'
        }), 500
