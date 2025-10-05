#!/usr/bin/env python3
"""
Test script for AI scheduling endpoints
"""

import requests
import json
import sys
import os

# Base URL for the API
BASE_URL = "http://localhost:5000/api/ai"

def test_endpoint(endpoint, method="GET", data=None):
    """Test a specific endpoint"""
    url = f"{BASE_URL}/{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        
        print(f"\n{'='*50}")
        print(f"Testing: {method} {url}")
        print(f"Status Code: {response.status_code}")
        print(f"Response:")
        print(json.dumps(response.json(), indent=2))
        
        return response.status_code == 200
        
    except requests.exceptions.ConnectionError:
        print(f"❌ Connection failed. Make sure Flask server is running on localhost:5000")
        return False
    except Exception as e:
        print(f"❌ Error testing {endpoint}: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("🚀 Testing AI Scheduling Endpoints")
    print("Make sure your Flask server is running (python run.py)")
    
    tests = [
        ("preview_schedule", "GET"),
        ("sort_schedule", "POST"),
        ("schedule_analysis", "GET")
    ]
    
    results = []
    
    for endpoint, method in tests:
        success = test_endpoint(endpoint, method)
        results.append((endpoint, success))
    
    # Summary
    print(f"\n{'='*50}")
    print("TEST RESULTS SUMMARY:")
    print(f"{'='*50}")
    
    passed = 0
    for endpoint, success in results:
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{endpoint:<20} {status}")
        if success:
            passed += 1
    
    print(f"\nTotal: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 All tests passed!")
    else:
        print("⚠️  Some tests failed. Check the server logs.")

if __name__ == "__main__":
    main()
