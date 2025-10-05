#!/usr/bin/env python3
"""
Test Gemini API response structure
"""

import requests
import json

def test_gemini_response():
    """Test the Gemini API response structure"""
    try:
        print("🧪 Testing Gemini API Response Structure")
        print("=" * 50)
        
        response = requests.post('http://localhost:5000/api/ai/generate_gemini_schedule', json={})
        data = response.json()
        
        print(f"Status: {data.get('status')}")
        print(f"Message: {data.get('message', 'No message')}")
        print(f"Has schedule_data: {'schedule_data' in data}")
        
        if 'schedule_data' in data:
            schedule = data['schedule_data']
            daily_schedules = schedule.get('daily_schedules', [])
            print(f"Daily schedules count: {len(daily_schedules)}")
            
            if daily_schedules:
                first_day = daily_schedules[0]
                scenes = first_day.get('scenes', [])
                print(f"First day scenes count: {len(scenes)}")
                
                if scenes:
                    first_scene = scenes[0]
                    print(f"First scene structure:")
                    for key, value in first_scene.items():
                        print(f"  {key}: {value}")
                    
                    # Check if scene has scene_number and scene_title
                    scene_number = first_scene.get('scene_number', 'Missing')
                    scene_title = first_scene.get('scene_title', 'Missing')
                    print(f"\nScene Number: {scene_number}")
                    print(f"Scene Title: {scene_title}")
                    
                    if scene_title != 'Missing':
                        print("✅ Scene titles are working!")
                    else:
                        print("⚠️  Scene titles are missing - using scene numbers only")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    test_gemini_response()
