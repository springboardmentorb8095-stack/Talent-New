#!/usr/bin/env python
"""
Quick test script to demonstrate the proposal workflow
Run this after starting the Django server
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_proposal_workflow():
    print("🚀 Testing Proposal System Workflow")
    print("=" * 50)
    
    # Step 1: Register a client
    print("\n1️⃣ Registering client...")
    client_data = {
        "username": "testclient",
        "email": "client@test.com",
        "password": "testpass123",
        "password2": "testpass123",
        "first_name": "Test",
        "last_name": "Client",
        "user_type": "client"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register/", json=client_data)
        if response.status_code == 201:
            client_token = response.json()['access']
            print("✅ Client registered successfully!")
        else:
            print("ℹ️ Client might already exist, trying login...")
            login_response = requests.post(f"{BASE_URL}/auth/login/", json={
                "username": "client@test.com",
                "password": "testpass123"
            })
            client_token = login_response.json()['access']
    except Exception as e:
        print(f"❌ Error with client: {e}")
        return
    
    # Step 2: Create a project
    print("\n2️⃣ Creating project...")
    project_data = {
        "title": "Build E-commerce Website",
        "description": "Need a modern e-commerce website with Django backend and React frontend",
        "budget_min": 2000.00,
        "budget_max": 4000.00,
        "deadline": "2026-03-01",
        "estimated_duration": 60,
        "required_skills": []
    }
    
    headers = {"Authorization": f"Bearer {client_token}"}
    try:
        response = requests.post(f"{BASE_URL}/projects/", json=project_data, headers=headers)
        if response.status_code == 201:
            project = response.json()
            project_id = project['id']
            print(f"✅ Project created! ID: {project_id}")
            print(f"   Title: {project['title']}")
        else:
            print(f"❌ Failed to create project: {response.text}")
            return
    except Exception as e:
        print(f"❌ Error creating project: {e}")
        return
    
    # Step 3: Register a freelancer
    print("\n3️⃣ Registering freelancer...")
    freelancer_data = {
        "username": "testfreelancer",
        "email": "freelancer@test.com",
        "password": "testpass123",
        "password2": "testpass123",
        "first_name": "Test",
        "last_name": "Freelancer",
        "user_type": "freelancer"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register/", json=freelancer_data)
        if response.status_code == 201:
            freelancer_token = response.json()['access']
            print("✅ Freelancer registered successfully!")
        else:
            print("ℹ️ Freelancer might already exist, trying login...")
            login_response = requests.post(f"{BASE_URL}/auth/login/", json={
                "username": "freelancer@test.com",
                "password": "testpass123"
            })
            freelancer_token = login_response.json()['access']
    except Exception as e:
        print(f"❌ Error with freelancer: {e}")
        return
    
    # Step 4: Submit a proposal
    print("\n4️⃣ Submitting proposal...")
    proposal_data = {
        "project": project_id,
        "cover_letter": "I'm the perfect fit for this project! I have 5 years of experience with Django and React, and I've built similar e-commerce platforms before. I can deliver high-quality code within your timeline.",
        "proposed_budget": 3200.00,
        "estimated_duration": 45
    }
    
    freelancer_headers = {"Authorization": f"Bearer {freelancer_token}"}
    try:
        response = requests.post(f"{BASE_URL}/proposals/", json=proposal_data, headers=freelancer_headers)
        if response.status_code == 201:
            proposal = response.json()
            proposal_id = proposal['id']
            print(f"✅ Proposal submitted! ID: {proposal_id}")
            print(f"   Budget: ${proposal['proposed_budget']}")
            print(f"   Duration: {proposal['estimated_duration']} days")
        else:
            print(f"❌ Failed to submit proposal: {response.text}")
            return
    except Exception as e:
        print(f"❌ Error submitting proposal: {e}")
        return
    
    # Step 5: View proposals (as client)
    print("\n5️⃣ Viewing proposals (as client)...")
    try:
        response = requests.get(f"{BASE_URL}/proposals/?project={project_id}", headers=headers)
        if response.status_code == 200:
            proposals = response.json()
            if isinstance(proposals, dict) and 'results' in proposals:
                proposals = proposals['results']
            print(f"✅ Found {len(proposals)} proposals for the project")
            for prop in proposals:
                print(f"   - Proposal by {prop.get('freelancer_name', 'Unknown')}: ${prop['proposed_budget']} ({prop['status']})")
        else:
            print(f"❌ Failed to get proposals: {response.text}")
    except Exception as e:
        print(f"❌ Error getting proposals: {e}")
    
    # Step 6: Accept the proposal
    print("\n6️⃣ Accepting proposal...")
    try:
        response = requests.post(f"{BASE_URL}/proposals/{proposal_id}/accept/", headers=headers)
        if response.status_code == 200:
            accepted_proposal = response.json()
            print(f"✅ Proposal accepted!")
            print(f"   Status: {accepted_proposal['status']}")
        else:
            print(f"❌ Failed to accept proposal: {response.text}")
    except Exception as e:
        print(f"❌ Error accepting proposal: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Proposal Workflow Test Complete!")
    print("\nNow you can:")
    print("1. Visit http://localhost:3000 to see the frontend")
    print("2. Login with the test accounts:")
    print("   Client: client@test.com / testpass123")
    print("   Freelancer: freelancer@test.com / testpass123")
    print("3. Explore the project and proposal features!")

if __name__ == "__main__":
    test_proposal_workflow()