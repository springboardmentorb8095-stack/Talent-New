from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from profiles.models import Profile
from projects.models import Project
from proposals.models import Proposal
from contracts.models import Contract
from datetime import date, timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed the database with sample data for testing'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting to seed data...'))

        # Create clients
        client1, created = User.objects.get_or_create(
            username='client1',
            defaults={
                'email': 'client1@example.com',
                'role': 'client',
                'password': 'pbkdf2_sha256$600000$test$test='  # This should be set properly
            }
        )
        if created:
            client1.set_password('testpass123')
            client1.save()
            Profile.objects.create(
                user=client1,
                full_name='John Client',
                company_name='Tech Solutions Inc.',
                bio='Looking for talented freelancers'
            )
            self.stdout.write(self.style.SUCCESS(f'Created client: {client1.username}'))

        client2, created = User.objects.get_or_create(
            username='client2',
            defaults={
                'email': 'client2@example.com',
                'role': 'client',
            }
        )
        if created:
            client2.set_password('testpass123')
            client2.save()
            Profile.objects.create(
                user=client2,
                full_name='Jane Employer',
                company_name='Design Studio',
                bio='Seeking creative professionals'
            )
            self.stdout.write(self.style.SUCCESS(f'Created client: {client2.username}'))

        # Create freelancers
        freelancer1, created = User.objects.get_or_create(
            username='freelancer1',
            defaults={
                'email': 'freelancer1@example.com',
                'role': 'freelancer',
            }
        )
        if created:
            freelancer1.set_password('testpass123')
            freelancer1.save()
            Profile.objects.create(
                user=freelancer1,
                full_name='Alice Developer',
                skills='Python, Django, React, JavaScript',
                hourly_rate=50,
                availability='full_time',
                bio='Full-stack developer with 5+ years of experience'
            )
            self.stdout.write(self.style.SUCCESS(f'Created freelancer: {freelancer1.username}'))

        freelancer2, created = User.objects.get_or_create(
            username='freelancer2',
            defaults={
                'email': 'freelancer2@example.com',
                'role': 'freelancer',
            }
        )
        if created:
            freelancer2.set_password('testpass123')
            freelancer2.save()
            Profile.objects.create(
                user=freelancer2,
                full_name='Bob Designer',
                skills='UI/UX Design, Figma, Adobe XD',
                hourly_rate=40,
                availability='part_time',
                bio='Creative designer specializing in web interfaces'
            )
            self.stdout.write(self.style.SUCCESS(f'Created freelancer: {freelancer2.username}'))

        # Create projects
        if not Project.objects.exists():
            project1 = Project.objects.create(
                client=client1,
                title='E-commerce Website Development',
                description='Need a full-stack e-commerce website with payment integration',
                budget=5000.00,
                duration=60,
                skills_required='Python, Django, React, PostgreSQL',
                is_active=True
            )
            self.stdout.write(self.style.SUCCESS(f'Created project: {project1.title}'))

            project2 = Project.objects.create(
                client=client1,
                title='Mobile App UI Design',
                description='Design a modern UI for a fitness tracking mobile app',
                budget=2000.00,
                duration=30,
                skills_required='UI/UX Design, Figma',
                is_active=True
            )
            self.stdout.write(self.style.SUCCESS(f'Created project: {project2.title}'))

            project3 = Project.objects.create(
                client=client2,
                title='API Development',
                description='Build RESTful API for customer management system',
                budget=3000.00,
                duration=45,
                skills_required='Python, Django REST Framework, PostgreSQL',
                is_active=True
            )
            self.stdout.write(self.style.SUCCESS(f'Created project: {project3.title}'))

            # Create proposals
            proposal1 = Proposal.objects.create(
                project=project1,
                freelancer=freelancer1,
                cover_letter='I have extensive experience building e-commerce platforms. I can deliver this project within your timeline.',
                proposed_price=4800.00,
                status='pending'
            )
            self.stdout.write(self.style.SUCCESS(f'Created proposal: {proposal1}'))

            proposal2 = Proposal.objects.create(
                project=project2,
                freelancer=freelancer2,
                cover_letter='I specialize in mobile app UI design and would love to work on this project.',
                proposed_price=1900.00,
                status='pending'
            )
            self.stdout.write(self.style.SUCCESS(f'Created proposal: {proposal2}'))

            proposal3 = Proposal.objects.create(
                project=project3,
                freelancer=freelancer1,
                cover_letter='I have built similar APIs before and can ensure clean, maintainable code.',
                proposed_price=2800.00,
                status='accepted'
            )
            self.stdout.write(self.style.SUCCESS(f'Created proposal: {proposal3}'))

            # Create a contract from accepted proposal
            contract = Contract.objects.create(
                proposal=proposal3,
                start_date=date.today(),
                end_date=date.today() + timedelta(days=project3.duration),
                status='active'
            )
            self.stdout.write(self.style.SUCCESS(f'Created contract: {contract}'))

        self.stdout.write(self.style.SUCCESS('\nData seeding completed successfully!'))
        self.stdout.write(self.style.WARNING('\nTest accounts:'))
        self.stdout.write('Client: client1 / testpass123')
        self.stdout.write('Freelancer: freelancer1 / testpass123')
