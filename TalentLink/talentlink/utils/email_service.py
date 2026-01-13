from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_email_notification(to_email, subject, html_content, from_email=None):
    """
    Send an email using Django's send_mail (backend agnostic)
    
    Args:
        to_email (str): Recipient email address
        subject (str): Email subject
        html_content (str): HTML content of the email
        from_email (str, optional): Sender email address. Defaults to settings.DEFAULT_FROM_EMAIL
    
    Returns:
        dict: {'id': 'sent_via_smtp'} if successful, None if failed
    """
    if not from_email:
        from_email = settings.DEFAULT_FROM_EMAIL
    
    # Check if using Gmail API or HTTPS-based backends (no SMTP validation needed)
    email_backend = getattr(settings, 'EMAIL_BACKEND', '')
    if 'SmartGmailBackend' in email_backend or 'FastGmailBackend' in email_backend or 'GmailAPIBackend' in email_backend:
        print(f"🚀 HTTPS email backend detected - sending via configured service to {to_email}")
        try:
            plain_message = strip_tags(html_content)
            result = send_mail(
                subject=subject,
                message=plain_message,
                from_email=from_email,
                recipient_list=[to_email],
                html_message=html_content,
                fail_silently=False,
            )
            print(f"✅ HTTPS backend: Email delivery completed for {to_email} (result: {result})")
            return {'id': 'smart_gmail_backend', 'result': result}
        except Exception as e:
            print(f"⚠️ HTTPS backend: Email delivery failed for {to_email} - {type(e).__name__}: {str(e)}")
            return {'id': 'smart_gmail_backend_failed', 'error': str(e)}
    
    # Validate email configuration only for traditional SMTP backends
    if 'smtp' in email_backend.lower():
        if not settings.EMAIL_HOST or not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
            print(f"Email configuration error: Missing SMTP settings for {to_email}")
            return None
    
    try:
        plain_message = strip_tags(html_content)
        
        print(f"Attempting to send email to {to_email} via SMTP...")
        result = send_mail(
            subject=subject,
            message=plain_message,
            from_email=from_email,
            recipient_list=[to_email],
            html_message=html_content,
            fail_silently=False,
        )
        
        if result:
            print(f"✅ Email sent successfully to {to_email} (result: {result})")
            return {'id': 'sent_via_smtp'}
        else:
            print(f"❌ Email send failed for {to_email} (no exception but result: {result})")
            return None
            
    except Exception as e:
        print(f"❌ Error sending email to {to_email}: {type(e).__name__}: {str(e)}")
        # Log more details in production
        if not settings.DEBUG:
            print(f"Email config - HOST: {settings.EMAIL_HOST}, USER: {settings.EMAIL_HOST_USER}")
        return None

def send_proposal_submitted_email(client_email, project_title, freelancer_name):
    """Send email notification when freelancer submits proposal"""
    subject = f"New Proposal for {project_title}"
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c3e50;">New Proposal Received!</h2>
                <p>Hello,</p>
                <p>You have received a new proposal for your project <strong>{project_title}</strong>.</p>
                <p><strong>Freelancer:</strong> {freelancer_name}</p>
                <p>Log in to your account to review the proposal and make a decision.</p>
                <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                    <p style="margin: 0;">Best regards,<br>TalentLink Team</p>
                </div>
            </div>
        </body>
    </html>
    """
    
    return send_email_notification(client_email, subject, html_content)

def send_proposal_accepted_email(freelancer_email, project_title):
    """Send email notification when client accepts proposal"""
    subject = f"Proposal Accepted for {project_title}"
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #27ae60;">Congratulations! Proposal Accepted</h2>
                <p>Hello,</p>
                <p>Great news! Your proposal for the project <strong>{project_title}</strong> has been accepted.</p>
                <p>The client has approved your proposal and you can now proceed with the project.</p>
                <p>Log in to your account to view the project details and get started.</p>
                <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                    <p style="margin: 0;">Best regards,<br>TalentLink Team</p>
                </div>
            </div>
        </body>
    </html>
    """
    
    return send_email_notification(freelancer_email, subject, html_content)

def send_new_message_email(recipient_email, sender_name, message_preview, has_file=False, file_name=None):
    """Send email notification when a new message is received"""
    subject = f"New Message from {sender_name}"
    
    print(f"📧 Preparing to send new message email to {recipient_email} from {sender_name}")
    
    # Validate recipient email
    if not recipient_email or '@' not in recipient_email:
        print(f"❌ Invalid recipient email: {recipient_email}")
        return None
    
    # Truncate message preview if it's too long
    if len(message_preview) > 50:
        message_preview = message_preview[:47] + "..."
    
    # Handle file attachment notification
    file_info = ""
    if has_file:
        file_info = f"<p style='color: #3498db; font-weight: bold;'>📎 File attached: {file_name}</p>"
        
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c3e50;">You have a new message!</h2>
                <p>Hello,</p>
                <p>You have received a new message from <strong>{sender_name}</strong>.</p>
                {file_info}
                <div style="background-color: #f0f0f0; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;">
                    <p style="font-style: italic; margin: 0;">"{message_preview}"</p>
                </div>
                <p>Log in to your account to view the full conversation and reply.</p>
                <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                    <p style="margin: 0;">Best regards,<br>TalentLink Team</p>
                </div>
            </div>
        </body>
    </html>
    """
    
    result = send_email_notification(recipient_email, subject, html_content)
    if result:
        print(f"✅ New message email sent successfully to {recipient_email}")
    else:
        print(f"❌ Failed to send new message email to {recipient_email}")
    
    return result

def send_proposal_rejected_email(freelancer_email, project_title):
    """Send email notification when client rejects proposal"""
    subject = f"Proposal Update for {project_title}"
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #e74c3c;">Proposal Update</h2>
                <p>Hello,</p>
                <p>We wanted to inform you that your proposal for the project <strong>{project_title}</strong> has been declined.</p>
                <p>Don't be discouraged! Keep browsing available projects and submit proposals that match your skills and experience.</p>
                <p>Log in to your account to explore new opportunities.</p>
                <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                    <p style="margin: 0;">Best regards,<br>TalentLink Team</p>
                </div>
            </div>
        </body>
    </html>
    """
    
    return send_email_notification(freelancer_email, subject, html_content)
