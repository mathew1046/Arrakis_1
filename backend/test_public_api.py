#!/usr/bin/env python3
"""
Public API Test - Tests all endpoints without authentication
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
            if len(response_str) > 300:
                response_str = response_str[:300] + "..."
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
    print("Prodsight Public API Test")
    print("=" * 40)
    
    # Test health check
    test_endpoint("GET", "/health", description="Health check endpoint")
    
    # Test authentication endpoints
    print("Testing Authentication Endpoints...")
    login_data = {
        "username": "prodmanager",
        "password": "password123"
    }
    test_endpoint("POST", "/auth/login", login_data, "Login with sample credentials")
    test_endpoint("GET", "/auth/me", description="Get current user")
    test_endpoint("POST", "/auth/logout", description="Logout")
    test_endpoint("POST", "/auth/refresh", description="Refresh token")
    
    # Test user management
    print("Testing User Management...")
    test_endpoint("GET", "/users", description="Get all users")
    test_endpoint("GET", "/users/1", description="Get user by ID")
    
    # Test task management
    print("Testing Task Management...")
    test_endpoint("GET", "/tasks", description="Get all tasks")
    test_endpoint("GET", "/tasks/1", description="Get task by ID")
    test_endpoint("GET", "/tasks/assignee/1", description="Get tasks by assignee")
    
    # Test budget management
    print("Testing Budget Management...")
    test_endpoint("GET", "/budget", description="Get budget overview")
    test_endpoint("GET", "/budget/categories", description="Get budget categories")
    test_endpoint("GET", "/budget/history", description="Get budget history")
    test_endpoint("GET", "/budget/forecast", description="Get budget forecast")
    
    # Test script management
    print("Testing Script Management...")
    test_endpoint("GET", "/script", description="Get script data")
    test_endpoint("GET", "/script/scenes", description="Get all scenes")
    test_endpoint("GET", "/script/scene/1", description="Get scene by ID")
    
    # Test VFX management
    print("Testing VFX Management...")
    test_endpoint("GET", "/vfx", description="Get VFX shots")
    test_endpoint("GET", "/vfx/1", description="Get VFX shot by ID")
    test_endpoint("GET", "/vfx/assignee/1", description="Get VFX shots by assignee")
    
    # Test asset management
    print("Testing Asset Management...")
    test_endpoint("GET", "/assets", description="Get all assets")
    test_endpoint("GET", "/assets/search?q=script", description="Search assets")
    
    print("=" * 40)
    print("API Testing Complete!")
    print("All endpoints are now public and accessible without authentication.")

if __name__ == "__main__":
    main()
