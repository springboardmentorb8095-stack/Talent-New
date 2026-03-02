#!/usr/bin/env python
"""
Test authentication issues
"""

print("🔍 TESTING AUTHENTICATION ISSUES")
print("=" * 50)

print("\n🧪 STEP 1: Test authentication in browser")
print("1. Login to the app")
print("2. Open browser dev tools (F12)")
print("3. Go to Application/Storage tab")
print("4. Check localStorage for 'access_token'")
print("5. Copy the token value")

print("\n🧪 STEP 2: Test API directly")
print("Open browser console and run:")
print("""
const token = localStorage.getItem('access_token');
console.log('Token:', token);

fetch('/api/auth/users/', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
.then(response => {
    console.log('Status:', response.status);
    return response.json();
})
.then(data => console.log('Data:', data))
.catch(error => console.error('Error:', error));
""")

print("\n🔍 STEP 3: Check what's happening")
print("If you get 401:")
print("• Token might be expired")
print("• Token format might be wrong")
print("• Authentication backend issue")

print("\n🔍 STEP 4: Try logging in again")
print("• Logout and login again")
print("• Check if new token works")

print("\n" + "=" * 50)
print("🎯 Most likely issue: Token authentication problem")
print("🚀 Try the browser console test above!")