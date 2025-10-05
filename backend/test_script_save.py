#!/usr/bin/env python3
"""
Test script save functionality to debug the "failed to save script" error
"""
import requests
import json

def test_script_text_update():
    """Test the script text update endpoint"""
    
    test_content = """# TEST SCRIPT

FADE IN:

EXT. TEST LOCATION - DAY

A simple test scene to verify script saving functionality.

FADE OUT."""
    
    try:
        # Test script text update
        response = requests.put(
            'http://localhost:5000/api/script/text',
            json={'content': test_content},
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Script Text Update - Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Script text update successful!")
        else:
            print("❌ Script text update failed!")
            
    except Exception as e:
        print(f"❌ Error testing script text update: {str(e)}")

def test_script_update():
    """Test the main script update endpoint"""
    
    test_data = {
        "title": "Test Script Update",
        "version": "1.1.0"
    }
    
    try:
        # Test main script update
        response = requests.put(
            'http://localhost:5000/api/script',
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Script Update - Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Script update successful!")
        else:
            print("❌ Script update failed!")
            
    except Exception as e:
        print(f"❌ Error testing script update: {str(e)}")

def test_metrics_endpoint():
    """Test the script metrics endpoint"""
    
    try:
        response = requests.get('http://localhost:5000/api/script/metrics')
        
        print(f"Script Metrics - Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Script metrics retrieval successful!")
        else:
            print("❌ Script metrics retrieval failed!")
            
    except Exception as e:
        print(f"❌ Error testing script metrics: {str(e)}")

if __name__ == '__main__':
    print("Testing script save functionality...")
    print("\n1. Testing script text update:")
    test_script_text_update()
    
    print("\n2. Testing script update:")
    test_script_update()
    
    print("\n3. Testing script metrics:")
    test_metrics_endpoint()
