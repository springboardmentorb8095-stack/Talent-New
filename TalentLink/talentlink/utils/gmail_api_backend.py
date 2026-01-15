import base64
import json
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from django.conf import settings
from django.core.mail.backends.base import BaseEmailBackend
from django.core.mail.message import sanitize_address

logger = logging.getLogger(__name__)

try:
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build
    GOOGLE_API_AVAILABLE = True
except ImportError:
    GOOGLE_API_AVAILABLE = False
    logger.warning("Google API libraries not available. Gmail API backend will not work.")


class GmailAPIBackend(BaseEmailBackend):
    def __init__(self, fail_silently=False, **kwargs):
        super().__init__(fail_silently=fail_silently)
        self.client_id = kwargs.get('client_id', getattr(settings, 'GOOGLE_CLIENT_ID', ''))
        self.client_secret = kwargs.get('client_secret', getattr(settings, 'GOOGLE_CLIENT_SECRET', ''))
        self.refresh_token = kwargs.get('refresh_token', getattr(settings, 'GOOGLE_REFRESH_TOKEN', ''))
        self.from_email = kwargs.get('from_email', getattr(settings, 'DEFAULT_FROM_EMAIL', ''))

    def send_messages(self, email_messages):
        if not GOOGLE_API_AVAILABLE:
            if not self.fail_silently:
                raise RuntimeError("Google API libraries not installed")
            return 0

        if not all([self.client_id, self.client_secret, self.refresh_token]):
            logger.error("Gmail API credentials not configured")
            if not self.fail_silently:
                raise ValueError("Gmail API credentials not configured")
            return 0

        try:
            service = self._get_gmail_service()
            if not service:
                return 0

            sent_count = 0
            for message in email_messages:
                if self._send_message(service, message):
                    sent_count += 1
            return sent_count
        except Exception as e:
            logger.error(f"Gmail API error: {e}")
            if not self.fail_silently:
                raise
            return 0

    def _get_gmail_service(self):
        try:
            creds = Credentials(
                None,
                refresh_token=self.refresh_token,
                token_uri='https://oauth2.googleapis.com/token',
                client_id=self.client_id,
                client_secret=self.client_secret
            )
            
            if creds.expired:
                creds.refresh(Request())
            
            return build('gmail', 'v1', credentials=creds)
        except Exception as e:
            logger.error(f"Failed to create Gmail service: {e}")
            return None

    def _send_message(self, service, email_message):
        try:
            if email_message.alternatives:
                msg = MIMEMultipart('alternative')
                
                text_content = email_message.body or ''
                if text_content:
                    text_part = MIMEText(text_content, 'plain', 'utf-8')
                    msg.attach(text_part)
                
                for content, mimetype in email_message.alternatives:
                    if mimetype == 'text/html':
                        html_part = MIMEText(content, 'html', 'utf-8')
                        msg.attach(html_part)
                        break
                
                for attachment in email_message.attachments:
                    msg.attach(attachment)
            else:
                content = email_message.body or ''
                msg = MIMEText(content, 'plain', 'utf-8')
            
            msg['Subject'] = email_message.subject
            msg['From'] = self.from_email or email_message.from_email
            msg['To'] = ', '.join([sanitize_address(addr, email_message.encoding) for addr in email_message.to])
            
            if email_message.cc:
                msg['Cc'] = ', '.join([sanitize_address(addr, email_message.encoding) for addr in email_message.cc])
            
            if email_message.bcc:
                msg['Bcc'] = ', '.join([sanitize_address(addr, email_message.encoding) for addr in email_message.bcc])
            
            if email_message.reply_to:
                msg['Reply-To'] = ', '.join([sanitize_address(addr, email_message.encoding) for addr in email_message.reply_to])
            
            raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode('utf-8')
            
            message = service.users().messages().send(
                userId='me',
                body={'raw': raw_message}
            ).execute()
            
            logger.info(f"Email sent successfully via Gmail API. Message ID: {message.get('id', 'unknown')}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email via Gmail API: {e}")
            return False