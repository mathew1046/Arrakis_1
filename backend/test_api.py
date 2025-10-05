#!/usr/bin/env python3
"""
Prodsight API Test Script
Tests all endpoints with sample data and displays results
"""

import requests
import json
import time
from datetime import datetime, timedelta

# API Configuration
BASE_URL = "http://localhost:5000"
API_BASE = f"{BASE_URL}/api"

# Test data
SAMPLE_USERS = [
    {
        "name": "Test Producer",
        "role": "Producer",
        "email": "test.producer@prodsight.com",
        "username": "testproducer",
        "password": "testpass123",
        "permissions": ["view_all", "edit_budget", "manage_tasks", "view_reports", "manage_crew"]
    },
    {
        "name": "Test Director",
        "role": "Director",
        "email": "test.director@prodsight.com",
        "username": "testdirector",
        "password": "testpass123",
        "permissions": ["manage_script", "approve_scenes", "view_tasks", "ai_breakdown"]
    }
]

SAMPLE_TASKS = [
    {
        "title": "Test Camera Setup",
        "description": "Set up camera equipment for Scene 1",
        "assigneeId": "1",
        "dueDate": "2024-12-15",
        "priority": "high",
        "category": "Equipment",
        "estimatedHours": 4
    },
    {
        "title": "Script Review",
        "description": "Review latest script changes",
        "assigneeId": "2",
        "dueDate": "2024-12-12",
        "priority": "medium",
        "category": "Script",
        "estimatedHours": 2
    }
]

SAMPLE_BUDGET_ENTRY = {
    "amount": 5000,
    "category": "Equipment",
    "description": "Test camera rental"
}

SAMPLE_SCENE = {
    "number": "6",
    "description": "INT. TEST LOCATION - DAY. Test scene for API validation.",
    "location": "Test Studio",
    "timeOfDay": "Day",
    "estimatedDuration": 2,
    "characters": ["Test Character"],
    "props": ["Test Prop"],
    "vfx": False,
    "status": "draft",
    "notes": "Test scene for API testing"
}

SAMPLE_VFX_SHOT = {
    "shotName": "VFX_TEST_001",
    "sceneId": "6",
    "description": "Test VFX shot for API validation",
    "assignee": "1",
    "dueDate": "2024-12-20",
    "priority": "medium",
    "complexity": "low",
    "estimatedHours": 8
}

