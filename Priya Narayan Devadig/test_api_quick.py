#!/usr/bin/env python3
"""
Quick API test to verify endpoints are working
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_login():
    """Test login endpoint"""
    print("Testing login...")
    response = requests.post(f"{BASE_URL}/api/auth/login/", {
        "email": "client@gmail.com",
        "password": "testpass123"
    })
    
    if response.status_code == 200:
        data = response.json()
        print("✓ Login successful")
        return data.get('access')
    else:
        print(f"✗ Login failed: {response.status_code}")
        print(response.text)
        return None

def test_reviews_api(token):
    """Test reviews API"""
    print("\nTesting reviews API...")
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{BASE_URL}/api/reviews/", headers=headers)
    
    if response.status_code == 200:
        print("✓ Reviews API working")
        data = response.json()
        print(f"Found {len(data.get('results', data))} reviews")
    else:
        print(f"✗ Reviews API failed: {response.status_code}")
        print(response.text)

def test_users_api(token):
    """Test users API"""
    print("\nTesting users API...")
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{BASE_URL}/api/auth/users/", headers=headers)
    
    if response.status_code == 200:
        print("✓ Users API working")
        data = response.json()
        users = data.get('results', data)
        print(f"Found {len(users)} users")
        for user in users[:3]:  # Show first 3 users
            print(f"  - {user.get('first_name', '')} {user.get('last_name', '')} ({user.get('email', '')})")
    else:
        print(f"✗ Users API failed: {response.status_code}")
        print(response.text)

def test_conversations_api(token):
    """Test conversations API"""
    print("\nTesting conversations API...")
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{BASE_URL}/api/messages/conversations/", headers=headers)
    
    if response.status_code == 200:
        print("✓ Conversations API working")
        data = response.json()
        print(f"Found {len(data)} conversations")
    else:
        print(f"✗ Conversations API failed: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    print("Quick API Test")
    print("=" * 50)
    
    # Test login first
    token = test_login()
    
    if token:
        # Test other endpoints
        test_reviews_api(token)
        test_users_api(token)
        test_conversations_api(token)
    else:
        print("\nCannot test other endpoints without valid token")
    
    print("\n" + "=" * 50)
    print("Test complete")