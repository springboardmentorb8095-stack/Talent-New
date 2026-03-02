from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from projects.models import Project
from accounts.models import Skill
from datetime import datetime, timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Test CRUD operations for Project model'

    def handle(self, *args, **options):
        self.stdout.write("🚀 TESTING PROJECT CRUD OPERATIONS")
        self.stdout.write("="*50)
        
        # Create test user if doesn't exist
        test_user = self.get_or_create_test_user()
        
        # Test CREATE
        project = self.test_create_project(test_user)
        if not project:
            return
        
        # Test READ
        self.test_read_operations(project)
        
        # Test UPDATE
        self.test_update_project(project)
        
        # Test DELETE
        self.test_delete_project(project)
        
        self.stdout.write("\n" + "="*50)
        self.stdout.write(self.style.SUCCESS("🎉 ALL CRUD OPERATIONS COMPLETED!"))

    def get_or_create_test_user(self):
        """Get or create a test user"""
        try:
            user = User.objects.get(email='testclient@example.com')
            self.stdout.write("✅ Using existing test user")
        except User.DoesNotExist:
            user = User.objects.create_user(
                username='testclient',
                email='testclient@example.com',
                password='testpass123',
                first_name='Test',
                last_name='Client',
                user_type='client'
            )
            self.stdout.write("✅ Created new test user")
        
        return user

    def test_create_project(self, user):
        """Test CREATE operation"""
        self.stdout.write("\n" + "="*30)
        self.stdout.write("🆕 TESTING CREATE PROJECT")
        self.stdout.write("="*30)
        
        deadline = datetime.now() + timedelta(days=30)
        
        project_data = {
            'client': user,
            'title': 'Test Django Website Development',
            'description': 'Need a modern responsive website with Django backend and React frontend. Must include user authentication, payment integration, and admin dashboard.',
            'budget_min': 1500.00,
            'budget_max': 3000.00,
            'deadline': deadline,
            'estimated_duration': 45,
            'status': 'open'
        }
        
        try:
            project = Project.objects.create(**project_data)
            
            self.stdout.write(f"✅ Project created successfully!")
            self.stdout.write(f"🆔 Project ID: {project.id}")
            self.stdout.write(f"📝 Title: {project.title}")
            self.stdout.write(f"💰 Budget: ${project.budget_min} - ${project.budget_max}")
            self.stdout.write(f"⏱️ Duration: {project.estimated_duration} days")
            self.stdout.write(f"📅 Deadline: {project.deadline.strftime('%Y-%m-%d')}")
            self.stdout.write(f"📊 Status: {project.status}")
            
            return project
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Failed to create project: {e}"))
            return None

    def test_read_operations(self, project):
        """Test READ operations"""
        self.stdout.write("\n" + "="*30)
        self.stdout.write("📖 TESTING READ OPERATIONS")
        self.stdout.write("="*30)
        
        # Test 1: Get all projects
        all_projects = Project.objects.all()
        self.stdout.write(f"1️⃣ Total projects in database: {all_projects.count()}")
        
        # Test 2: Get specific project
        try:
            retrieved_project = Project.objects.get(id=project.id)
            self.stdout.write(f"2️⃣ ✅ Retrieved project: {retrieved_project.title}")
        except Project.DoesNotExist:
            self.stdout.write(self.style.ERROR("2️⃣ ❌ Failed to retrieve project"))
        
        # Test 3: Filter by budget
        budget_filtered = Project.objects.filter(
            budget_min__gte=1000,
            budget_max__lte=5000
        )
        self.stdout.write(f"3️⃣ Projects with budget 1000-5000: {budget_filtered.count()}")
        
        # Test 4: Filter by duration
        duration_filtered = Project.objects.filter(
            estimated_duration__gte=30,
            estimated_duration__lte=60
        )
        self.stdout.write(f"4️⃣ Projects with duration 30-60 days: {duration_filtered.count()}")
        
        # Test 5: Search by title/description
        search_results = Project.objects.filter(
            title__icontains='website'
        )
        self.stdout.write(f"5️⃣ Projects containing 'website': {search_results.count()}")
        
        # Test 6: Filter by status
        open_projects = Project.objects.filter(status='open')
        self.stdout.write(f"6️⃣ Open projects: {open_projects.count()}")

    def test_update_project(self, project):
        """Test UPDATE operations"""
        self.stdout.write("\n" + "="*30)
        self.stdout.write("✏️ TESTING UPDATE PROJECT")
        self.stdout.write("="*30)
        
        # Store original values
        original_title = project.title
        original_budget_max = project.budget_max
        original_duration = project.estimated_duration
        
        # Update project
        project.title = "Updated Django Website Development Project"
        project.budget_max = 3500.00
        project.estimated_duration = 50
        project.save()
        
        # Refresh from database
        project.refresh_from_db()
        
        self.stdout.write(f"✅ Project updated successfully!")
        self.stdout.write(f"📝 Title: {original_title} → {project.title}")
        self.stdout.write(f"💰 Max Budget: ${original_budget_max} → ${project.budget_max}")
        self.stdout.write(f"⏱️ Duration: {original_duration} → {project.estimated_duration} days")

    def test_delete_project(self, project):
        """Test DELETE operation"""
        self.stdout.write("\n" + "="*30)
        self.stdout.write("🗑️ TESTING DELETE PROJECT")
        self.stdout.write("="*30)
        
        project_id = project.id
        project_title = project.title
        
        # Delete project
        project.delete()
        
        # Verify deletion
        try:
            Project.objects.get(id=project_id)
            self.stdout.write(self.style.ERROR("❌ Project still exists after deletion"))
        except Project.DoesNotExist:
            self.stdout.write(f"✅ Project '{project_title}' (ID: {project_id}) deleted successfully!")
            self.stdout.write("🔍 Deletion verified - project not found in database")

    def test_filtering_apis(self):
        """Test the filtering functionality that would be used by the API"""
        self.stdout.write("\n" + "="*30)
        self.stdout.write("🔍 TESTING API FILTERING")
        self.stdout.write("="*30)
        
        # Create some test projects with different values
        user = User.objects.first()
        if not user:
            self.stdout.write(self.style.ERROR("No user found for testing"))
            return
        
        test_projects = [
            {
                'title': 'Small Website Project',
                'budget_min': 500, 'budget_max': 1000,
                'estimated_duration': 15
            },
            {
                'title': 'Medium App Development',
                'budget_min': 2000, 'budget_max': 4000,
                'estimated_duration': 60
            },
            {
                'title': 'Large Enterprise System',
                'budget_min': 10000, 'budget_max': 20000,
                'estimated_duration': 120
            }
        ]
        
        created_projects = []
        for data in test_projects:
            project = Project.objects.create(
                client=user,
                title=data['title'],
                description=f"Description for {data['title']}",
                budget_min=data['budget_min'],
                budget_max=data['budget_max'],
                estimated_duration=data['estimated_duration'],
                deadline=datetime.now() + timedelta(days=30)
            )
            created_projects.append(project)
        
        self.stdout.write(f"✅ Created {len(created_projects)} test projects")
        
        # Test various filters
        filters = [
            ("Budget 500-2000", {'budget_min__lte': 2000}),
            ("Duration 30-90 days", {'estimated_duration__gte': 30, 'estimated_duration__lte': 90}),
            ("Title contains 'App'", {'title__icontains': 'App'}),
            ("Open status", {'status': 'open'}),
        ]
        
        for description, filter_kwargs in filters:
            count = Project.objects.filter(**filter_kwargs).count()
            self.stdout.write(f"🔍 {description}: {count} projects")
        
        # Clean up test projects
        for project in created_projects:
            project.delete()
        
        self.stdout.write("🧹 Cleaned up test projects")