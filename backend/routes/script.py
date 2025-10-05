from flask import Blueprint, request, jsonify, current_app
from utils.json_handler import json_handler
from datetime import datetime
import os

script_bp = Blueprint('script', __name__)

from utils.data_transformer import transform_script_data

@script_bp.route('', methods=['GET'])
def get_script():
    """Get and transform script data"""
    try:
        script_data = json_handler.read_json('script.json', {})
        
        if not script_data:
            return jsonify({
                'success': False,
                'message': 'Script data not found'
            }), 404
        
        transformed_script = transform_script_data(script_data)
        
        return jsonify({
            'success': True,
            'data': transformed_script
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Failed to fetch or transform script: {e}")
        return jsonify({
            'success': False,
            'message': 'Failed to fetch script'
        }), 500

@script_bp.route('', methods=['PUT'])
def update_script():
    """Update script data (requires manage_script permission)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        script = json_handler.read_json('script.json', {})
        
        if not script:
            return jsonify({
                'success': False,
                'message': 'Script data not found'
            }), 404
        
        # Update script metadata
        if 'title' in data:
            script['title'] = data['title']
        if 'version' in data:
            script['version'] = data['version']
        
        # Update last modified
        script['lastModified'] = datetime.now().strftime('%Y-%m-%d')
        
        # Recalculate totals if scenes are updated
        if 'scenes' in data:
            scenes = data['scenes']
            script['scenes'] = scenes
            script['totalScenes'] = len(scenes)
            script['totalEstimatedDuration'] = sum(scene.get('estimatedDuration', 0) for scene in scenes)
            script['vfxScenes'] = sum(1 for scene in scenes if scene.get('vfx', False))
            
            # Update locations and characters
            locations = set()
            characters = set()
            for scene in scenes:
                if scene.get('location'):
                    locations.add(scene['location'])
                if scene.get('characters'):
                    characters.update(scene['characters'])
            
            script['locations'] = list(locations)
            script['characters'] = list(characters)
        
        success = json_handler.write_json('script.json', script)
        
        if success:
            return jsonify({
                'success': True,
                'data': script,
                'message': 'Script updated successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to update script'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to update script'
        }), 500

@script_bp.route('/scene/<scene_id>', methods=['PUT'])
def update_scene(scene_id):
    """Update specific scene (requires script management permissions)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        script = json_handler.read_json('script.json', {})
        
        if not script:
            return jsonify({
                'success': False,
                'message': 'Script data not found'
            }), 404
        
        scenes = script.get('scenes', [])
        scene_found = False
        
        for i, scene in enumerate(scenes):
            if scene.get('id') == scene_id:
                # Update scene with new data
                scenes[i] = {**scene, **data}
                scene_found = True
                break
        
        if not scene_found:
            return jsonify({
                'success': False,
                'message': 'Scene not found'
            }), 404
        
        # Update script metadata
        script['scenes'] = scenes
        script['lastModified'] = datetime.now().strftime('%Y-%m-%d')
        script['totalScenes'] = len(scenes)
        script['totalEstimatedDuration'] = sum(scene.get('estimated_runtime_minutes', scene.get('estimatedDuration', 0)) for scene in scenes)
        script['vfxScenes'] = sum(1 for scene in scenes if scene.get('vfx_required', scene.get('vfx', False)))
        
        # Update locations and characters
        locations = set()
        characters = set()
        for scene in scenes:
            if scene.get('location'):
                locations.add(scene['location'])
            if scene.get('characters'):
                characters.update(scene['characters'])
        
        script['locations'] = list(locations)
        script['characters'] = list(characters)
        
        success = json_handler.write_json('script.json', script)
        
        if success:
            return jsonify({
                'success': True,
                'data': script,
                'message': 'Scene updated successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to update scene'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to update scene'
        }), 500

@script_bp.route('/text', methods=['GET', 'PUT'])
def script_text():
    """Get or update raw script text"""
    try:
        if request.method == 'GET':
            # Read script.txt file
            script_path = os.path.join(current_app.config['DATA_DIR'], 'script.txt')
            print(f"Looking for script.txt at: {script_path}")  # Debug log
            
            if os.path.exists(script_path):
                with open(script_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                return jsonify({
                    'success': True,
                    'data': {'content': content}
                }), 200
            else:
                # Create empty file if it doesn't exist
                os.makedirs(os.path.dirname(script_path), exist_ok=True)
                with open(script_path, 'w', encoding='utf-8') as f:
                    f.write('')
                return jsonify({
                    'success': True,
                    'data': {'content': ''}
                }), 200
        
        elif request.method == 'PUT':
            data = request.get_json()
            if not data or 'content' not in data:
                return jsonify({
                    'success': False,
                    'message': 'Content is required'
                }), 400
            
            # Write to script.txt file
            script_path = os.path.join(current_app.config['DATA_DIR'], 'script.txt')
            print(f"Writing script.txt to: {script_path}")  # Debug log
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(script_path), exist_ok=True)
            
            with open(script_path, 'w', encoding='utf-8') as f:
                f.write(data['content'])
            
            return jsonify({
                'success': True,
                'message': 'Script text updated successfully'
            }), 200
            
    except Exception as e:
        print(f"Error in script_text: {str(e)}")  # Debug log
        return jsonify({
            'success': False,
            'message': f'Failed to handle script text: {str(e)}'
        }), 500

@script_bp.route('/scenes', methods=['POST'])
def add_scene():
    """Add new scene (requires manage_script permission)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Validate required fields (support both old and new format)
        required_fields = ['scene_number', 'title', 'location', 'day_night', 'estimated_runtime_minutes']
        # Check for legacy field names if new ones not present
        if not data.get('scene_number') and data.get('number'):
            data['scene_number'] = data['number']
        if not data.get('title') and data.get('description'):
            data['title'] = data['description']
        if not data.get('day_night') and data.get('timeOfDay'):
            data['day_night'] = data['timeOfDay']
        if not data.get('estimated_runtime_minutes') and data.get('estimatedDuration'):
            data['estimated_runtime_minutes'] = data['estimatedDuration']
            
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        script = json_handler.read_json('script.json', {})
        
        if not script:
            return jsonify({
                'success': False,
                'message': 'Script data not found'
            }), 404
        
        # Create new scene with the new format
        new_scene = {
            'id': json_handler.get_next_id('script.json'),
            'scene_number': data.get('scene_number', data.get('number', '1')),
            'title': data.get('title', ''),
            'int_ext': data.get('int_ext', 'INT'),
            'day_night': data.get('day_night', data.get('timeOfDay', 'DAY')),
            'location': data.get('location', ''),
            'estimated_runtime_minutes': int(data.get('estimated_runtime_minutes', data.get('estimatedDuration', 0))),
            'scene_description': data.get('scene_description', data.get('description', '')),
            'characters': data.get('characters', []),
            'extras': data.get('extras', []),
            'props': data.get('props', []),
            'wardrobe': data.get('wardrobe', []),
            'makeup_hair': data.get('makeup_hair', []),
            'vehicles_animals_fx': data.get('vehicles_animals_fx', []),
            'set_dressing': data.get('set_dressing', []),
            'special_equipment': data.get('special_equipment', []),
            'stunts_vfx': data.get('stunts_vfx', []),
            'sound_requirements': data.get('sound_requirements', []),
            'mood_tone': data.get('mood_tone', ''),
            'scene_complexity': data.get('scene_complexity', 'Medium'),
            'vfx_required': data.get('vfx_required', False),
            'vfx_details': data.get('vfx_details', 'N/A'),
            'scene_status': data.get('scene_status', 'Not Shot'),
            # Legacy fields for backward compatibility
            'number': data.get('scene_number', data.get('number', '1')),
            'description': data.get('scene_description', data.get('description', '')),
            'timeOfDay': data.get('day_night', data.get('timeOfDay', 'DAY')),
            'estimatedDuration': int(data.get('estimated_runtime_minutes', data.get('estimatedDuration', 0))),
            'vfx': data.get('vfx_required', False),
            'status': data.get('scene_status', 'Not Shot'),
            'notes': data.get('notes', '')
        }
        
        # Add to scenes
        scenes = script.get('scenes', [])
        scenes.append(new_scene)
        
        # Update script metadata
        script['scenes'] = scenes
        script['lastModified'] = datetime.now().strftime('%Y-%m-%d')
        script['totalScenes'] = len(scenes)
        script['totalEstimatedDuration'] = sum(scene.get('estimated_runtime_minutes', scene.get('estimatedDuration', 0)) for scene in scenes)
        script['vfxScenes'] = sum(1 for scene in scenes if scene.get('vfx_required', scene.get('vfx', False)))
        
        # Update locations and characters
        locations = set()
        characters = set()
        for scene in scenes:
            if scene.get('location'):
                locations.add(scene['location'])
            if scene.get('characters'):
                characters.update(scene['characters'])
        
        script['locations'] = list(locations)
        script['characters'] = list(characters)
        
        success = json_handler.write_json('script.json', script)
        
        if success:
            return jsonify({
                'success': True,
                'data': script,
                'message': 'Scene added successfully'
            }), 201
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to add scene'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to add scene'
        }), 500

@script_bp.route('/scenes', methods=['GET'])
def get_scenes():
    """Get all scenes"""
    try:
        script = json_handler.read_json('script.json', {})
        
        if not script:
            return jsonify({
                'success': False,
                'message': 'Script data not found'
            }), 404
        
        scenes = script.get('scenes', [])
        
        return jsonify({
            'success': True,
            'data': scenes
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch scenes'
        }), 500

@script_bp.route('/scene/<scene_id>', methods=['GET'])
def get_scene(scene_id):
    """Get specific scene by ID"""
    try:
        script = json_handler.read_json('script.json', {})
        
        if not script:
            return jsonify({
                'success': False,
                'message': 'Script data not found'
            }), 404
        
        scenes = script.get('scenes', [])
        scene = next((s for s in scenes if s.get('id') == scene_id), None)
        
        if not scene:
            return jsonify({
                'success': False,
                'message': 'Scene not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': scene
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch scene'
        }), 500
