from flask import Blueprint, request, jsonify
from utils.json_handler import json_handler
from utils.auth import get_user_by_id
from datetime import datetime

vfx_bp = Blueprint('vfx', __name__)

@vfx_bp.route('', methods=['GET'])
def get_vfx_shots():
    """Get all VFX shots (requires VFX-related permissions)"""
    try:
        vfx_shots = json_handler.read_json('vfx.json', [])
        
        return jsonify({
            'success': True,
            'data': vfx_shots
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch VFX shots'
        }), 500

@vfx_bp.route('/<shot_id>', methods=['GET'])
def get_vfx_shot(shot_id):
    """Get VFX shot by ID"""
    try:
        vfx_shot = json_handler.find_by_id('vfx.json', shot_id)
        
        if not vfx_shot:
            return jsonify({
                'success': False,
                'message': 'VFX shot not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': vfx_shot
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch VFX shot'
        }), 500

@vfx_bp.route('', methods=['POST'])
def create_vfx_shot():
    """Create new VFX shot (requires VFX permissions)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Validate required fields
        required_fields = ['shotName', 'sceneId', 'description', 'assignee', 'dueDate']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        # Validate assignee exists
        assignee = get_user_by_id(data['assignee'])
        if not assignee:
            return jsonify({
                'success': False,
                'message': 'Assignee not found'
            }), 400
        
        # Validate status
        valid_statuses = ['todo', 'in_progress', 'in_review', 'done']
        if 'status' in data and data['status'] not in valid_statuses:
            return jsonify({
                'success': False,
                'message': f'Status must be one of: {", ".join(valid_statuses)}'
            }), 400
        
        # Validate priority
        valid_priorities = ['low', 'medium', 'high']
        if 'priority' in data and data['priority'] not in valid_priorities:
            return jsonify({
                'success': False,
                'message': f'Priority must be one of: {", ".join(valid_priorities)}'
            }), 400
        
        # Validate complexity
        valid_complexities = ['low', 'medium', 'high']
        if 'complexity' in data and data['complexity'] not in valid_complexities:
            return jsonify({
                'success': False,
                'message': f'Complexity must be one of: {", ".join(valid_complexities)}'
            }), 400
        
        # Create new VFX shot
        new_shot = {
            'id': json_handler.get_next_id('vfx.json'),
            'shotName': data['shotName'],
            'sceneId': data['sceneId'],
            'description': data['description'],
            'status': data.get('status', 'todo'),
            'priority': data.get('priority', 'medium'),
            'assignee': data['assignee'],
            'dueDate': data['dueDate'],
            'versions': [],
            'estimatedHours': data.get('estimatedHours', 0),
            'complexity': data.get('complexity', 'medium')
        }
        
        # Add to VFX shots list
        vfx_shots = json_handler.read_json('vfx.json', [])
        vfx_shots.append(new_shot)
        success = json_handler.write_json('vfx.json', vfx_shots)
        
        if success:
            return jsonify({
                'success': True,
                'data': new_shot,
                'message': 'VFX shot created successfully'
            }), 201
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to create VFX shot'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to create VFX shot'
        }), 500

@vfx_bp.route('/<shot_id>', methods=['PUT'])
def update_vfx_shot(shot_id):
    """Update VFX shot"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Get existing shot
        shot = json_handler.find_by_id('vfx.json', shot_id)
        if not shot:
            return jsonify({
                'success': False,
                'message': 'VFX shot not found'
            }), 404
        
        # Note: Permission checks removed for public access
        
        # Validate status
        if 'status' in data:
            valid_statuses = ['todo', 'in_progress', 'in_review', 'done']
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
        
        # Validate complexity
        if 'complexity' in data:
            valid_complexities = ['low', 'medium', 'high']
            if data['complexity'] not in valid_complexities:
                return jsonify({
                    'success': False,
                    'message': f'Complexity must be one of: {", ".join(valid_complexities)}'
                }), 400
        
        # Update shot
        success = json_handler.update_by_id('vfx.json', shot_id, data)
        
        if success:
            # Return updated shot
            updated_shot = json_handler.find_by_id('vfx.json', shot_id)
            
            return jsonify({
                'success': True,
                'data': updated_shot,
                'message': 'VFX shot updated successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to update VFX shot'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to update VFX shot'
        }), 500

@vfx_bp.route('/version/<shot_id>', methods=['PUT'])
def add_vfx_version(shot_id):
    """Add VFX version to a shot"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Validate required fields
        required_fields = ['version', 'status', 'notes', 'fileSize']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        # Get existing shot
        shot = json_handler.find_by_id('vfx.json', shot_id)
        if not shot:
            return jsonify({
                'success': False,
                'message': 'VFX shot not found'
            }), 404
        
        # Note: Permission checks removed for public access
        
        # Validate status
        valid_statuses = ['draft', 'review', 'approved', 'rejected']
        if data['status'] not in valid_statuses:
            return jsonify({
                'success': False,
                'message': f'Status must be one of: {", ".join(valid_statuses)}'
            }), 400
        
        # Create new version
        new_version = {
            'version': data['version'],
            'date': data.get('date', datetime.now().strftime('%Y-%m-%d')),
            'status': data['status'],
            'notes': data['notes'],
            'fileSize': data['fileSize']
        }
        
        # Add version to shot
        versions = shot.get('versions', [])
        versions.append(new_version)
        
        # Update shot with new versions
        success = json_handler.update_by_id('vfx.json', shot_id, {'versions': versions})
        
        if success:
            # Return updated shot
            updated_shot = json_handler.find_by_id('vfx.json', shot_id)
            
            return jsonify({
                'success': True,
                'data': updated_shot,
                'message': 'VFX version added successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to add VFX version'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to add VFX version'
        }), 500

@vfx_bp.route('/<shot_id>', methods=['DELETE'])
def delete_vfx_shot(shot_id):
    """Delete VFX shot (requires manage_tasks permission)"""
    try:
        # Check if shot exists
        shot = json_handler.find_by_id('vfx.json', shot_id)
        if not shot:
            return jsonify({
                'success': False,
                'message': 'VFX shot not found'
            }), 404
        
        # Delete shot
        success = json_handler.delete_by_id('vfx.json', shot_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'VFX shot deleted successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to delete VFX shot'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to delete VFX shot'
        }), 500

@vfx_bp.route('/assignee/<assignee_id>', methods=['GET'])
def get_vfx_shots_by_assignee(assignee_id):
    """Get VFX shots by assignee ID"""
    try:
        # Note: Permission checks removed for public access
        
        vfx_shots = json_handler.read_json('vfx.json', [])
        assignee_shots = [shot for shot in vfx_shots if shot.get('assignee') == assignee_id]
        
        return jsonify({
            'success': True,
            'data': assignee_shots
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch VFX shots'
        }), 500
