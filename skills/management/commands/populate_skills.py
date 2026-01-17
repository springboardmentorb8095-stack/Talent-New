from django.core.management.base import BaseCommand
from skills.models import Skill


class Command(BaseCommand):
    help = 'Populate database with default skills'

    def handle(self, *args, **options):
        skills = [
            'Python',
            'JavaScript',
            'React',
            'Django',
            'Node.js',
            'Java',
            'C++',
            'SQL',
            'HTML/CSS',
            'Vue.js',
            'Angular',
            'TypeScript',
            'MongoDB',
            'PostgreSQL',
            'AWS',
            'Docker',
            'Git',
            'REST API',
            'GraphQL',
            'Machine Learning',
            'Data Science',
            'UI/UX Design',
            'Mobile Development',
            'iOS',
            'Android',
        ]

        for skill_name in skills:
            skill, created = Skill.objects.get_or_create(name=skill_name)
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Created skill: {skill_name}')
                )
            else:
                self.stdout.write(f'⊙ Skill already exists: {skill_name}')

        self.stdout.write(self.style.SUCCESS('\n✓ Skills population complete!'))