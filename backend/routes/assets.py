from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
from utils.json_handler import json_handler
from config import Config
import os
import uuid
from datetime import datetime

assets_bp = Blueprint('assets', __name__)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@assets_bp.route('/upload', methods=['POST'])
def upload_asset():
    """Upload asset file"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'message': 'No file provided'
            }), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({
                'success': False,
                'message': 'No file selected'
            }), 400
        
        if file and allowed_file(file.filename):
            # Secure the filename
            filename = secure_filename(file.filename)
            
            # Generate unique filename to avoid conflicts
            file_extension = filename.rsplit('.', 1)[1].lower()
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            
            # Ensure upload directory exists
            os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
            
            # Save file
            file_path = os.path.join(Config.UPLOAD_FOLDER, unique_filename)
            file.save(file_path)
            
            # Get file size
            file_size = os.path.getsize(file_path)
            
            # Create asset record
            asset_data = {
                'id': str(uuid.uuid4()),
                'name': filename,
                'originalName': filename,
                'filename': unique_filename,
                'size': file_size,
                'type': file.content_type or 'application/octet-stream',
                'uploadDate': datetime.now().isoformat(),
                'url': f'/api/assets/download/{unique_filename}',
                'uploadedBy': request.json.get('uploadedBy') if request.json else None
            }
            
            # Add to assets list
            assets = json_handler.read_json('assets.json', [])
            assets.append(asset_data)
            success = json_handler.write_json('assets.json', assets)
            
            if success:
                return jsonify({
                    'success': True,
                    'data': {
                        'id': asset_data['id'],
                        'name': asset_data['name'],
                        'size': asset_data['size'],
                        'type': asset_data['type'],
                        'uploadDate': asset_data['uploadDate'],
                        'url': asset_data['url']
                    },
                    'message': 'Asset uploaded successfully'
                }), 201
            else:
                # Clean up file if database save failed
                os.remove(file_path)
                return jsonify({
                    'success': False,
                    'message': 'Failed to save asset metadata'
                }), 500
        else:
            return jsonify({
                'success': False,
                'message': f'File type not allowed. Allowed types: {", ".join(Config.ALLOWED_EXTENSIONS)}'
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to upload asset'
        }), 500

@assets_bp.route('', methods=['GET'])
def get_assets():
    """Get all assets"""
    try:
        assets = json_handler.read_json('assets.json', [])
        
        # Return assets without internal file paths
        public_assets = []
        for asset in assets:
            public_asset = {
                'id': asset.get('id'),
                'name': asset.get('name'),
                'size': asset.get('size'),
                'type': asset.get('type'),
                'uploadDate': asset.get('uploadDate'),
                'url': asset.get('url')
            }
            public_assets.append(public_asset)
        
        return jsonify({
            'success': True,
            'data': public_assets
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch assets'
        }), 500

@assets_bp.route('/<asset_id>', methods=['GET'])
def get_asset(asset_id):
    """Get asset by ID"""
    try:
        asset = json_handler.find_by_id('assets.json', asset_id)
        
        if not asset:
            return jsonify({
                'success': False,
                'message': 'Asset not found'
            }), 404
        
        # Return asset without internal file paths
        public_asset = {
            'id': asset.get('id'),
            'name': asset.get('name'),
            'size': asset.get('size'),
            'type': asset.get('type'),
            'uploadDate': asset.get('uploadDate'),
            'url': asset.get('url')
        }
        
        return jsonify({
            'success': True,
            'data': public_asset
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch asset'
        }), 500

@assets_bp.route('/download/<filename>', methods=['GET'])
def download_asset(filename):
    """Download asset file"""
    try:
        # Find asset by filename
        assets = json_handler.read_json('assets.json', [])
        asset = next((a for a in assets if a.get('filename') == filename), None)
        
        if not asset:
            return jsonify({
                'success': False,
                'message': 'Asset not found'
            }), 404
        
        file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
        
        if not os.path.exists(file_path):
            return jsonify({
                'success': False,
                'message': 'File not found on server'
            }), 404
        
        return send_file(
            file_path,
            as_attachment=True,
            download_name=asset.get('name', filename)
        )
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to download asset'
        }), 500

@assets_bp.route('/<asset_id>', methods=['DELETE'])
def delete_asset(asset_id):
    """Delete asset (requires manage permissions)"""
    try:
        # Find asset
        asset = json_handler.find_by_id('assets.json', asset_id)
        if not asset:
            return jsonify({
                'success': False,
                'message': 'Asset not found'
            }), 404
        
        # Delete file from filesystem
        filename = asset.get('filename')
        if filename:
            file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
            if os.path.exists(file_path):
                os.remove(file_path)
        
        # Delete from database
        success = json_handler.delete_by_id('assets.json', asset_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Asset deleted successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to delete asset'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to delete asset'
        }), 500

@assets_bp.route('/search', methods=['GET'])
def search_assets():
    """Search assets by name or type"""
    try:
        query = request.args.get('q', '').lower()
        asset_type = request.args.get('type', '').lower()
        
        assets = json_handler.read_json('assets.json', [])
        filtered_assets = []
        
        for asset in assets:
            # Filter by query
            if query and query not in asset.get('name', '').lower():
                continue
            
            # Filter by type
            if asset_type and asset_type not in asset.get('type', '').lower():
                continue
            
            # Return public asset data
            public_asset = {
                'id': asset.get('id'),
                'name': asset.get('name'),
                'size': asset.get('size'),
                'type': asset.get('type'),
                'uploadDate': asset.get('uploadDate'),
                'url': asset.get('url')
            }
            filtered_assets.append(public_asset)
        
        return jsonify({
            'success': True,
            'data': filtered_assets
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to search assets'
        }), 500
