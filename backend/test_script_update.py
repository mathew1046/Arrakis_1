#!/usr/bin/env python3
"""
Test script to verify script update functionality
"""
import requests
import json

def test_script_update():
    """Test the script update endpoint"""
    
    # Test data that matches the expected structure
    test_data = {
        "title": "Test Script",
        "version": "1.0",
        "scenes": [
            {
                "id": "1",
                "number": "1",
                "description": "Test scene description",
                "location": "Test Location",
                "timeOfDay": "Day",
                "estimatedDuration": 5,
                "estimated_runtime_minutes": 5,
                "characters": ["Character 1", "Character 2"],
                "vfx": True,
                "vfx_required": True,
                "status": "draft"
            },
            {
                "id": "2", 
                "number": "2",
                "description": "Another test scene",
                "location": "Another Location",
                "timeOfDay": "Night",
                "estimatedDuration": 3,
                "estimated_runtime_minutes": 3,
                "characters": ["Character 1"],
                "vfx": False,
                "vfx_required": False,
                "status": "draft"
            }
        ]
    }
    
    try:
        # Make the request
        response = requests.put(
            'http://localhost:5000/api/script',
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Script update successful!")
            return True
        else:
            print("❌ Script update failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error testing script update: {str(e)}")
        return False

if __name__ == '__main__':
    print("Testing script update endpoint...")
    test_script_update()
