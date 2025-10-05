from flask import Blueprint, jsonify, request
import os
import json
from typing import List, Dict, Any, Tuple
import re
from collections import defaultdict
from utils.gemini_scheduler import GeminiScheduler
# from utils.schedule_sync import ensure_scene_titles_updated  # Temporarily disabled

# Create blueprint
ai_bp = Blueprint('ai', __name__)

# Data directory path
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')

class ScheduleOptimizer:
    """AI-assisted schedule optimization logic"""
    
    def __init__(self):
        self.time_priority = {'DAY': 1, 'DUSK': 2, 'NIGHT': 3}
    
    def extract_location_keywords(self, location: str) -> List[str]:
        """Extract main keywords from location for clustering"""
        # Remove common words and extract meaningful keywords
        common_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', '-'}
        
        # Clean and split location
        cleaned = re.sub(r'[^\w\s]', ' ', location.lower())
        words = [word.strip() for word in cleaned.split() if word.strip() and word not in common_words]
        
        # Return meaningful keywords
        return words[:3]  # Take first 3 meaningful words
    
    def calculate_location_similarity(self, loc1: str, loc2: str) -> float:
        """Calculate similarity score between two locations"""
        keywords1 = set(self.extract_location_keywords(loc1))
        keywords2 = set(self.extract_location_keywords(loc2))
        
        if not keywords1 or not keywords2:
            return 0.0
        
        # Jaccard similarity
        intersection = keywords1.intersection(keywords2)
        union = keywords1.union(keywords2)
        
        return len(intersection) / len(union) if union else 0.0
    
    def cluster_locations(self, scenes: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """Group scenes by location similarity"""
        clusters = defaultdict(list)
        processed_scenes = set()
        
        for i, scene in enumerate(scenes):
            if i in processed_scenes:
                continue
            
            location = scene.get('location', '')
            cluster_key = location
            cluster_scenes = [scene]
            processed_scenes.add(i)
            
            # Find similar locations
            for j, other_scene in enumerate(scenes):
                if j in processed_scenes or i == j:
                    continue
                
                other_location = other_scene.get('location', '')
                similarity = self.calculate_location_similarity(location, other_location)
                
                # If similarity > 0.3, consider them related
                if similarity > 0.3:
                    cluster_scenes.append(other_scene)
                    processed_scenes.add(j)
                    # Update cluster key to represent the group
                    if similarity > 0.5:
                        cluster_key = f"{location} & {other_location}"
            
            clusters[cluster_key] = cluster_scenes
        
        return dict(clusters)
    
    def sort_scenes_within_cluster(self, scenes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Sort scenes within a location cluster by time of day"""
        return sorted(scenes, key=lambda x: (
            self.time_priority.get(x.get('time_of_day', 'DAY'), 1),
            x.get('scene_number', 0)
        ))
    
    def optimize_schedule(self, scenes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Main optimization logic"""
        # Step 1: Cluster by location similarity
        location_clusters = self.cluster_locations(scenes)
        
        # Step 2: Sort within each cluster by time of day
        optimized_scenes = []
        for cluster_key, cluster_scenes in location_clusters.items():
            sorted_cluster = self.sort_scenes_within_cluster(cluster_scenes)
            optimized_scenes.extend(sorted_cluster)
        
        return optimized_scenes

def load_json_file(filename: str) -> Dict[str, Any]:
    """Load JSON file with error handling"""
    file_path = os.path.join(DATA_DIR, filename)
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File {filename} not found in data directory")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in {filename}: {str(e)}")
    except Exception as e:
        raise Exception(f"Error reading {filename}: {str(e)}")

def save_json_file(data: Dict[str, Any], filename: str) -> None:
    """Save JSON file with error handling"""
    file_path = os.path.join(DATA_DIR, filename)
    
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        raise Exception(f"Error saving {filename}: {str(e)}")

@ai_bp.route('/sort_schedule', methods=['POST'])
def sort_schedule():
    """
    AI-assisted schedule sorting endpoint
    Loads production_schedule.json and shooting_schedule.json, optimizes the order,
    and returns/saves the optimized schedule
    """
    try:
        # Load both JSON files
        production_data = load_json_file('production_schedule.json')
        shooting_data = load_json_file('shooting_schedule.json')
        
        # Extract scenes from production_schedule (primary source)
        scenes = production_data.get('shooting_schedule', [])
        
        if not scenes:
            return jsonify({
                'status': 'error',
                'message': 'No scenes found in production_schedule.json'
            }), 400
        
        # Initialize optimizer and optimize
        optimizer = ScheduleOptimizer()
        optimized_scenes = optimizer.optimize_schedule(scenes)
        
        # Create optimized schedule structure
        optimized_data = {
            'project_info': production_data.get('project_info', {}),
            'optimization_info': {
                'optimized_at': '2025-10-05T14:20:13+05:30',
                'optimization_method': 'AI-assisted location clustering and time sorting',
                'total_scenes': len(optimized_scenes)
            },
            'optimized_schedule': optimized_scenes,
            'actor_schedule_summary': production_data.get('actor_schedule_summary', {}),
            'location_summary': production_data.get('location_summary', {}),
            'extras_summary': production_data.get('extras_summary', {})
        }
        
        # Save optimized schedule
        save_json_file(optimized_data, 'optimized_schedule.json')
        
        # Prepare response with simplified scene info
        sorted_scenes = [
            {
                'scene_number': scene.get('scene_number'),
                'scene_title': scene.get('scene_title'),
                'location': scene.get('location'),
                'time_of_day': scene.get('time_of_day'),
                'actors': [actor.get('actor_name') for actor in scene.get('actors', [])],
                'extras': [extra.get('role') for extra in scene.get('extras', [])]
            }
            for scene in optimized_scenes
        ]
        
        return jsonify({
            'status': 'success',
            'message': 'Schedule optimized successfully',
            'total_scenes': len(sorted_scenes),
            'sorted_scenes': sorted_scenes,
            'saved_file': 'optimized_schedule.json'
        })
    
    except FileNotFoundError as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 404
    
    except ValueError as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Internal server error: {str(e)}'
        }), 500

