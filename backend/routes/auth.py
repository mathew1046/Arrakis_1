from flask import Blueprint, request, jsonify
from utils.json_handler import json_handler

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint - simplified for public access"""
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({
                'success': False,
                'message': 'Username and password are required'
            }), 400
        
        username = data['username']
        password = data['password']
        
        # Get users from JSON
        users = json_handler.read_json('users.json', [])
        user = next((u for u in users if u.get('username') == username and u.get('password') == password), None)
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'Invalid credentials'
            }), 401
        
        # Return user without password
        user_response = user.copy()
        user_response.pop('password', None)
        
        return jsonify({
            'success': True,
            'data': {
                'user': user_response,
                'message': 'Login successful (no auth required)'
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Login failed'
        }), 500

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Get current user - simplified for public access"""
    try:
        # For demo purposes, return the first user
        users = json_handler.read_json('users.json', [])
        if users:
            user = users[0].copy()
            user.pop('password', None)
            return jsonify({
                'success': True,
                'data': user
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'No users found'
            }), 404
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to get user information'
        }), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """User logout endpoint - simplified for public access"""
    return jsonify({
        'success': True,
        'message': 'Logout successful (no auth required)'
    }), 200

@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    """Refresh token - simplified for public access"""
    return jsonify({
        'success': True,
        'data': {
            'message': 'No refresh needed (no auth required)'
        },
        'message': 'No authentication required'
    }), 200
