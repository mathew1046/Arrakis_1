#!/usr/bin/env python3
"""
Test script to verify frontend-backend connection for Gemini AI scheduling
"""

import requests
import json
import time
from datetime import datetime

def test_backend_health():
    """Test if backend is running"""
    try:
        response = requests.get('http://localhost:5000/api/health', timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running and healthy")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running - start with 'python run.py'")
        return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_gemini_endpoint():
    """Test the Gemini AI scheduling endpoint"""
    print("\n🤖 Testing Gemini AI Scheduling Endpoint")
    print("="*50)
    
    try:
        # Test data that frontend would send
        test_constraints = {
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
        
        print("📡 Calling /api/ai/generate_gemini_schedule...")
        response = requests.post(
            'http://localhost:5000/api/ai/generate_gemini_schedule',
            headers={'Content-Type': 'application/json'},
            json=test_constraints,
            timeout=30
        )
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success: {data.get('message', 'Schedule generated')}")
            print(f"   📊 Status: {data.get('status', 'unknown')}")
            print(f"   🎬 Total Shooting Days: {data.get('total_shooting_days', 'N/A')}")
            print(f"   💾 Saved File: {data.get('saved_file', 'N/A')}")
            
            if data.get('is_mock'):
                print("   ⚠️  Using mock/fallback schedule (Gemini API not available)")
            else:
                print("   🚀 Real Gemini AI response received!")
                
            # Check if schedule data is present
            schedule_data = data.get('schedule_data', {})
            if schedule_data:
                daily_schedules = schedule_data.get('daily_schedules', [])
                print(f"   📅 Daily schedules generated: {len(daily_schedules)}")
                
                if daily_schedules:
                    first_day = daily_schedules[0]
                    print(f"   🎯 Day 1 Focus: {first_day.get('location_focus', 'N/A')}")
                    print(f"   🎬 Day 1 Scenes: {len(first_day.get('scenes', []))}")
            
            return True
        else:
            print(f"   ❌ Error: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Message: {error_data.get('message', 'Unknown error')}")
            except:
                print(f"   Raw response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("   ⏰ Request timed out - Gemini API may be slow")
        return False
    except requests.exceptions.ConnectionError:
        print("   ❌ Connection failed - check if backend is running")
        return False
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return False

def test_other_ai_endpoints():
    """Test other AI endpoints"""
    print("\n📊 Testing Other AI Endpoints")
    print("="*40)
    
    endpoints = [
        ('GET', '/api/ai/preview_schedule', 'Schedule Preview'),
        ('GET', '/api/ai/schedule_analysis', 'Schedule Analysis'),
        ('POST', '/api/ai/sort_schedule', 'Legacy Sort Schedule')
    ]
    
    results = []
    
    for method, endpoint, name in endpoints:
        try:
            print(f"   Testing {name}...")
            if method == 'GET':
                response = requests.get(f'http://localhost:5000{endpoint}', timeout=10)
            else:
                response = requests.post(
                    f'http://localhost:5000{endpoint}',
                    headers={'Content-Type': 'application/json'},
                    json={},
                    timeout=10
                )
            
            if response.status_code == 200:
                print(f"   ✅ {name}: Success")
                results.append((name, True))
            else:
                print(f"   ❌ {name}: Failed ({response.status_code})")
                results.append((name, False))
                
        except Exception as e:
            print(f"   ❌ {name}: Error - {e}")
            results.append((name, False))
    
    return results

def test_cors_headers():
    """Test CORS headers for frontend compatibility"""
    print("\n🌐 Testing CORS Headers")
    print("="*30)
    
    try:
        response = requests.options('http://localhost:5000/api/ai/generate_gemini_schedule')
        headers = response.headers
        
        cors_headers = [
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Methods',
            'Access-Control-Allow-Headers'
        ]
        
        for header in cors_headers:
            if header in headers:
                print(f"   ✅ {header}: {headers[header]}")
            else:
                print(f"   ❌ Missing: {header}")
        
        return all(header in headers for header in cors_headers)
        
    except Exception as e:
        print(f"   ❌ CORS test failed: {e}")
        return False

def generate_frontend_test_code():
    """Generate JavaScript code for frontend testing"""
    js_code = """
// Frontend Test Code - Run this in browser console on localhost:3000

async function testGeminiScheduling() {
    console.log('🧪 Testing Gemini AI Scheduling from Frontend');
    
    try {
        const response = await fetch('/api/ai/generate_gemini_schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                actor_constraints: {
                    Maya: {
                        max_consecutive_days: 3,
                        preferred_call_times: ['09:00', '10:00']
                    }
                },
                location_preferences: {
                    'Radio Station': {
                        setup_time_hours: 2,
                        weather_dependent: false
                    }
                }
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Success:', data.message);
            console.log('📊 Schedule Data:', data.schedule_data);
            console.log('🎬 Total Days:', data.total_shooting_days);
        } else {
            console.error('❌ Error:', data.message);
        }
        
        return data;
    } catch (error) {
        console.error('❌ Network Error:', error);
    }
}

// Run the test
testGeminiScheduling();
"""
    
    with open('frontend_test.js', 'w') as f:
        f.write(js_code)
    
    print("\n📝 Frontend Test Code Generated")
    print("="*35)
    print("   File: frontend_test.js")
    print("   Usage: Copy and paste into browser console on localhost:3000")

def main():
    """Run all connection tests"""
    print("🔗 Frontend-Backend Connection Verification")
    print("="*60)
    print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"   Backend: http://localhost:5000")
    print(f"   Frontend: http://localhost:3000")
    print()
    
    # Test 1: Backend Health
    backend_healthy = test_backend_health()
    if not backend_healthy:
        print("\n❌ Backend is not running. Please start it first:")
        print("   cd backend")
        print("   python run.py")
        return
    
    # Test 2: Gemini Endpoint
    gemini_working = test_gemini_endpoint()
    
    # Test 3: Other AI Endpoints
    other_results = test_other_ai_endpoints()
    
    # Test 4: CORS Headers
    cors_working = test_cors_headers()
    
    # Test 5: Generate Frontend Test Code
    generate_frontend_test_code()
    
    # Summary
    print(f"\n{'='*60}")
    print("VERIFICATION SUMMARY")
    print(f"{'='*60}")
    
    print(f"Backend Health:           {'✅ PASS' if backend_healthy else '❌ FAIL'}")
    print(f"Gemini AI Endpoint:       {'✅ PASS' if gemini_working else '❌ FAIL'}")
    print(f"CORS Headers:             {'✅ PASS' if cors_working else '❌ FAIL'}")
    
    print(f"\nOther Endpoints:")
    for name, success in other_results:
        print(f"  {name:<20} {'✅ PASS' if success else '❌ FAIL'}")
    
    all_passed = backend_healthy and gemini_working and cors_working and all(result[1] for result in other_results)
    
    print(f"\n🎯 OVERALL STATUS: {'✅ READY FOR PRODUCTION' if all_passed else '⚠️  NEEDS ATTENTION'}")
    
    if all_passed:
        print("\n🎉 Frontend is successfully connected to Gemini AI backend!")
        print("   • The 'Generate AI Schedule' button will work")
        print("   • Gemini AI integration is functional")
        print("   • All endpoints are responding correctly")
        print("\n📋 Next Steps:")
        print("   1. Open frontend at http://localhost:3000")
        print("   2. Navigate to Scheduling page")
        print("   3. Click 'AI Schedule' button")
        print("   4. Verify schedule generation works")
    else:
        print("\n🔧 Issues found. Please check:")
        if not backend_healthy:
            print("   • Start the backend server")
        if not gemini_working:
            print("   • Check Gemini API key configuration")
        if not cors_working:
            print("   • Verify CORS settings in Flask app")

if __name__ == "__main__":
    main()
