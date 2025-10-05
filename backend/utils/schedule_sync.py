"""
Utility to synchronize shooting_schedule.json with script.json scene titles
Ensures scene titles are always up-to-date from the script
"""

import json
import os
from datetime import datetime
from .json_handler import json_handler

def sync_scene_titles_from_script():
    """
    Synchronize scene titles from script.json to shooting_schedule.json
    This ensures the shooting schedule always has the latest scene titles
    """
    try:
        # Load script data
        script_data = json_handler.read_json('script.json', {})
        if not script_data or 'scenes' not in script_data:
            print("No script data found or no scenes in script.json")
            return False
        
        # Load shooting schedule data
        shooting_data = json_handler.read_json('shooting_schedule.json', {})
        if not shooting_data or 'shooting_schedule' not in shooting_data:
            print("No shooting schedule data found")
            return False
        
        # Create a mapping of scene numbers to titles from script.json
        script_scene_titles = {}
        for scene in script_data['scenes']:
            scene_number = scene.get('scene_number', scene.get('number'))
            scene_title = scene.get('title', '')
            if scene_number and scene_title:
                script_scene_titles[int(scene_number)] = scene_title
        
        # Update shooting schedule with scene titles from script
        shooting_scenes = shooting_data['shooting_schedule'].get('scenes', [])
        updated_count = 0
        
        for scene in shooting_scenes:
            scene_number = scene.get('scene_number')
            if scene_number and int(scene_number) in script_scene_titles:
                new_title = script_scene_titles[int(scene_number)]
                old_title = scene.get('scene_title', '')
                
                if old_title != new_title:
                    scene['scene_title'] = new_title
                    updated_count += 1
                    print(f"Updated scene {scene_number}: '{old_title}' -> '{new_title}'")
        
        # Save updated shooting schedule if changes were made
        if updated_count > 0:
            shooting_data['shooting_schedule']['last_updated'] = datetime.now().isoformat()
            success = json_handler.write_json('shooting_schedule.json', shooting_data)
            
            if success:
                print(f"Successfully updated {updated_count} scene titles in shooting_schedule.json")
                return True
            else:
                print("Failed to save updated shooting schedule")
                return False
        else:
            print("No scene title updates needed - all titles are already synchronized")
            return True
            
    except Exception as e:
        print(f"Error synchronizing scene titles: {e}")
        return False

def create_shooting_schedule_from_script():
    """
    Create or update shooting_schedule.json from script.json
    This ensures all scenes from the script are included in the shooting schedule
    """
    try:
        # Load script data
        script_data = json_handler.read_json('script.json', {})
        if not script_data or 'scenes' not in script_data:
            print("No script data found or no scenes in script.json")
            return False
        
        # Create shooting schedule structure
        shooting_schedule = {
            "project_title": script_data.get('title', 'Untitled Project'),
            "shooting_schedule": {
                "total_scenes": len(script_data['scenes']),
                "total_shooting_days": 0,  # Will be calculated by AI
                "created_date": datetime.now().strftime('%Y-%m-%d'),
                "last_updated": datetime.now().isoformat(),
                "scenes": []
            }
        }
        
        # Convert script scenes to shooting schedule format
        for scene in script_data['scenes']:
            shooting_scene = {
                "scene_number": scene.get('scene_number', scene.get('number', 1)),
                "scene_title": scene.get('title', ''),
                "location": scene.get('location', ''),
                "time_of_day": scene.get('day_night', scene.get('timeOfDay', 'DAY')),
                "estimated_duration_minutes": scene.get('estimated_runtime_minutes', scene.get('estimatedDuration', 60)),
                "extras": scene.get('extras', []),
                "actors": [],
                "shooting_date": "TBD",
                "status": scene.get('scene_status', scene.get('status', 'Not Shot'))
            }
            
            # Convert characters to actors format
            characters = scene.get('characters', [])
            for character in characters:
                actor = {
                    "name": character,
                    "character": character
                }
                shooting_scene["actors"].append(actor)
            
            shooting_schedule["shooting_schedule"]["scenes"].append(shooting_scene)
        
        # Save the shooting schedule
        success = json_handler.write_json('shooting_schedule.json', shooting_schedule)
        
        if success:
            print(f"Successfully created shooting_schedule.json with {len(shooting_schedule['shooting_schedule']['scenes'])} scenes")
            return True
        else:
            print("Failed to save shooting schedule")
            return False
            
    except Exception as e:
        print(f"Error creating shooting schedule from script: {e}")
        return False

def ensure_scene_titles_updated():
    """
    Ensure scene titles are up-to-date in shooting_schedule.json
    This is the main function to call when you want to sync scene titles
    """
    print("🔄 Synchronizing scene titles from script.json to shooting_schedule.json...")
    
    # First try to sync existing shooting schedule
    if sync_scene_titles_from_script():
        print("✅ Scene titles synchronized successfully")
        return True
    
    # If sync fails, try to recreate the shooting schedule
    print("⚠️  Sync failed, attempting to recreate shooting schedule...")
    if create_shooting_schedule_from_script():
        print("✅ Shooting schedule recreated with updated scene titles")
        return True
    
    print("❌ Failed to update scene titles")
    return False

if __name__ == "__main__":
    # Run the sync when this file is executed directly
    ensure_scene_titles_updated()
