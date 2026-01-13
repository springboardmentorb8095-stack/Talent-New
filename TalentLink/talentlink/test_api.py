import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_post_project():
    # 1. Login
    login_data = {
        "username": "client_user",
        "password": "password123"
    }
    
    # Try to login
    try:
        response = requests.post(f"{BASE_URL}/token/", data=login_data)
        if response.status_code != 200:
            print(f"Login failed: {response.status_code} {response.text}")
            return
        
        token = response.json()["access"]
        print("Login successful")
        
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        # 2. Check profile role
        response = requests.get(f"{BASE_URL}/auth/profile/", headers=headers)
        if response.status_code == 200:
            user_data = response.json()['user']
            print(f"User role: {user_data.get('role')}")
            if user_data.get('role') != 'client':
                print("User is not a client, cannot post project. Updating role...")
                # Update role to client
                update_data = {"role": "client"}
                # Assuming there is no direct endpoint to update role in profile update, checking UserUpdateSerializer
                # UserUpdateSerializer only allows first_name, last_name, email.
                # We might need to update via shell or create a new user.
                pass
        
        # 3. Create a Skill
        skill_data = {"skill_name": "TestSkill_123"}
        response = requests.post(f"{BASE_URL}/auth/skills/", json=skill_data, headers=headers)
        if response.status_code in [200, 201]:
            print("Skill created/retrieved")
            skill_id = response.json()['id']
        else:
            print(f"Skill creation failed: {response.status_code} {response.text}")
            # Try to get existing
            response = requests.get(f"{BASE_URL}/auth/skills/", headers=headers)
            if response.status_code == 200 and len(response.json()) > 0:
                 skill_id = response.json()[0]['id']
            else:
                 print("No skills available")
                 return

        # 4. Post Project
        project_data = {
            "title": "Test Project 1",
            "description": "This is a test project",
            "budget": "100.00",
            "duration": "1 week",
            "skills_required_ids": [skill_id]
        }
        
        response = requests.post(f"{BASE_URL}/projects/", json=project_data, headers=headers)
        if response.status_code == 201:
            print("Project posted successfully!")
            print(response.json())
        else:
            print(f"Project post failed: {response.status_code} {response.text}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_post_project()
