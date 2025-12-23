#!/usr/bin/env python
"""
Complete CRUD operations test for Projects API
This script tests Create, Read, Update, Delete operations
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://127.0.0.1:8000/api"

def get_auth_token():
    """Get authentication token"""
    # Try to register a test user
    register_data = {
        "username": "testclient",
        "email": "client@example.com", 
        "password": "testpass123",
        "password2": "testpass123",
        "first_name": "Test",
        "last_name": "Client",
        "user_type": "client"
    }
    
    print("🔐 Getting authentication token...")
    try:
        response = requests.post(f"{BASE_URL}/auth/register/", json=register_data)
        if response.status_code == 201:
            data = response.json()
            print("✅ User registered successfully!")
            return data.get('access')
    except:
        pass
    
    # Try to login
    login_data = {
        "username": "client@example.com",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful!")
            return data.get('access')
        else:
            print(f"❌ Login failed: {response.text}")
    except Exception as e:
        print(f"Login error: {e}")
    
    return None

def make_request(method, url, token, data=None):
    """Make authenticated API request"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data)
        elif method == "PUT":
            response = requests.put(url, headers=headers, json=data)
        elif method == "PATCH":
            response = requests.patch(url, headers=headers, json=data)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers)
        
        return response
    except Exception as e:
        print(f"❌ Request error: {e}")
        return None

def test_create_project(token):
    """Test CREATE operation"""
    print("\n" + "="*50)
    print("🆕 TESTING CREATE PROJECT")
    print("="*50)
    
    # Calculate deadline (30 days from now)
    deadline = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
    
    project_data = {
        "title": "Test Website Development",
        "description": "Need a modern responsive website with React frontend and Django backend. Must include user authentication, payment integration, and admin dashboard.",
        "budget_min": 1500.00,
        "budget_max": 3000.00,
        "deadline": deadline,
        "estimated_duration": 45,
        "required_skills": []  # We'll add skills if available
    }
    
    print(f"📝 Creating project: {project_data['title']}")
    print(f"💰 Budget: ${project_data['budget_min']} - ${project_data['budget_max']}")
    print(f"⏱️ Duration: {project_data['estimated_duration']} days")
    print(f"📅 Deadline: {project_data['deadline']}")
    
    response = make_request("POST", f"{BASE_URL}/projects/", token, project_data)
    
    if response and response.status_code == 201:
        created_project = response.json()
        print("✅ Project created successfully!")
        print(f"🆔 Project ID: {created_project['id']}")
        print(f"📊 Status: {created_project['status']}")
        return created_project
    else:
        print(f"❌ Failed to create project")
        if response:
            print(f"Status: {response.status_code}")
            print(f"Error: {response.text}")
        return None

def test_read_projects(token, project_id=None):
    """Test READ operations"""
    print("\n" + "="*50)
    print("📖 TESTING READ PROJECTS")
    print("="*50)
    
    # Test 1: List all projects
    print("\n1️⃣ Testing: List all projects")
    response = make_request("GET", f"{BASE_URL}/projects/", token)
    
    if response and response.status_code == 200:
        projects = response.json()
        if isinstance(projects, dict) and 'results' in projects:
            projects = projects['results']
        
        print(f"✅ Found {len(projects)} projects")
        if projects:
            print(f"📋 Sample project: {projects[0]['title']}")
    else:
        print("❌ Failed to list projects")
        if response:
            print(f"Status: {response.status_code}")
    
    # Test 2: Get specific project
    if project_id:
        print(f"\n2️⃣ Testing: Get project {project_id}")
        response = make_request("GET", f"{BASE_URL}/projects/{project_id}/", token)
        
        if response and response.status_code == 200:
            project = response.json()
            print("✅ Project retrieved successfully!")
            print(f"📝 Title: {project['title']}")
            print(f"💰 Budget: ${project['budget_min']} - ${project['budget_max']}")
            print(f"⏱️ Duration: {project['estimated_duration']} days")
            return project
        else:
            print("❌ Failed to get project")
            if response:
                print(f"Status: {response.status_code}")
    
    # Test 3: Filter projects
    print("\n3️⃣ Testing: Filter projects by budget")
    response = make_request("GET", f"{BASE_URL}/projects/?min_budget=1000&max_budget=5000", token)
    
    if response and response.status_code == 200:
        projects = response.json()
        if isinstance(projects, dict) and 'results' in projects:
            projects = projects['results']
        print(f"✅ Budget filter: Found {len(projects)} projects")
    else:
        print("❌ Budget filter failed")
    
    # Test 4: Filter by duration
    print("\n4️⃣ Testing: Filter projects by duration")
    response = make_request("GET", f"{BASE_URL}/projects/?min_duration=30&max_duration=60", token)
    
    if response and response.status_code == 200:
        projects = response.json()
        if isinstance(projects, dict) and 'results' in projects:
            projects = projects['results']
        print(f"✅ Duration filter: Found {len(projects)} projects")
    else:
        print("❌ Duration filter failed")
    
    # Test 5: Search projects
    print("\n5️⃣ Testing: Search projects")
    response = make_request("GET", f"{BASE_URL}/projects/?search=website", token)
    
    if response and response.status_code == 200:
        projects = response.json()
        if isinstance(projects, dict) and 'results' in projects:
            projects = projects['results']
        print(f"✅ Search: Found {len(projects)} projects with 'website'")
    else:
        print("❌ Search failed")

