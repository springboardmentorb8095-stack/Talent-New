from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
import socket

class Command(BaseCommand):
    help = 'Test email configuration by sending a test email'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='The email address to send the test message to')

    def handle(self, *args, **options):
        recipient = options['email']
        
        self.stdout.write(self.style.SUCCESS(f'Testing email configuration...'))
        self.stdout.write(f'EMAIL_BACKEND: {settings.EMAIL_BACKEND}')
        
        # Check for Resend API Key if using FastGmailBackend
        if 'FastGmailBackend' in settings.EMAIL_BACKEND:
            import os
            resend_key = os.environ.get('RESEND_API_KEY')
            if resend_key:
                self.stdout.write(self.style.SUCCESS(f'RESEND_API_KEY found: {resend_key[:4]}...'))
            else:
                self.stdout.write(self.style.WARNING('RESEND_API_KEY not found! HTTPS sending will use unreliable fallbacks.'))
                self.stdout.write(self.style.WARNING('For production (Render), get a free key at https://resend.com and set RESEND_API_KEY in .env'))
        
        self.stdout.write(f'EMAIL_HOST: {settings.EMAIL_HOST}')
        self.stdout.write(f'EMAIL_PORT: {settings.EMAIL_PORT}')
        self.stdout.write(f'EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}')
        self.stdout.write(f'EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}')
        self.stdout.write(f'DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}')
        
        # Skip SMTP connectivity check for HTTPS backends
        backend_lower = str(settings.EMAIL_BACKEND).lower()
        if 'smtp' in backend_lower:
            self.stdout.write('Checking network connectivity to SMTP server...')
            try:
                sock = socket.create_connection((settings.EMAIL_HOST, settings.EMAIL_PORT), timeout=10)
                sock.close()
                self.stdout.write(self.style.SUCCESS(f'Successfully connected to {settings.EMAIL_HOST}:{settings.EMAIL_PORT}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Failed to connect to SMTP server: {e}'))
                return
        else:
            self.stdout.write(self.style.WARNING('Using HTTPS email backend; skipping SMTP connectivity check'))

        self.stdout.write(f'Attempting to send test email to {recipient}...')
        
        try:
            send_mail(
                subject='Test Email from TalentLink',
                message='This is a test email to verify your SMTP configuration works correctly.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient],
                fail_silently=False,
            )
            self.stdout.write(self.style.SUCCESS(f'Email sent successfully to {recipient}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to send email: {e}'))
            if "Application-specific password" in str(e):
                self.stdout.write(self.style.WARNING('Hint: If you are using Gmail, you likely need to generate an App Password instead of your regular password.'))
