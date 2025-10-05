"""
WebSocket Manager for ProdSight
Handles real-time communication between frontend and backend
"""
import json
import asyncio
from typing import Dict, Set, Any, Optional
from flask_socketio import SocketIO, emit, join_room, leave_room, disconnect
from flask import request
from utils.auth import decode_jwt_token

class WebSocketManager:
    def __init__(self, socketio: SocketIO):
        self.socketio = socketio
        self.connected_users: Dict[str, Set[str]] = {}  # user_id -> set of session_ids
        self.user_sessions: Dict[str, str] = {}  # session_id -> user_id
        self.setup_event_handlers()
    
    def setup_event_handlers(self):
        """Setup WebSocket event handlers"""
        
        @self.socketio.on('connect')
        def handle_connect(auth=None):
            """Handle client connection"""
            try:
                # Get token from auth or query parameters
                token = None
                if auth and 'token' in auth:
                    token = auth['token']
                elif request.args.get('token'):
                    token = request.args.get('token')
                
                if not token:
                    print("WebSocket connection rejected: No token provided")
                    disconnect()
                    return False
                
                # Verify JWT token
                user_data = decode_jwt_token(token)
                if not user_data:
                    print("WebSocket connection rejected: Invalid token")
                    disconnect()
                    return False
                
                user_id = user_data['user_id']
                session_id = request.sid
                
                # Store user session mapping
                self.user_sessions[session_id] = user_id
                
                # Add user to connected users
                if user_id not in self.connected_users:
                    self.connected_users[user_id] = set()
                self.connected_users[user_id].add(session_id)
                
                # Join user-specific room
                join_room(f"user_{user_id}")
                
                # Join role-specific room
                user_role = user_data.get('role', '').lower()
                if user_role:
                    join_room(f"role_{user_role}")
                
                print(f"User {user_id} connected with session {session_id}")
                
                # Emit connection success
                emit('connection_status', {
                    'status': 'connected',
                    'user_id': user_id,
                    'message': 'Successfully connected to ProdSight WebSocket'
                })
                
                return True
                
            except Exception as e:
                print(f"WebSocket connection error: {str(e)}")
                disconnect()
                return False
        
        @self.socketio.on('disconnect')
        def handle_disconnect():
            """Handle client disconnection"""
            session_id = request.sid
            
            if session_id in self.user_sessions:
                user_id = self.user_sessions[session_id]
                
                # Remove session from user's sessions
                if user_id in self.connected_users:
                    self.connected_users[user_id].discard(session_id)
                    
                    # If no more sessions for this user, remove from connected users
                    if not self.connected_users[user_id]:
                        del self.connected_users[user_id]
                
                # Remove session mapping
                del self.user_sessions[session_id]
                
                print(f"User {user_id} disconnected (session {session_id})")
        
        @self.socketio.on('ping')
        def handle_ping():
            """Handle ping for connection health check"""
            emit('pong', {'timestamp': asyncio.get_event_loop().time()})
        
        @self.socketio.on('join_project_room')
        def handle_join_project_room(data):
            """Join a project-specific room for updates"""
            project_id = data.get('project_id')
            if project_id:
                join_room(f"project_{project_id}")
                emit('room_joined', {'room': f"project_{project_id}"})
        
        @self.socketio.on('leave_project_room')
        def handle_leave_project_room(data):
            """Leave a project-specific room"""
            project_id = data.get('project_id')
            if project_id:
                leave_room(f"project_{project_id}")
                emit('room_left', {'room': f"project_{project_id}"})
    
    def emit_to_user(self, user_id: str, event: str, data: Any):
        """Emit event to a specific user"""
        if user_id in self.connected_users:
            self.socketio.emit(event, data, room=f"user_{user_id}")
    
    def emit_to_role(self, role: str, event: str, data: Any):
        """Emit event to all users with a specific role"""
        self.socketio.emit(event, data, room=f"role_{role.lower()}")
    
    def emit_to_project(self, project_id: str, event: str, data: Any):
        """Emit event to all users in a project room"""
        self.socketio.emit(event, data, room=f"project_{project_id}")
    
    def emit_to_all(self, event: str, data: Any):
        """Emit event to all connected users"""
        self.socketio.emit(event, data)
    
    def broadcast_task_update(self, task_data: Dict[str, Any], action: str = 'updated'):
        """Broadcast task updates to relevant users"""
        event_data = {
            'action': action,
            'task': task_data,
            'timestamp': asyncio.get_event_loop().time()
        }
        
        # Emit to task assignee
        if task_data.get('assigneeId'):
            self.emit_to_user(task_data['assigneeId'], 'task_update', event_data)
        
        # Emit to producers and directors (they can see all tasks)
        self.emit_to_role('producer', 'task_update', event_data)
        self.emit_to_role('director', 'task_update', event_data)
        self.emit_to_role('production manager', 'task_update', event_data)
    
    def broadcast_budget_update(self, budget_data: Dict[str, Any], action: str = 'updated'):
        """Broadcast budget updates to relevant users"""
        event_data = {
            'action': action,
            'budget': budget_data,
            'timestamp': asyncio.get_event_loop().time()
        }
        
        # Budget updates go to producers and production managers
        self.emit_to_role('producer', 'budget_update', event_data)
        self.emit_to_role('production manager', 'budget_update', event_data)
    
    def broadcast_script_update(self, script_data: Dict[str, Any], action: str = 'updated'):
        """Broadcast script updates to relevant users"""
        event_data = {
            'action': action,
            'script': script_data,
            'timestamp': asyncio.get_event_loop().time()
        }
        
        # Script updates go to all roles except distribution manager
        self.emit_to_role('producer', 'script_update', event_data)
        self.emit_to_role('director', 'script_update', event_data)
        self.emit_to_role('production manager', 'script_update', event_data)
        self.emit_to_role('crew', 'script_update', event_data)
        self.emit_to_role('vfx', 'script_update', event_data)
    
    def broadcast_vfx_update(self, vfx_data: Dict[str, Any], action: str = 'updated'):
        """Broadcast VFX updates to relevant users"""
        event_data = {
            'action': action,
            'vfx': vfx_data,
            'timestamp': asyncio.get_event_loop().time()
        }
        
        # VFX updates go to VFX team, directors, and producers
        self.emit_to_role('vfx', 'vfx_update', event_data)
        self.emit_to_role('director', 'vfx_update', event_data)
        self.emit_to_role('producer', 'vfx_update', event_data)
    
    def broadcast_asset_update(self, asset_data: Dict[str, Any], action: str = 'updated'):
        """Broadcast asset updates to relevant users"""
        event_data = {
            'action': action,
            'asset': asset_data,
            'timestamp': asyncio.get_event_loop().time()
        }
        
        # Asset updates go to all users
        self.emit_to_all('asset_update', event_data)
    
    def get_connected_users_count(self) -> int:
        """Get count of connected users"""
        return len(self.connected_users)
    
    def get_user_sessions(self, user_id: str) -> Set[str]:
        """Get all session IDs for a user"""
        return self.connected_users.get(user_id, set())
    
    def is_user_connected(self, user_id: str) -> bool:
        """Check if a user is connected"""
        return user_id in self.connected_users and len(self.connected_users[user_id]) > 0

# Global WebSocket manager instance
websocket_manager: Optional[WebSocketManager] = None

def init_websocket_manager(socketio: SocketIO) -> WebSocketManager:
    """Initialize the global WebSocket manager"""
    global websocket_manager
    websocket_manager = WebSocketManager(socketio)
    return websocket_manager

def get_websocket_manager() -> Optional[WebSocketManager]:
    """Get the global WebSocket manager instance"""
    return websocket_manager
