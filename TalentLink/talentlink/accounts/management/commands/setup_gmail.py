from django.core.management.base import BaseCommand
import os
import json
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from django.conf import settings

class Command(BaseCommand):
    help = 'Setup Gmail API credentials for production'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("📧 Gmail API Setup Wizard"))
        self.stdout.write("This tool helps you generate the token.json needed for production.")
        self.stdout.write("-" * 50)
        
        creds_file = os.path.join(settings.BASE_DIR, 'credentials.json')
        token_file = os.path.join(settings.BASE_DIR, 'token.json')
        
        if not os.path.exists(creds_file):
            self.stdout.write(self.style.ERROR(f"❌ credentials.json not found at {creds_file}"))
            self.stdout.write("\nTo fix this:")
            self.stdout.write("1. Go to Google Cloud Console (https://console.cloud.google.com/)")
            self.stdout.write("2. Create a new project or select existing one")
            self.stdout.write("3. Enable 'Gmail API'")
            self.stdout.write("4. Go to 'Credentials' > 'Create Credentials' > 'OAuth client ID'")
            self.stdout.write("5. Select 'Desktop app'")
            self.stdout.write("6. Download the JSON file and save it as 'credentials.json' in your project root")
            return
            
        SCOPES = ['https://www.googleapis.com/auth/gmail.send']
        creds = None
        
        # Load existing token if valid
        if os.path.exists(token_file):
            creds = Credentials.from_authorized_user_file(token_file, SCOPES)
            
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                try:
                    self.stdout.write("Refreshing expired token...")
                    creds.refresh(Request())
                except Exception:
                    self.stdout.write("Refresh failed, starting new login flow...")
                    flow = InstalledAppFlow.from_client_secrets_file(creds_file, SCOPES)
                    creds = flow.run_local_server(port=0)
            else:
                self.stdout.write("Starting login flow (browser will open)...")
                flow = InstalledAppFlow.from_client_secrets_file(creds_file, SCOPES)
                creds = flow.run_local_server(port=0)
                
            # Save the credentials for the next run
            with open(token_file, 'w') as token:
                token.write(creds.to_json())
                
        self.stdout.write(self.style.SUCCESS("\n✅ Authentication successful!"))
        self.stdout.write(f"Token saved to: {token_file}")
        
        # Output for Production
        self.stdout.write("\n" + "=" * 50)
        self.stdout.write(" FOR RENDER / PRODUCTION DEPLOYMENT ")
        self.stdout.write("=" * 50)
        self.stdout.write("1. Copy the content below:")
        self.stdout.write("-" * 20)
        self.stdout.write(creds.to_json())
        self.stdout.write("-" * 20)
        self.stdout.write("2. Go to Render Dashboard > Environment Variables")
        self.stdout.write("3. Add a new variable:")
        self.stdout.write("   Key: GMAIL_TOKEN_JSON")
        self.stdout.write("   Value: (Paste the JSON content above)")
        self.stdout.write("=" * 50)
