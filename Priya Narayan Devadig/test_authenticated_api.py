#!/usr/bin/env python
"""
Test script with authentication for API endpoints
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def get_auth_token():
    """Get authentication token by creating a test user and logging in"""
    
    # First, try to register a test user
    register_data = {
        "username": "testuser",
        "email": "test@example.com", 
        "password": "testpass123",
        "password2": "testpass123",
        "first_name": "Test",
        "last_name": "User",
        "user_type": "client"
    }
    
    print("🔐 Registering test user...")
    try:
        response = requests.post(f"{BASE_URL}/auth/register/", json=register_data)
        if response.status_code == 201:
            data = response.json()
            print("✅ User registered successfully!")
            return data.get('access')
        elif response.status_code == 400:
            print("ℹ️ User might already exist, trying to login...")
    except Exception as e:
        print(f"Registration error: {e}")
    
    # Try to login with existing user
    login_data = {
        "username": "test@example.com",  # Using email as username
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful!")
            return data.get('access')
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Login error: {e}")
    
    return None

def test_authenticated_endpoint(url, token, description):
    """Test an API endpoint with authentication"""
    print(f"\n🔍 Testing: {description}")
    print(f"URL: {url}")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"Results: {len(data)} items")
                if len(data) > 0:
                    print(f"Sample item keys: {list(data[0].keys())}")
            elif isinstance(data, dict) and 'results' in data:
                print(f"Results: {len(data['results'])} items")
                if len(data['results']) > 0:
                    print(f"Sample item keys: {list(data['results'][0].keys())}")
            else:
                print("Response: Success")
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def test_public_endpoint(url, description):
    """Test public endpoint without authentication"""
    print(f"\n🌐 Testing Public: {description}")
    print(f"URL: {url}")
    
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"Results: {len(data)} items")
            elif isinstance(data, dict) and 'results' in data:
                print(f"Results: {len(data['results'])} items")
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    print("🚀 Testing Freelance Marketplace API with Authentication")
    print("=" * 60)
    
    # Test public endpoints first (no auth required)
    print("\n📖 TESTING PUBLIC ENDPOINTS (No Authentication Required)")
    test_public_endpoint(f"{BASE_URL}/projects/public/", "Public project list")
    test_public_endpoint(f"{BASE_URL}/projects/public/?search=website", "Public search")
    
    # Get authentication token
    print("\n🔐 GETTING AUTHENTICATION TOKEN")
    token = get_auth_token()
    
    if not token:
        print("❌ Could not get authentication token. Stopping authenticated tests.")
        return
    
    print(f"✅ Got token: {token[:20]}...")
    
    # Test authenticated endpoints
    print("\n🔒 TESTING AUTHENTICATED ENDPOINTS")
    test_authenticated_endpoint(f"{BASE_URL}/projects/", token, "List all projects (authenticated)")
    test_authenticated_endpoint(f"{BASE_URL}/projects/?min_budget=100", token, "Filter by minimum budget")
    test_authenticated_endpoint(f"{BASE_URL}/projects/?max_budget=1000", token, "Filter by maximum budget")
    test_authenticated_endpoint(f"{BASE_URL}/projects/?min_duration=10", token, "Filter by minimum duration")
    test_authenticated_endpoint(f"{BASE_URL}/projects/?max_duration=60", token, "Filter by maximum duration")
    test_authenticated_endpoint(f"{BASE_URL}/projects/?search=website", token, "Search for 'website'")
    test_authenticated_endpoint(f"{BASE_URL}/projects/?status=open", token, "Filter by open status")
    
    # Test combined filters
    test_authenticated_endpoint(
        f"{BASE_URL}/projects/?min_budget=100&max_duration=60&status=open", 
        token, 
        "Combined filters: budget + duration + status"
    )
    
    print("\n" + "=" * 60)
    print("✅ API Testing Complete!")

if __name__ == "__main__":
    main()