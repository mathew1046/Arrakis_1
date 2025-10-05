from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from flask_socketio import SocketIO
import os

from config import config
from utils.json_handler import ensure_data_directory
from websocket_manager import init_websocket_manager

def create_app(config_name='default'):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    api = Api(app)
    
    # Initialize SocketIO with CORS support
    socketio = SocketIO(app, 
                       cors_allowed_origins="*",
                       async_mode='threading',
                       logger=True,
                       engineio_logger=True)
    
    # Initialize WebSocket manager
    websocket_manager = init_websocket_manager(socketio)
    
    # CORS configuration for development
    CORS(app, 
         origins='*',  # Allow all origins in development
         allow_headers=['Content-Type', 'Authorization', 'X-Requested-With'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         supports_credentials=False)
    
    # Additional CORS headers for all responses
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    # Ensure data directory exists
    ensure_data_directory()
    
    # Import and register routes
    from routes.auth import auth_bp
    from routes.users import users_bp
    from routes.tasks import tasks_bp
    from routes.budget import budget_bp
    from routes.script import script_bp
    from routes.vfx import vfx_bp
    from routes.assets import assets_bp
    from routes.analysis import analysis_bp
    from routes.ai_routes import ai_bp
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
    app.register_blueprint(budget_bp, url_prefix='/api/budget')
    app.register_blueprint(script_bp, url_prefix='/api/script')
    app.register_blueprint(vfx_bp, url_prefix='/api/vfx')
    app.register_blueprint(assets_bp, url_prefix='/api/assets')
    app.register_blueprint(analysis_bp, url_prefix='/api/analysis')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {'message': 'Resource not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return {'message': 'Internal server error'}, 500
    
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Prodsight API is running'}
    
    # Handle preflight OPTIONS requests
    @app.route('/api/<path:path>', methods=['OPTIONS'])
    def handle_options(path):
        return '', 200
    
    # Store socketio instance in app context for access in routes
    app.socketio = socketio
    app.websocket_manager = websocket_manager
    
    return app, socketio

if __name__ == '__main__':
    app, socketio = create_app()
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)

