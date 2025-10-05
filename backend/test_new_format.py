#!/usr/bin/env python3
"""
Test API with new scene format
"""

import requests
import json

# API Configuration
BASE_URL = "http://localhost:5000"
API_BASE = f"{BASE_URL}/api"

def test_endpoint(method, endpoint, data=None, description=""):
    """Test a single endpoint"""
    url = f"{API_BASE}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url)
        elif method.upper() == "POST":
            response = requests.post(url, json=data)
        elif method.upper() == "PUT":
            response = requests.put(url, json=data)
        elif method.upper() == "DELETE":
            response = requests.delete(url)
        
        print(f"[{response.status_code}] {method} {endpoint}")
        print(f"   Description: {description}")
        
        try:
            response_data = response.json()
            # Truncate long responses for display
            response_str = json.dumps(response_data, indent=2)
            if len(response_str) > 500:
                response_str = response_str[:500] + "..."
            print(f"   Response: {response_str}")
        except:
            print(f"   Response: {response.text}")
        
        print()
        return response.status_code, response_data if response.headers.get('content-type', '').startswith('application/json') else response.text
        
    except requests.exceptions.ConnectionError:
        print(f"[ERROR] {method} {endpoint} - Connection Error: Make sure Flask server is running")
        return None, "Connection Error"
    except Exception as e:
        print(f"[ERROR] {method} {endpoint} - {str(e)}")
        return None, str(e)

def main():
    print("Testing New Scene Format API")
    print("=" * 40)
    
    # Test health check
    test_endpoint("GET", "/health", description="Health check")
    
    # Test script endpoints with new format
    print("Testing Script Management with New Format...")
    
    # Get current script
    test_endpoint("GET", "/script", description="Get current script data")
    
    # Test adding a scene with new format
    new_scene_data = {
        "scene_number": 1,
        "title": "EXT. CITY - NIGHT",
        "int_ext": "EXT",
        "day_night": "NIGHT",
        "location": "City",
        "estimated_runtime_minutes": 2,
        "scene_description": "Jake Sully, a combat vet in a wheelchair, is revealed after a vehicle screeches, looking up at the city and maglev trains overhead.",
        "characters": ["JAKE SULLY"],
        "extras": ["Crowd"],
        "props": ["Wheelchair", "Filter masks"],
        "wardrobe": ["Scruffy combat vet"],
        "makeup_hair": ["Scarred"],
        "vehicles_animals_fx": ["Vehicle", "Maglev Trains"],
        "set_dressing": ["Elevated tracks", "Advertising", "Traffic light"],
        "special_equipment": [],
        "stunts_vfx": [],
        "sound_requirements": [],
        "mood_tone": "Somber",
        "scene_complexity": "Medium",
        "vfx_required": False,
        "vfx_details": "N/A",
        "scene_status": "Not Shot"
    }
    
    test_endpoint("POST", "/script/scenes", new_scene_data, "Add scene with new format")
    
    # Test updating a scene
    update_data = {
        "scene_status": "In Progress",
        "mood_tone": "Tense"
    }
    
    test_endpoint("PUT", "/script/scene/1", update_data, "Update scene status")
    
    # Test getting all scenes
    test_endpoint("GET", "/script/scenes", description="Get all scenes")
    
    # Test getting specific scene
    test_endpoint("GET", "/script/scene/1", description="Get specific scene")
    
    # Test other endpoints
    print("Testing Other Endpoints...")
    test_endpoint("GET", "/users", description="Get users")
    test_endpoint("GET", "/tasks", description="Get tasks")
    test_endpoint("GET", "/budget", description="Get budget")
    test_endpoint("GET", "/vfx", description="Get VFX shots")
    test_endpoint("GET", "/assets", description="Get assets")
    
    print("=" * 40)
    print("New Format API Testing Complete!")

if __name__ == "__main__":
    main()
