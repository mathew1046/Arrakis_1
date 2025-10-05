import bcrypt
import jwt
from functools import wraps
from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from utils.json_handler import json_handler

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def authenticate_user(username: str, password: str) -> dict:
    """Authenticate user and return user data without password"""
    users = json_handler.read_json('users.json', [])
    
    for user in users:
        if user.get('username') == username:
            if verify_password(password, user.get('password', '')):
                # Return user without password
                user_copy = user.copy()
                user_copy.pop('password', None)
                return user_copy
    
    return None

def get_user_by_id(user_id: str) -> dict:
    """Get user by ID without password"""
    user = json_handler.find_by_id('users.json', user_id)
    if user:
        user_copy = user.copy()
        user_copy.pop('password', None)
        return user_copy
    return None

def require_permissions(*required_permissions):
    """Decorator to require specific permissions"""
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = get_user_by_id(current_user_id)
            
            if not user:
                return jsonify({'message': 'User not found'}), 404
            
            user_permissions = user.get('permissions', [])
            
            # Check if user has any of the required permissions
            if not any(perm in user_permissions for perm in required_permissions):
                return jsonify({'message': 'Insufficient permissions'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def require_role(*required_roles):
    """Decorator to require specific roles"""
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = get_user_by_id(current_user_id)
            
            if not user:
                return jsonify({'message': 'User not found'}), 404
            
            user_role = user.get('role', '')
            
            if user_role not in required_roles:
                return jsonify({'message': 'Insufficient role permissions'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def decode_jwt_token(token: str) -> dict:
    """Decode JWT token for WebSocket authentication"""
    try:
        # Remove 'Bearer ' prefix if present
        if token.startswith('Bearer '):
            token = token[7:]
        
        # Get JWT secret from config
        secret_key = 'jwt-secret-string'  # Should match JWT_SECRET_KEY in config
        
        # Decode the token
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        
        # Get user data
        user_id = payload.get('sub')  # 'sub' is the standard JWT claim for user ID
        if user_id:
            user = get_user_by_id(user_id)
            if user:
                return {
                    'user_id': user_id,
                    'username': user.get('username'),
                    'role': user.get('role'),
                    'permissions': user.get('permissions', [])
                }
        
        return None
        
    except jwt.ExpiredSignatureError:
        print("JWT token has expired")
        return None
    except jwt.InvalidTokenError as e:
        print(f"Invalid JWT token: {str(e)}")
        return None
    except Exception as e:
        print(f"Error decoding JWT token: {str(e)}")
        return None
