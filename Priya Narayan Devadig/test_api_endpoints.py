#!/usr/bin/env python
"""
Test script to verify all API endpoints are working
Run this after starting the Django server: python manage.py runserver
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_endpoint(url, description):
    """Test an API endpoint and print results"""
    print(f"\n🔍 Testing: {description}")
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
                print("Response: Success")
        else:
            print(f"Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to server. Make sure Django server is running!")
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    print("🚀 Testing Freelance Marketplace API Endpoints")
    print("=" * 50)
    
    # Test basic endpoints
    test_endpoint(f"{BASE_URL}/projects/", "List all projects")
    
    # Test filtering
    test_endpoint(f"{BASE_URL}/projects/?min_budget=100", "Filter by minimum budget")
    test_endpoint(f"{BASE_URL}/projects/?max_budget=1000", "Filter by maximum budget")
    test_endpoint(f"{BASE_URL}/projects/?min_budget=100&max_budget=1000", "Filter by budget range")
    
    # Test duration filtering (NEW!)
    test_endpoint(f"{BASE_URL}/projects/?min_duration=10", "Filter by minimum duration")
    test_endpoint(f"{BASE_URL}/projects/?max_duration=60", "Filter by maximum duration")
    test_endpoint(f"{BASE_URL}/projects/?min_duration=10&max_duration=60", "Filter by duration range")
    
    # Test search
    test_endpoint(f"{BASE_URL}/projects/?search=website", "Search for 'website'")
    test_endpoint(f"{BASE_URL}/projects/?search=app", "Search for 'app'")
    
    # Test skills filtering
    test_endpoint(f"{BASE_URL}/projects/?skills=1", "Filter by skill ID 1")
    test_endpoint(f"{BASE_URL}/projects/?skills=1,2", "Filter by multiple skills")
    
    # Test status filtering
    test_endpoint(f"{BASE_URL}/projects/?status=open", "Filter by open status")
    
    # Test combined filters
    test_endpoint(f"{BASE_URL}/projects/?min_budget=500&max_duration=30&status=open", 
                 "Combined filters: budget + duration + status")
    
    print("\n" + "=" * 50)
    print("✅ API Testing Complete!")
    print("\nIf all endpoints show Status: 200, your API is working correctly!")

if __name__ == "__main__":
    main()