@ai_bp.route('/preview_schedule', methods=['GET'])
def preview_schedule():
    """
    Preview endpoint - returns top 5 optimized scenes for UI preview
    """
    try:
        # Load production schedule
        production_data = load_json_file('production_schedule.json')
        scenes = production_data.get('shooting_schedule', [])
        
        if not scenes:
            return jsonify({
                'status': 'error',
                'message': 'No scenes found in production_schedule.json'
            }), 400
        
        # Initialize optimizer and optimize
        optimizer = ScheduleOptimizer()
        optimized_scenes = optimizer.optimize_schedule(scenes)
        
        # Get top 5 scenes for preview
        preview_scenes = optimized_scenes[:5]
        
        # Prepare simplified response
        preview_data = [
            {
                'scene_number': scene.get('scene_number'),
                'scene_title': scene.get('scene_title'),
                'location': scene.get('location'),
                'time_of_day': scene.get('time_of_day'),
                'estimated_duration': scene.get('estimated_duration'),
                'actor_count': len(scene.get('actors', [])),
                'extras_count': len(scene.get('extras', []))
            }
            for scene in preview_scenes
        ]
        
        return jsonify({
            'status': 'success',
            'message': 'Schedule preview generated',
            'total_scenes_available': len(optimized_scenes),
            'preview_count': len(preview_data),
            'preview_scenes': preview_data
        })
    
    except FileNotFoundError as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 404
    
    except ValueError as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Internal server error: {str(e)}'
        }), 500

