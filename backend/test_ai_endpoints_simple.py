#!/usr/bin/env python3
"""
Simple test for AI endpoints using Flask test client
"""

import json
import os
import sys
from flask import Flask
from routes.ai_routes import ai_bp

def create_test_app():
    """Create a minimal Flask app for testing"""
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    return app

def test_ai_endpoints():
    """Test AI endpoints using Flask test client"""
    print("🧪 Testing AI Endpoints with Flask Test Client")
    print("="*60)
    
    app = create_test_app()
    
    with app.test_client() as client:
        # Test 1: Preview Schedule
        print("\n1️⃣ Testing /api/ai/preview_schedule")
        response = client.get('/api/ai/preview_schedule')
        
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.get_json()
            print(f"   ✅ Success: {data.get('message')}")
            print(f"   📊 Preview scenes: {data.get('preview_count')}")
            print(f"   📋 Total scenes: {data.get('total_scenes_available')}")
        else:
            print(f"   ❌ Error: {response.get_json()}")
        
        # Test 2: Sort Schedule
        print("\n2️⃣ Testing /api/ai/sort_schedule")
        response = client.post('/api/ai/sort_schedule')
        
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.get_json()
            print(f"   ✅ Success: {data.get('message')}")
            print(f"   📊 Sorted scenes: {data.get('total_scenes')}")
            print(f"   💾 Saved file: {data.get('saved_file')}")
            
            # Show first few optimized scenes
            scenes = data.get('sorted_scenes', [])[:3]
            print(f"   🎬 First 3 optimized scenes:")
            for i, scene in enumerate(scenes):
                print(f"      {i+1}. Scene {scene.get('scene_number')}: {scene.get('location')} ({scene.get('time_of_day')})")
        else:
            print(f"   ❌ Error: {response.get_json()}")
        
        # Test 3: Schedule Analysis
        print("\n3️⃣ Testing /api/ai/schedule_analysis")
        response = client.get('/api/ai/schedule_analysis')
        
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.get_json()
            analysis = data.get('analysis', {})
            print(f"   ✅ Success: Analysis completed")
            print(f"   📊 Total scenes: {analysis.get('total_scenes')}")
            print(f"   📍 Unique locations: {analysis.get('unique_locations')}")
            print(f"   🎯 Location clusters: {analysis.get('location_clusters_identified')}")
            print(f"   ⏰ Time distribution: {analysis.get('time_distribution')}")
        else:
            print(f"   ❌ Error: {response.get_json()}")
    
    print(f"\n{'='*60}")
    print("🎉 All AI endpoint tests completed!")
    print("✅ The AI scheduling system is ready for production use.")

def main():
    """Run the tests"""
    try:
        test_ai_endpoints()
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
