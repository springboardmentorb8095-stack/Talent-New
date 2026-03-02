"""
Script to add sample skills to the database
Run with: python manage.py shell < add_skills.py
"""

from accounts.models import Skill

skills_data = [
    {'name': 'Python', 'category': 'programming'},
    {'name': 'JavaScript', 'category': 'programming'},
    {'name': 'React', 'category': 'programming'},
    {'name': 'Node.js', 'category': 'programming'},
    {'name': 'Django', 'category': 'programming'},
    {'name': 'Java', 'category': 'programming'},
    {'name': 'Data Analysis', 'category': 'programming'},
    {'name': 'Machine Learning', 'category': 'programming'},
    {'name': 'UI/UX Design', 'category': 'design'},
    {'name': 'Graphic Design', 'category': 'design'},
    {'name': 'Logo Design', 'category': 'design'},
    {'name': 'Web Design', 'category': 'design'},
    {'name': 'Content Writing', 'category': 'writing'},
    {'name': 'Copywriting', 'category': 'writing'},
    {'name': 'Technical Writing', 'category': 'writing'},
    {'name': 'SEO', 'category': 'marketing'},
    {'name': 'Social Media Marketing', 'category': 'marketing'},
    {'name': 'Digital Marketing', 'category': 'marketing'},
]

for skill_data in skills_data:
    skill, created = Skill.objects.get_or_create(
        name=skill_data['name'],
        defaults={'category': skill_data['category']}
    )
    if created:
        print(f"Created skill: {skill.name}")
    else:
        print(f"Skill already exists: {skill.name}")

print(f"\nTotal skills in database: {Skill.objects.count()}")