@ai_bp.route('/generate_gemini_schedule', methods=['POST'])
def generate_gemini_schedule():
    """
    Generate AI-powered schedule using Gemini AI based on shooting_schedule.json
    This is the main endpoint for the "Generate AI Schedule" button
    """
    try:
        # Load shooting schedule data (primary input)
        shooting_data = load_json_file('shooting_schedule.json')
        
        if not shooting_data.get('shooting_schedule', {}).get('scenes'):
            return jsonify({
                'status': 'error',
                'message': 'No scenes found in shooting_schedule.json'
            }), 400
        
        # Get optional parameters from request
        request_data = request.get_json() or {}
        actor_constraints = request_data.get('actor_constraints', {})
        location_preferences = request_data.get('location_preferences', {})
        
        # Initialize Gemini scheduler
        gemini_scheduler = GeminiScheduler()
        
        # Generate schedule using Gemini AI
        result = gemini_scheduler.generate_schedule(shooting_data)
        
        # Check if there was an error
        if 'error' in result:
            # Still return the mock schedule but indicate it's a fallback
            return jsonify({
                'status': 'warning',
                'message': f'Gemini AI unavailable, using fallback algorithm: {result["error"]}',
                'schedule_data': result.get('optimized_schedule', {}),
                'generation_info': result.get('generation_info', {}),
                'is_mock': result.get('mock_response', False)
            }), 200
        
        # Save the generated schedule
        output_filename = 'gemini_optimized_schedule.json'
        save_json_file(result, output_filename)
        
        return jsonify({
            'status': 'success',
            'message': 'AI schedule generated successfully using Gemini',
            'schedule_data': result.get('optimized_schedule', {}),
            'generation_info': result.get('generation_info', {}),
            'saved_file': output_filename,
            'total_shooting_days': result.get('optimized_schedule', {}).get('total_shooting_days', 0)
        })
    
    except FileNotFoundError as e:
        return jsonify({
            'status': 'error',
            'message': f'Required file not found: {str(e)}'
        }), 404
    
    except ValueError as e:
        return jsonify({
            'status': 'error',
            'message': f'Invalid data format: {str(e)}'
        }), 400
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Schedule generation failed: {str(e)}'
        }), 500

@ai_bp.route('/schedule_analysis', methods=['GET'])
def schedule_analysis():
    """
    Additional endpoint to analyze current schedule and provide insights
    """
    try:
        # Use shooting_schedule.json as primary source
        shooting_data = load_json_file('shooting_schedule.json')
        scenes = shooting_data.get('shooting_schedule', {}).get('scenes', [])
        
        if not scenes:
            return jsonify({
                'status': 'error',
                'message': 'No scenes found in shooting_schedule.json'
            }), 400
        
        # Analyze current schedule
        locations = {}
        time_distribution = {'DAY': 0, 'DUSK': 0, 'NIGHT': 0}
        actor_workload = defaultdict(int)
        
        for scene in scenes:
            # Location analysis
            location = scene.get('location', 'Unknown')
            if location not in locations:
                locations[location] = []
            locations[location].append(scene.get('scene_number'))
            
            # Time distribution
            time_of_day = scene.get('time_of_day', 'DAY')
            time_distribution[time_of_day] += 1
            
            # Actor workload
            for actor in scene.get('actors', []):
                actor_name = actor.get('name')  # Note: different structure in shooting_schedule.json
                if actor_name:
                    actor_workload[actor_name] += 1
        
        # Calculate optimization potential
        optimizer = ScheduleOptimizer()
        # Convert shooting_schedule format to production_schedule format for analysis
        converted_scenes = []
        for scene in scenes:
            converted_scene = {
                'scene_number': scene.get('scene_number'),
                'location': scene.get('location'),
                'time_of_day': scene.get('time_of_day'),
                'actors': [{'actor_name': actor.get('name')} for actor in scene.get('actors', [])]
            }
            converted_scenes.append(converted_scene)
        
        location_clusters = optimizer.cluster_locations(converted_scenes)
        
        analysis = {
            'total_scenes': len(scenes),
            'unique_locations': len(locations),
            'location_clusters_identified': len(location_clusters),
            'time_distribution': time_distribution,
            'busiest_actors': dict(sorted(actor_workload.items(), key=lambda x: x[1], reverse=True)[:5]),
            'locations_breakdown': {loc: len(scene_nums) for loc, scene_nums in locations.items()},
            'optimization_potential': {
                'can_group_locations': len(location_clusters) < len(locations),
                'location_savings': len(locations) - len(location_clusters)
            }
        }
        
        return jsonify({
            'status': 'success',
            'analysis': analysis,
            'data_source': 'shooting_schedule.json'
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Analysis failed: {str(e)}'
        }), 500

@ai_bp.route('/sync_scene_titles', methods=['POST'])
def sync_scene_titles():
    """
    Synchronize scene titles from script.json to shooting_schedule.json
    This ensures the shooting schedule has the latest scene titles from the script
    """
    try:
        success = ensure_scene_titles_updated()
        
        if success:
            return jsonify({
                'status': 'success',
                'message': 'Scene titles synchronized successfully',
                'data_source': 'script.json -> shooting_schedule.json'
            }), 200
        else:
            return jsonify({
                'status': 'error',
                'message': 'Failed to synchronize scene titles'
            }), 500
            
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Scene title sync failed: {str(e)}'
        }), 500
