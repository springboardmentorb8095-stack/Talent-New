#!/usr/bin/env python
"""
Debug script to test the issues
"""

print("🔍 DEBUGGING CURRENT ISSUES")
print("=" * 50)

print("\n🔧 STEP 1: Apply the new contracts migration")
print("python manage.py migrate contracts")

print("\n🧪 STEP 2: Test API endpoints directly")
print("\nTest these URLs in browser (while logged in):")
print("1. http://127.0.0.1:8000/api/auth/users/")
print("   → Should return list of users")
print()
print("2. http://127.0.0.1:8000/api/proposals/")
print("   → Should show proposals")
print()
print("3. Try accepting a proposal and check browser console")

print("\n🔍 STEP 3: Check browser console (F12)")
print("Look for:")
print("• JavaScript errors")
print("• Failed API requests")
print("• Network tab for 404/500 errors")

print("\n🔍 STEP 4: Check Django logs")
print("Look for:")
print("• Database field errors")
print("• Import errors")
print("• Authentication issues")

print("\n" + "=" * 50)
print("🎯 Most likely fixes:")
print("1. Apply contracts migration")
print("2. Check browser console for errors")
print("3. Test API endpoints directly")

print("\n🚀 Run: python manage.py migrate contracts")