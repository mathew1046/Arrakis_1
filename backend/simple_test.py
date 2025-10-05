#!/usr/bin/env python3
"""
Simple API Test - Tests basic functionality without authentication
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
            print(f"   Response: {json.dumps(response_data, indent=2)}")
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
    print("Simple Prodsight API Test")
    print("=" * 40)
    
    # Test health check
    test_endpoint("GET", "/health", description="Health check endpoint")
    
    # Test authentication with sample data
    print("Testing Authentication...")
    login_data = {
        "username": "prodmanager",
        "password": "password123"
    }
    status, response = test_endpoint("POST", "/auth/login", login_data, "Login with sample credentials")
    
    if status == 200 and isinstance(response, dict) and response.get("success"):
        token = response["data"]["access_token"]
        print(f"   Auth token obtained: {token[:20]}...")
        
        # Test authenticated endpoints
        headers = {"Authorization": f"Bearer {token}"}
        
        print("\nTesting Authenticated Endpoints...")
        
        # Test users endpoint
        url = f"{API_BASE}/users"
        response = requests.get(url, headers=headers)
        print(f"[{response.status_code}] GET /users")
        print(f"   Response: {json.dumps(response.json(), indent=2) if response.headers.get('content-type', '').startswith('application/json') else response.text}")
        print()
        
        # Test tasks endpoint
        url = f"{API_BASE}/tasks"
        response = requests.get(url, headers=headers)
        print(f"[{response.status_code}] GET /tasks")
        print(f"   Response: {json.dumps(response.json(), indent=2) if response.headers.get('content-type', '').startswith('application/json') else response.text}")
        print()
        
        # Test budget endpoint
        url = f"{API_BASE}/budget"
        response = requests.get(url, headers=headers)
        print(f"[{response.status_code}] GET /budget")
        print(f"   Response: {json.dumps(response.json(), indent=2) if response.headers.get('content-type', '').startswith('application/json') else response.text}")
        print()
        
        # Test script endpoint
        url = f"{API_BASE}/script"
        response = requests.get(url, headers=headers)
        print(f"[{response.status_code}] GET /script")
        print(f"   Response: {json.dumps(response.json(), indent=2) if response.headers.get('content-type', '').startswith('application/json') else response.text}")
        print()
        
        # Test VFX endpoint
        url = f"{API_BASE}/vfx"
        response = requests.get(url, headers=headers)
        print(f"[{response.status_code}] GET /vfx")
        print(f"   Response: {json.dumps(response.json(), indent=2) if response.headers.get('content-type', '').startswith('application/json') else response.text}")
        print()
        
        # Test assets endpoint
        url = f"{API_BASE}/assets"
        response = requests.get(url, headers=headers)
        print(f"[{response.status_code}] GET /assets")
        print(f"   Response: {json.dumps(response.json(), indent=2) if response.headers.get('content-type', '').startswith('application/json') else response.text}")
        print()
        
    else:
        print("Authentication failed - this is expected if data files haven't been copied yet")
        print("Let me copy the data files from frontend...")
        
        # Copy data files
        import os
        import shutil
        
        frontend_data_dir = os.path.join("..", "prodsight", "src", "data")
        backend_data_dir = "data"
        
        if os.path.exists(frontend_data_dir):
            for filename in ["users.json", "tasks.json", "budget.json", "script.json", "vfx.json"]:
                src_path = os.path.join(frontend_data_dir, filename)
                dst_path = os.path.join(backend_data_dir, filename)
                
                if os.path.exists(src_path):
                    shutil.copy2(src_path, dst_path)
                    print(f"   Copied {filename}")
                else:
                    print(f"   {filename} not found in frontend")
        else:
            print(f"   Frontend data directory not found at {frontend_data_dir}")
        
        print("\nData files copied. Please restart the Flask server and run this test again.")

if __name__ == "__main__":
    main()
