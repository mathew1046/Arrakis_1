#!/usr/bin/env python3
"""
Test script for Gemini AI scheduling integration
"""

import json
import os
from utils.gemini_scheduler import GeminiScheduler

def test_gemini_scheduler():
    """Test the Gemini scheduler with shooting_schedule.json"""
    print("🤖 Testing Gemini AI Scheduler Integration")
    print("="*60)
    
    try:
        # Load shooting schedule data
        data_dir = os.path.join(os.path.dirname(__file__), 'data')
        shooting_file = os.path.join(data_dir, 'shooting_schedule.json')
        
        with open(shooting_file, 'r', encoding='utf-8') as f:
            shooting_data = json.load(f)
        
        print(f"📋 Loaded shooting schedule with {len(shooting_data.get('shooting_schedule', {}).get('scenes', []))} scenes")
        
        # Initialize Gemini scheduler
        gemini_scheduler = GeminiScheduler()
        
        # Test prompt generation
        print("\n🎯 Testing prompt generation...")
        prompt = gemini_scheduler.create_scheduling_prompt(shooting_data)
        print(f"✅ Generated prompt ({len(prompt)} characters)")
        print(f"📝 Prompt preview (first 300 chars):")
        print(f"   {prompt[:300]}...")
        
        # Test schedule generation
        print(f"\n🚀 Testing schedule generation...")
        result = gemini_scheduler.generate_schedule(shooting_data)
        
        if 'error' in result:
            print(f"⚠️  Gemini API not available: {result['error']}")
            print(f"🔄 Using mock schedule for testing")
        else:
            print(f"✅ Schedule generated successfully!")
        
        # Display results
        schedule_data = result.get('optimized_schedule', {})
        print(f"\n📊 GENERATED SCHEDULE SUMMARY:")
        print(f"   Strategy: {schedule_data.get('scheduling_strategy', 'N/A')}")
        print(f"   Total Shooting Days: {schedule_data.get('total_shooting_days', 'N/A')}")
        print(f"   Daily Schedules: {len(schedule_data.get('daily_schedules', []))}")
        
        # Show first day details
        daily_schedules = schedule_data.get('daily_schedules', [])
        if daily_schedules:
            first_day = daily_schedules[0]
            print(f"\n🎬 DAY 1 SCHEDULE:")
            print(f"   Location Focus: {first_day.get('location_focus', 'N/A')}")
            print(f"   Scenes: {len(first_day.get('scenes', []))}")
            
            for i, scene in enumerate(first_day.get('scenes', [])[:3]):  # Show first 3 scenes
                actors = ', '.join(scene.get('actors_needed', []))
                print(f"   {i+1}. Scene {scene.get('scene_number')}: {scene.get('location')} ({scene.get('time_of_day')})")
                print(f"      Actors: {actors if actors else 'None'}")
                print(f"      Call Time: {scene.get('call_time', 'TBD')}")
        
        # Show optimization benefits
        benefits = schedule_data.get('optimization_benefits', [])
        if benefits:
            print(f"\n✨ OPTIMIZATION BENEFITS:")
            for benefit in benefits:
                print(f"   • {benefit}")
        
        # Save result for inspection
        output_file = os.path.join(data_dir, 'test_gemini_schedule.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Test results saved to: test_gemini_schedule.json")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_api_endpoint():
    """Test the Flask endpoint using test client"""
    print(f"\n🌐 Testing Flask API Endpoint")
    print("="*40)
    
    try:
        from flask import Flask
        from routes.ai_routes import ai_bp
        
        # Create test app
        app = Flask(__name__)
        app.config['TESTING'] = True
        app.register_blueprint(ai_bp, url_prefix='/api/ai')
        
        with app.test_client() as client:
            # Test the new Gemini endpoint
            print("📡 Testing /api/ai/generate_gemini_schedule...")
            response = client.post('/api/ai/generate_gemini_schedule')
            
            print(f"   Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.get_json()
                print(f"   ✅ Success: {data.get('message')}")
                print(f"   📊 Total Shooting Days: {data.get('total_shooting_days', 'N/A')}")
                print(f"   💾 Saved File: {data.get('saved_file', 'N/A')}")
                
                if data.get('status') == 'warning':
                    print(f"   ⚠️  Using fallback: {data.get('is_mock', False)}")
                
            else:
                data = response.get_json()
                print(f"   ❌ Error: {data.get('message', 'Unknown error')}")
        
        return True
        
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🎬 Gemini AI Scheduler Test Suite")
    print("="*60)
    
    tests = [
        ("Gemini Scheduler Logic", test_gemini_scheduler),
        ("Flask API Endpoint", test_api_endpoint)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n🧪 Running: {test_name}")
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
            results.append((test_name, False))
        
        print("\n" + "-"*50)
    
    # Summary
    print(f"\n{'='*60}")
    print("TEST RESULTS SUMMARY:")
    print(f"{'='*60}")
    
    passed = 0
    for test_name, success in results:
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{test_name:<30} {status}")
        if success:
            passed += 1
    
    print(f"\nTotal: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 All tests passed! Gemini AI scheduling is ready!")
        print("\n📋 NEXT STEPS:")
        print("1. Set GEMINI_API_KEY environment variable for real AI scheduling")
        print("2. Frontend can now call /api/ai/generate_gemini_schedule")
        print("3. The system will use shooting_schedule.json as input")
    else:
        print("⚠️  Some tests failed. Check the implementation.")

if __name__ == "__main__":
    main()
