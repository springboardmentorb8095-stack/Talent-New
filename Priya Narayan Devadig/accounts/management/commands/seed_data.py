from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from accounts.models import User, Profile, Skill
from projects.models import Project
from proposals.models import Proposal


class Command(BaseCommand):
    help = 'Populate database with sample data for demo'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Create skills (if not exists)
        skills_data = [
            ('Python', 'programming'),
            ('JavaScript', 'programming'),
            ('React', 'programming'),
            ('Django', 'programming'),
            ('UI/UX Design', 'design'),
            ('Content Writing', 'writing'),
        ]

        skills = []
        for skill_name, category in skills_data:
            skill, created = Skill.objects.get_or_create(
                name=skill_name,
                defaults={'category': category}
            )
            skills.append(skill)
            if created:
                self.stdout.write(f'Created skill: {skill_name}')

        # Create sample users
        # Client 1
        client1, created = User.objects.get_or_create(
            email='john.client@example.com',
            defaults={
                'username': 'johnclient',
                'first_name': 'John',
                'last_name': 'Smith',
                'user_type': 'client'
            }
        )
        if created:
            client1.set_password('password123')
            client1.save()
            self.stdout.write('Created client: John Smith')

        # Client 2
        client2, created = User.objects.get_or_create(
            email='sarah.client@example.com',
            defaults={
                'username': 'sarahclient',
                'first_name': 'Sarah',
                'last_name': 'Johnson',
                'user_type': 'client'
            }
        )
        if created:
            client2.set_password('password123')
            client2.save()
            self.stdout.write('Created client: Sarah Johnson')

        # Freelancer 1
        freelancer1, created = User.objects.get_or_create(
            email='mike.dev@example.com',
            defaults={
                'username': 'mikedev',
                'first_name': 'Mike',
                'last_name': 'Developer',
                'user_type': 'freelancer'
            }
        )
        if created:
            freelancer1.set_password('password123')
            freelancer1.save()
            freelancer1.profile.bio = 'Full-stack developer with 5 years experience'
            freelancer1.profile.hourly_rate = 75.00
            freelancer1.profile.location = 'New York, USA'
            freelancer1.profile.save()
            self.stdout.write('Created freelancer: Mike Developer')

        # Freelancer 2
        freelancer2, created = User.objects.get_or_create(
            email='lisa.designer@example.com',
            defaults={
                'username': 'lisadesigner',
                'first_name': 'Lisa',
                'last_name': 'Designer',
                'user_type': 'freelancer'
            }
        )
        if created:
            freelancer2.set_password('password123')
            freelancer2.save()
            freelancer2.profile.bio = 'Creative UI/UX designer specializing in modern web design'
            freelancer2.profile.hourly_rate = 60.00
            freelancer2.profile.location = 'San Francisco, USA'
            freelancer2.profile.save()
            self.stdout.write('Created freelancer: Lisa Designer')

        # Create sample projects
        project1, created = Project.objects.get_or_create(
            title='Build E-commerce Website',
            client=client1,
            defaults={
                'description': 'Need a modern e-commerce website with shopping cart, payment integration, and admin panel.',
                'budget_min': 2000,
                'budget_max': 3500,
                'deadline': timezone.now() + timedelta(days=30),
                'status': 'open'
            }
        )
        if created:
            project1.required_skills.add(skills[0], skills[1], skills[2])  # Python, JS, React
            self.stdout.write('Created project: Build E-commerce Website')

        project2, created = Project.objects.get_or_create(
            title='Mobile App UI Design',
            client=client2,
            defaults={
                'description': 'Looking for a talented designer to create modern UI/UX for our mobile app.',
                'budget_min': 1000,
                'budget_max': 1500,
                'deadline': timezone.now() + timedelta(days=20),
                'status': 'open'
            }
        )
        if created:
            project2.required_skills.add(skills[4])  # UI/UX Design
            self.stdout.write('Created project: Mobile App UI Design')

        project3, created = Project.objects.get_or_create(
            title='Content Writing for Blog',
            client=client1,
            defaults={
                'description': 'Need 10 blog posts about technology trends. Each post should be 1000-1500 words.',
                'budget_min': 500,
                'budget_max': 800,
                'deadline': timezone.now() + timedelta(days=15),
                'status': 'open'
            }
        )
        if created:
            project3.required_skills.add(skills[5])  # Content Writing
            self.stdout.write('Created project: Content Writing for Blog')

        # Create sample proposals
        proposal1, created = Proposal.objects.get_or_create(
            project=project1,
            freelancer=freelancer1,
            defaults={
                'cover_letter': 'I have extensive experience building e-commerce websites with React and Django. I can deliver a high-quality solution within your timeline.',
                'proposed_budget': 2800,
                'estimated_duration': 25,
                'status': 'pending'
            }
        )
        if created:
            self.stdout.write('Created proposal for E-commerce Website')

        proposal2, created = Proposal.objects.get_or_create(
            project=project2,
            freelancer=freelancer2,
            defaults={
                'cover_letter': 'I specialize in mobile UI/UX design and have worked on 20+ successful apps. I would love to help bring your vision to life.',
                'proposed_budget': 1200,
                'estimated_duration': 15,
                'status': 'pending'
            }
        )
        if created:
            self.stdout.write('Created proposal for Mobile App UI Design')

        self.stdout.write(self.style.SUCCESS('\n✅ Sample data created successfully!'))
        self.stdout.write('\nSample Credentials:')
        self.stdout.write('Clients:')
        self.stdout.write('  - john.client@example.com / password123')
        self.stdout.write('  - sarah.client@example.com / password123')
        self.stdout.write('Freelancers:')
        self.stdout.write('  - mike.dev@example.com / password123')
        self.stdout.write('  - lisa.designer@example.com / password123')