class APITester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
    
    def log_test(self, endpoint, method, status_code, response_data, error=None):
        """Log test result"""
        result = {
            "endpoint": endpoint,
            "method": method,
            "status_code": status_code,
            "success": 200 <= status_code < 300,
            "response": response_data,
            "error": error,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status_icon = "[OK]" if result["success"] else "[FAIL]"
        print(f"{status_icon} {method} {endpoint} - Status: {status_code}")
        
        if error:
            print(f"   Error: {error}")
        elif response_data:
            # Truncate long responses for display
            response_str = json.dumps(response_data, indent=2)
            if len(response_str) > 200:
                response_str = response_str[:200] + "..."
            print(f"   Response: {response_str}")
        print()
    
    def make_request(self, method, endpoint, data=None, headers=None):
        """Make HTTP request and return response"""
        url = f"{API_BASE}{endpoint}"
        
        if headers is None:
            headers = {}
        
        if self.auth_token:
            headers["Authorization"] = f"Bearer {self.auth_token}"
        
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=headers)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data, headers=headers)
            elif method.upper() == "PUT":
                response = self.session.put(url, json=data, headers=headers)
            elif method.upper() == "DELETE":
                response = self.session.delete(url, headers=headers)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            try:
                response_data = response.json()
            except:
                response_data = response.text
            
            return response.status_code, response_data
            
        except requests.exceptions.ConnectionError:
            return None, "Connection Error: Make sure the Flask server is running"
        except Exception as e:
            return None, str(e)
    
    def test_health_check(self):
        """Test health check endpoint"""
        print("Testing Health Check...")
        status_code, response = self.make_request("GET", "/health")
        self.log_test("/health", "GET", status_code, response)
    
    def test_authentication(self):
        """Test authentication endpoints"""
        print("Testing Authentication...")
        
        # Test login with existing user (from frontend data)
        login_data = {
            "username": "prodmanager",
            "password": "password123"
        }
        status_code, response = self.make_request("POST", "/auth/login", login_data)
        self.log_test("/auth/login", "POST", status_code, response)
        
        # if status_code == 200 and isinstance(response, dict) and response.get("success"):
        #     self.auth_token = response["data"]["access_token"]
        #     print(f"   Auth token obtained: {self.auth_token[:20]}...")
        
        # Test get current user
        if self.auth_token:
            status_code, response = self.make_request("GET", "/auth/me")
            self.log_test("/auth/me", "GET", status_code, response)
    
    def test_user_management(self):
        """Test user management endpoints"""
        print("Testing User Management...")
        
        # Get all users
        status_code, response = self.make_request("GET", "/users")
        self.log_test("/users", "GET", status_code, response)
        
        # Create new user
        user_data = SAMPLE_USERS[0]
        status_code, response = self.make_request("POST", "/users", user_data)
        self.log_test("/users", "POST", status_code, response)
        
        if status_code == 201 and isinstance(response, dict) and response.get("success"):
            user_id = response["data"]["id"]
            
            # Get user by ID
            status_code, response = self.make_request("GET", f"/users/{user_id}")
            self.log_test(f"/users/{user_id}", "GET", status_code, response)
            
            # Update user
            update_data = {"name": "Updated Test Producer"}
            status_code, response = self.make_request("PUT", f"/users/{user_id}", update_data)
            self.log_test(f"/users/{user_id}", "PUT", status_code, response)
    
    def test_task_management(self):
        """Test task management endpoints"""
        print("Testing Task Management...")
        
        # Get all tasks
        status_code, response = self.make_request("GET", "/tasks")
        self.log_test("/tasks", "GET", status_code, response)
        
        # Create new task
        task_data = SAMPLE_TASKS[0]
        status_code, response = self.make_request("POST", "/tasks", task_data)
        self.log_test("/tasks", "POST", status_code, response)
        
        if status_code == 201 and isinstance(response, dict) and response.get("success"):
            task_id = response["data"]["id"]
            
            # Get task by ID
            status_code, response = self.make_request("GET", f"/tasks/{task_id}")
            self.log_test(f"/tasks/{task_id}", "GET", status_code, response)
            
            # Update task
            update_data = {"status": "in_progress"}
            status_code, response = self.make_request("PUT", f"/tasks/{task_id}", update_data)
            self.log_test(f"/tasks/{task_id}", "PUT", status_code, response)
            
            # Get tasks by assignee
            status_code, response = self.make_request("GET", f"/tasks/assignee/{task_data['assigneeId']}")
            self.log_test(f"/tasks/assignee/{task_data['assigneeId']}", "GET", status_code, response)
    
    def test_budget_management(self):
        """Test budget management endpoints"""
        print("Testing Budget Management...")
        
        # Get budget overview
        status_code, response = self.make_request("GET", "/budget")
        self.log_test("/budget", "GET", status_code, response)
        
        # Get budget categories
        status_code, response = self.make_request("GET", "/budget/categories")
        self.log_test("/budget/categories", "GET", status_code, response)
        
        # Add budget entry
        status_code, response = self.make_request("POST", "/budget/history", SAMPLE_BUDGET_ENTRY)
        self.log_test("/budget/history", "POST", status_code, response)
        
        # Get budget history
        status_code, response = self.make_request("GET", "/budget/history")
        self.log_test("/budget/history", "GET", status_code, response)
        
        # Get budget forecast
        status_code, response = self.make_request("GET", "/budget/forecast")
        self.log_test("/budget/forecast", "GET", status_code, response)
    
    def test_script_management(self):
        """Test script management endpoints"""
        print("Testing Script Management...")
        
        # Get script data
        status_code, response = self.make_request("GET", "/script")
        self.log_test("/script", "GET", status_code, response)
        
        # Get all scenes
        status_code, response = self.make_request("GET", "/script/scenes")
        self.log_test("/script/scenes", "GET", status_code, response)
        
        # Add new scene
        status_code, response = self.make_request("POST", "/script/scenes", SAMPLE_SCENE)
        self.log_test("/script/scenes", "POST", status_code, response)
        
        if status_code == 201 and isinstance(response, dict) and response.get("success"):
            # Get the scene ID from the response
            scenes = response["data"].get("scenes", [])
            if scenes:
                scene_id = scenes[-1]["id"]  # Get the last scene (newly added)
                
                # Get scene by ID
                status_code, response = self.make_request("GET", f"/script/scene/{scene_id}")
                self.log_test(f"/script/scene/{scene_id}", "GET", status_code, response)
                
                # Update scene
                update_data = {"status": "approved"}
                status_code, response = self.make_request("PUT", f"/script/scene/{scene_id}", update_data)
                self.log_test(f"/script/scene/{scene_id}", "PUT", status_code, response)
    
    def test_vfx_management(self):
        """Test VFX management endpoints"""
        print("Testing VFX Management...")
        
        # Get all VFX shots
        status_code, response = self.make_request("GET", "/vfx")
        self.log_test("/vfx", "GET", status_code, response)
        
        # Create new VFX shot
        status_code, response = self.make_request("POST", "/vfx", SAMPLE_VFX_SHOT)
        self.log_test("/vfx", "POST", status_code, response)
        
        if status_code == 201 and isinstance(response, dict) and response.get("success"):
            shot_id = response["data"]["id"]
            
            # Get VFX shot by ID
            status_code, response = self.make_request("GET", f"/vfx/{shot_id}")
            self.log_test(f"/vfx/{shot_id}", "GET", status_code, response)
            
            # Update VFX shot
            update_data = {"status": "in_progress"}
            status_code, response = self.make_request("PUT", f"/vfx/{shot_id}", update_data)
            self.log_test(f"/vfx/{shot_id}", "PUT", status_code, response)
            
            # Add VFX version
            version_data = {
                "version": "v001",
                "status": "review",
                "notes": "Initial test version",
                "fileSize": "1.2 GB"
            }
            status_code, response = self.make_request("PUT", f"/vfx/version/{shot_id}", version_data)
            self.log_test(f"/vfx/version/{shot_id}", "PUT", status_code, response)
    
    def test_asset_management(self):
        """Test asset management endpoints"""
        print("Testing Asset Management...")
        
        # Get all assets
        status_code, response = self.make_request("GET", "/assets")
        self.log_test("/assets", "GET", status_code, response)
        
        # Search assets
        status_code, response = self.make_request("GET", "/assets/search?q=script")
        self.log_test("/assets/search", "GET", status_code, response)
    
    def run_all_tests(self):
        """Run all API tests"""
        print("Starting Prodsight API Tests")
        print("=" * 50)
        
        # Test health check first
        self.test_health_check()
        
        # Test authentication
        self.test_authentication()
        
        # Test all other endpoints
        self.test_user_management()
        self.test_task_management()
        self.test_budget_management()
        self.test_script_management()
        self.test_vfx_management()
        self.test_asset_management()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("=" * 50)
        print("Test Summary")
        print("=" * 50)
        
        total_tests = len(self.test_results)
        successful_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - successful_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"[OK] Successful: {successful_tests}")
        print(f"[FAIL] Failed: {failed_tests}")
        print(f"Success Rate: {(successful_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n[FAIL] Failed Tests:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"   - {result['method']} {result['endpoint']} (Status: {result['status_code']})")
        
        print("\nAPI Testing Complete!")

def main():
    """Main function"""
    print("Prodsight API Test Suite")
    print("Make sure the Flask server is running on http://localhost:5000")
    print()
    
    # Wait a moment for user to read
    time.sleep(2)
    
    tester = APITester()
    tester.run_all_tests()

if __name__ == "__main__":
    main()
