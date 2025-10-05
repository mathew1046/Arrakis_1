#!/usr/bin/env python3
"""
Debug script to check the exact response structure from Gemini endpoint
"""

import requests
import json
from pprint import pprint

def test_gemini_response():
    """Test what the Gemini endpoint actually returns"""
    print("🔍 Testing Gemini API Response Structure")
    print("="*50)
    
    url = 'http://localhost:5000/api/ai/generate_gemini_schedule'
    
    test_data = {
        "actor_constraints": {
            "Maya": {
                "max_consecutive_days": 3,
                "preferred_call_times": ["09:00", "10:00"]
            }
        },
        "location_preferences": {
            "Radio Station": {
                "setup_time_hours": 2,
                "weather_dependent": False
            }
        }
    }
    
    try:
        print(f"📡 Calling: {url}")
        print(f"📊 Payload: {json.dumps(test_data, indent=2)}")
        
        response = requests.post(
            url,
            headers={'Content-Type': 'application/json'},
            json=test_data,
            timeout=30
        )
        
        print(f"\n📈 Response Status: {response.status_code}")
        print(f"📋 Response Headers:")
        for key, value in response.headers.items():
            print(f"   {key}: {value}")
        
        if response.status_code == 200:
            response_json = response.json()
            print(f"\n✅ SUCCESS! Response structure:")
            print("="*40)
            pprint(response_json, width=80, depth=3)
            
            # Check specific fields
            print(f"\n🔍 Key Fields Check:")
            print(f"   'status' exists: {'status' in response_json}")
            print(f"   'status' value: {response_json.get('status', 'NOT FOUND')}")
            print(f"   'schedule_data' exists: {'schedule_data' in response_json}")
            print(f"   'message' exists: {'message' in response_json}")
            print(f"   'total_shooting_days' exists: {'total_shooting_days' in response_json}")
            
            # Show the exact structure for frontend
            print(f"\n📝 For Frontend (JavaScript):")
            print("   response.status =", repr(response_json.get('status')))
            print("   response.schedule_data =", 'EXISTS' if 'schedule_data' in response_json else 'MISSING')
            print("   response.message =", repr(response_json.get('message')))
            
        else:
            print(f"\n❌ ERROR Response:")
            print(f"   Status: {response.status_code}")
            print(f"   Text: {response.text}")
            
    except Exception as e:
        print(f"\n💥 Exception occurred: {e}")

if __name__ == "__main__":
    test_gemini_response()
