from django.core.management.base import BaseCommand
from accounts.models import Skill

class Command(BaseCommand):
    help = 'Populate database with initial skills'

    def handle(self, *args, **options):
        skills_data = [
            # Programming
            ('Python', 'Programming'),
            ('JavaScript', 'Programming'),
            ('React', 'Programming'),
            ('Django', 'Programming'),
            ('Node.js', 'Programming'),
            ('PHP', 'Programming'),
            ('Java', 'Programming'),
            ('C++', 'Programming'),
            
            # Design
            ('UI/UX Design', 'Design'),
            ('Graphic Design', 'Design'),
            ('Logo Design', 'Design'),
            ('Web Design', 'Design'),
            ('Adobe Photoshop', 'Design'),
            ('Adobe Illustrator', 'Design'),
            ('Figma', 'Design'),
            
            # Marketing
            ('Digital Marketing', 'Marketing'),
            ('SEO', 'Marketing'),
            ('Content Marketing', 'Marketing'),
            ('Social Media Marketing', 'Marketing'),
            ('Email Marketing', 'Marketing'),
            
            # Writing
            ('Content Writing', 'Writing'),
            ('Copywriting', 'Writing'),
            ('Technical Writing', 'Writing'),
            ('Blog Writing', 'Writing'),
            
            # Data
            ('Data Analysis', 'Data'),
            ('Data Science', 'Data'),
            ('Machine Learning', 'Data'),
            ('SQL', 'Data'),
            ('Excel', 'Data'),
        ]
        
        for name, category in skills_data:
            skill, created = Skill.objects.get_or_create(
                name=name,
                defaults={'category': category}
            )
            if created:
                self.stdout.write(f'Created skill: {name}')
            else:
                self.stdout.write(f'Skill already exists: {name}')
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully populated {len(skills_data)} skills')
        )