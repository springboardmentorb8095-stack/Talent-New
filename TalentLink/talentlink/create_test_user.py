from django.contrib.auth import get_user_model
User = get_user_model()
try:
    user = User.objects.get(username='client_user')
    user.set_password('password123')
    user.role = 'client'
    user.save()
    print("User client_user updated")
except User.DoesNotExist:
    user = User.objects.create_user(username='client_user', email='client@example.com', password='password123', role='client')
    print("User client_user created")

# Also ensure admin user exists and is client
try:
    admin = User.objects.get(username='admin')
    admin.role = 'client' # Force client role for testing
    admin.set_password('adminpassword')
    admin.save()
    print("User admin updated")
except User.DoesNotExist:
    pass