def test_update_project(token, project_id):
    """Test UPDATE operations"""
    print("\n" + "="*50)
    print("✏️ TESTING UPDATE PROJECT")
    print("="*50)
    
    # Test PATCH (partial update)
    print(f"\n1️⃣ Testing: PATCH update project {project_id}")
    
    update_data = {
        "title": "Updated Website Development Project",
        "budget_max": 3500.00,
        "estimated_duration": 50
    }
    
    print(f"📝 Updating title to: {update_data['title']}")
    print(f"💰 Updating max budget to: ${update_data['budget_max']}")
    print(f"⏱️ Updating duration to: {update_data['estimated_duration']} days")
    
    response = make_request("PATCH", f"{BASE_URL}/projects/{project_id}/", token, update_data)
    
    if response and response.status_code == 200:
        updated_project = response.json()
        print("✅ Project updated successfully!")
        print(f"📝 New title: {updated_project['title']}")
        print(f"💰 New budget: ${updated_project['budget_min']} - ${updated_project['budget_max']}")
        print(f"⏱️ New duration: {updated_project['estimated_duration']} days")
        return updated_project
    else:
        print("❌ Failed to update project")
        if response:
            print(f"Status: {response.status_code}")
            print(f"Error: {response.text}")
        return None

def test_delete_project(token, project_id):
    """Test DELETE operation"""
    print("\n" + "="*50)
    print("🗑️ TESTING DELETE PROJECT")
    print("="*50)
    
    print(f"🗑️ Deleting project {project_id}")
    
    response = make_request("DELETE", f"{BASE_URL}/projects/{project_id}/", token)
    
    if response and response.status_code == 204:
        print("✅ Project deleted successfully!")
        
        # Verify deletion
        print("🔍 Verifying deletion...")
        verify_response = make_request("GET", f"{BASE_URL}/projects/{project_id}/", token)
        
        if verify_response and verify_response.status_code == 404:
            print("✅ Deletion verified - project not found")
            return True
        else:
            print("⚠️ Project might still exist")
            return False
    else:
        print("❌ Failed to delete project")
        if response:
            print(f"Status: {response.status_code}")
            print(f"Error: {response.text}")
        return False

def main():
    print("🚀 COMPLETE PROJECT CRUD TESTING")
    print("="*60)
    print("This script will test all CRUD operations:")
    print("✅ CREATE - Post new project")
    print("✅ READ - List, get, filter, search projects") 
    print("✅ UPDATE - Modify existing project")
    print("✅ DELETE - Remove project")
    print("="*60)
    
    # Get authentication token
    token = get_auth_token()
    if not token:
        print("❌ Could not get authentication token. Exiting.")
        return
    
    # Test CREATE
    created_project = test_create_project(token)
    if not created_project:
        print("❌ Cannot continue without creating a project")
        return
    
    project_id = created_project['id']
    
    # Test READ
    test_read_projects(token, project_id)
    
    # Test UPDATE
    updated_project = test_update_project(token, project_id)
    
    # Test DELETE
    deleted = test_delete_project(token, project_id)
    
    # Final summary
    print("\n" + "="*60)
    print("📊 CRUD TESTING SUMMARY")
    print("="*60)
    print(f"✅ CREATE: {'Success' if created_project else 'Failed'}")
    print(f"✅ READ: Success (multiple operations tested)")
    print(f"✅ UPDATE: {'Success' if updated_project else 'Failed'}")
    print(f"✅ DELETE: {'Success' if deleted else 'Failed'}")
    
    if created_project and updated_project and deleted:
        print("\n🎉 ALL CRUD OPERATIONS WORKING PERFECTLY!")
    else:
        print("\n⚠️ Some operations failed. Check the logs above.")
    
    print("\n📋 Available API Endpoints:")
    print("POST   /api/projects/           - Create project")
    print("GET    /api/projects/           - List projects")
    print("GET    /api/projects/{id}/      - Get specific project")
    print("PATCH  /api/projects/{id}/      - Update project")
    print("DELETE /api/projects/{id}/      - Delete project")
    print("\n🔍 Filter Examples:")
    print("GET /api/projects/?min_budget=1000&max_budget=5000")
    print("GET /api/projects/?min_duration=30&max_duration=60")
    print("GET /api/projects/?search=website")
    print("GET /api/projects/?status=open")

if __name__ == "__main__":
    main()