#!/usr/bin/env python3
"""
Seed data script for Freelance Marketplace
Creates sample users, projects, proposals, contracts, and reviews
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freelance_marketplace.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import Skill, UserSkill, Profile
from projects.models import Project
from proposals.models import Proposal
from contracts.models import Contract
from reviews.models import Review
from datetime import datetime, timedelta
from django.utils import timezone

User = get_user_model()

def create_seed_data():
    """Create comprehensive seed data"""
    
    print("🌱 Starting seed data creation...")
    print("=" * 50)
    
    # 1. Create Skills
    print("\n1. Creating skills...")
    skills_data = [
        ('Python', 'programming'),
        ('JavaScript', 'programming'),
        ('React', 'programming'),
        ('Django', 'programming'),
        ('Node.js', 'programming'),
        ('UI/UX Design', 'design'),
        ('Graphic Design', 'design'),
        ('Content Writing', 'writing'),
        ('SEO', 'marketing'),
        ('Social Media Marketing', 'marketing'),
    ]
    
    skills = {}
    for name, category in skills_data:
        skill, created = Skill.objects.get_or_create(
            name=name,
            defaults={'category': category, 'description': f'{name} skill'}
        )
        skills[name] = skill
        if created:
            print(f"  ✓ Created skill: {name}")
    
    # 2. Create Users
    print("\n2. Creating users...")
    
    # Clients
    clients_data = [
        {
            'email': 'john.client@example.com',
            'username': 'johnclient',
            'first_name': 'John',
            'last_name': 'Smith',
            'password': 'demo123',
            'user_type': 'client'
        },
        {
            'email': 'sarah.client@example.com',
            'username': 'sarahclient',
            'first_name': 'Sarah',
            'last_name': 'Johnson',
            'password': 'demo123',
            'user_type': 'client'
        },
    ]
    
    clients = []
    for data in clients_data:
        if not User.objects.filter(email=data['email']).exists():
            user = User.objects.create_user(**data)
            Profile.objects.get_or_create(user=user)
            clients.append(user)
            print(f"  ✓ Created client: {data['email']}")
        else:
            clients.append(User.objects.get(email=data['email']))
            print(f"  ℹ Client exists: {data['email']}")
    
    # Freelancers
    freelancers_data = [
        {
            'email': 'alice.dev@example.com',
            'username': 'alicedev',
            'first_name': 'Alice',
            'last_name': 'Developer',
            'password': 'demo123',
            'user_type': 'freelancer',
            'skills': ['Python', 'Django', 'React']
        },
        {
            'email': 'bob.designer@example.com',
            'username': 'bobdesigner',
            'first_name': 'Bob',
            'last_name': 'Designer',
            'password': 'demo123',
            'user_type': 'freelancer',
            'skills': ['UI/UX Design', 'Graphic Design']
        },
        {
            'email': 'carol.writer@example.com',
            'username': 'carolwriter',
            'first_name': 'Carol',
            'last_name': 'Writer',
            'password': 'demo123',
            'user_type': 'freelancer',
            'skills': ['Content Writing', 'SEO']
        },
    ]
    
    freelancers = []
    for data in freelancers_data:
        user_skills = data.pop('skills')
        if not User.objects.filter(email=data['email']).exists():
            user = User.objects.create_user(**data)
            Profile.objects.get_or_create(user=user)
            
            # Add skills
            for skill_name in user_skills:
                UserSkill.objects.get_or_create(
                    user=user,
                    skill=skills[skill_name],
                    defaults={'proficiency_level': 'expert'}
                )
            
            freelancers.append(user)
            print(f"  ✓ Created freelancer: {data['email']}")
        else:
            freelancers.append(User.objects.get(email=data['email']))
            print(f"  ℹ Freelancer exists: {data['email']}")
    
    # 3. Create Projects
    print("\n3. Creating projects...")
    projects_data = [
        {
            'title': 'E-commerce Website Development',
            'description': 'Need a full-stack developer to build an e-commerce platform with Django and React.',
            'client': clients[0],
            'budget_min': 3000,
            'budget_max': 5000,
            'duration_weeks': 8,
            'estimated_duration': 56,
            'status': 'open',
            'skills': ['Python', 'Django', 'React']
        },
        {
            'title': 'Mobile App UI/UX Design',
            'description': 'Looking for a talented designer to create modern UI/UX for our mobile app.',
            'client': clients[1],
            'budget_min': 1500,
            'budget_max': 2500,
            'duration_weeks': 4,
            'estimated_duration': 28,
            'status': 'open',
            'skills': ['UI/UX Design']
        },
        {
            'title': 'Blog Content Writing',
            'description': 'Need 10 SEO-optimized blog posts for our tech blog.',
            'client': clients[0],
            'budget_min': 500,
            'budget_max': 800,
            'duration_weeks': 2,
            'estimated_duration': 14,
            'status': 'completed',
            'skills': ['Content Writing', 'SEO']
        },
    ]
    
    projects = []
    for data in projects_data:
        skill_names = data.pop('skills')
        project, created = Project.objects.get_or_create(
            title=data['title'],
            defaults=data
        )
        
        # Add required skills
        for skill_name in skill_names:
            project.required_skills.add(skills[skill_name])
        
        projects.append(project)
        if created:
            print(f"  ✓ Created project: {data['title']}")
    
    # 4. Create Proposals
    print("\n4. Creating proposals...")
    proposals_data = [
        {
            'project': projects[0],
            'freelancer': freelancers[0],
            'proposed_budget': 4000,
            'estimated_duration': 50,
            'cover_letter': 'I have 5 years of experience in Django and React development...',
            'status': 'accepted'
        },
        {
            'project': projects[1],
            'freelancer': freelancers[1],
            'proposed_budget': 2000,
            'estimated_duration': 25,
            'cover_letter': 'I specialize in mobile app UI/UX design with a modern approach...',
            'status': 'pending'
        },
        {
            'project': projects[2],
            'freelancer': freelancers[2],
            'proposed_budget': 600,
            'estimated_duration': 12,
            'cover_letter': 'I can deliver high-quality SEO-optimized content...',
            'status': 'accepted'
        },
    ]
    
    proposals = []
    for data in proposals_data:
        proposal, created = Proposal.objects.get_or_create(
            project=data['project'],
            freelancer=data['freelancer'],
            defaults=data
        )
        proposals.append(proposal)
        if created:
            print(f"  ✓ Created proposal for: {data['project'].title}")
    
    # 5. Create Contracts
    print("\n5. Creating contracts...")
    contracts_data = [
        {
            'project': projects[0],
            'client': clients[0],
            'freelancer': freelancers[0],
            'proposal': proposals[0],
            'agreed_budget': 4000,
            'status': 'active',
            'terms_and_conditions': 'Standard terms and conditions apply.'
        },
        {
            'project': projects[2],
            'client': clients[0],
            'freelancer': freelancers[2],
            'proposal': proposals[2],
            'agreed_budget': 600,
            'status': 'completed',
            'terms_and_conditions': 'Standard terms and conditions apply.'
        },
    ]
    
    contracts = []
    for data in contracts_data:
        contract, created = Contract.objects.get_or_create(
            project=data['project'],
            client=data['client'],
            freelancer=data['freelancer'],
            defaults=data
        )
        contracts.append(contract)
        if created:
            print(f"  ✓ Created contract for: {data['project'].title}")
    
    # 6. Create Reviews
    print("\n6. Creating reviews...")
    if len(contracts) > 1 and contracts[1].status == 'completed':
        reviews_data = [
            {
                'contract': contracts[1],
                'reviewer': clients[0],
                'reviewee': freelancers[2],
                'rating': 5,
                'comment': 'Excellent work! Very professional and delivered on time.'
            },
            {
                'contract': contracts[1],
                'reviewer': freelancers[2],
                'reviewee': clients[0],
                'rating': 5,
                'comment': 'Great client to work with. Clear communication and prompt payment.'
            },
        ]
        
        for data in reviews_data:
            review, created = Review.objects.get_or_create(
                contract=data['contract'],
                reviewer=data['reviewer'],
                defaults=data
            )
            if created:
                print(f"  ✓ Created review by: {data['reviewer'].get_full_name()}")
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Seed Data Summary:")
    print(f"  - Skills: {Skill.objects.count()}")
    print(f"  - Users: {User.objects.count()}")
    print(f"  - Projects: {Project.objects.count()}")
    print(f"  - Proposals: {Proposal.objects.count()}")
    print(f"  - Contracts: {Contract.objects.count()}")
    print(f"  - Reviews: {Review.objects.count()}")
    
    print("\n✅ Seed data creation complete!")
    print("\n📝 Demo Accounts:")
    print("  Clients:")
    print("    - john.client@example.com / demo123")
    print("    - sarah.client@example.com / demo123")
    print("  Freelancers:")
    print("    - alice.dev@example.com / demo123")
    print("    - bob.designer@example.com / demo123")
    print("    - carol.writer@example.com / demo123")

if __name__ == "__main__":
    create_seed_data()
