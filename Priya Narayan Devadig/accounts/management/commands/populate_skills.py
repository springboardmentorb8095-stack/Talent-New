from django.core.management.base import BaseCommand
from accounts.models import Skill


class Command(BaseCommand):
    help = 'Populate the database with sample skills'

    def handle(self, *args, **options):
        skills_data = [
            # Programming
            ('Python', 'programming'),
            ('JavaScript', 'programming'),
            ('React', 'programming'),
            ('Django', 'programming'),
            ('Node.js', 'programming'),
            ('PHP', 'programming'),
            ('Java', 'programming'),
            ('C++', 'programming'),
            
            # Design
            ('UI/UX Design', 'design'),
            ('Graphic Design', 'design'),
            ('Logo Design', 'design'),
            ('Web Design', 'design'),
            ('Photoshop', 'design'),
            ('Illustrator', 'design'),
            
            # Writing
            ('Content Writing', 'writing'),
            ('Copywriting', 'writing'),
            ('Technical Writing', 'writing'),
            ('Blog Writing', 'writing'),
            
            # Marketing
            ('Digital Marketing', 'marketing'),
            ('SEO', 'marketing'),
            ('Social Media Marketing', 'marketing'),
            ('Email Marketing', 'marketing'),
            
            # Business
            ('Project Management', 'business'),
            ('Data Analysis', 'business'),
            ('Business Strategy', 'business'),
        ]

        for skill_name, category in skills_data:
            skill, created = Skill.objects.get_or_create(
                name=skill_name,
                defaults={'category': category}
            )
            if created:
                self.stdout.write(f'Created skill: {skill_name}')
            else:
                self.stdout.write(f'Skill already exists: {skill_name}')

        self.stdout.write(
            self.style.SUCCESS(f'Successfully populated {len(skills_data)} skills')
        )