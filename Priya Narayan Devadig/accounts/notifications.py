"""
Comprehensive notification system with email support
Supports email notifications for all key events in the freelance marketplace
"""

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.html import strip_tags
from .models import Notification, NotificationPreference
import os

User = get_user_model()


def create_notification(recipient, notification_type, title, message, **kwargs):
    """Create an in-app notification"""
    notification = Notification.objects.create(
        recipient=recipient,
        notification_type=notification_type,
        title=title,
        message=message,
        related_project=kwargs.get('related_project'),
        related_proposal=kwargs.get('related_proposal'),
        related_contract=kwargs.get('related_contract'),
        related_message=kwargs.get('related_message'),
        related_review=kwargs.get('related_review'),
        action_url=kwargs.get('action_url', '')
    )
    return notification


def send_notification_email(to_email, subject, template_name, context):
    """Send notification email using template"""
    # Skip email sending in development if no SMTP server configured
    try:
        # Create templates directory if it doesn't exist
        template_dir = os.path.join(settings.BASE_DIR, 'templates', 'emails')
        os.makedirs(template_dir, exist_ok=True)
        
        # Try to render HTML email, fallback to plain text
        try:
            html_message = render_to_string(f'emails/{template_name}.html', context)
            plain_message = strip_tags(html_message)
        except:
            # Fallback to simple text message
            plain_message = f"""
{subject}

Hello {context.get('user_name', 'User')},

{context.get('message', 'You have a new notification.')}

Best regards,
TalentLink Team
            """.strip()
            html_message = None
        
        # Skip actual email sending in development
        if getattr(settings, 'DEBUG', True):
            print(f"📧 [DEV] Email would be sent to {to_email}: {subject}")
            return True
        
        send_mail(
            subject=f"[TalentLink] {subject}",
            message=plain_message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@talentlink.com'),
            recipient_list=[to_email],
            html_message=html_message,
            fail_silently=False,
        )
        print(f"✅ Email sent to {to_email}: {subject}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")
        return False


def send_notification(user, notification_type, data):
    """
    Send notification to user via email and console
    Types: proposal_received, proposal_accepted, proposal_rejected, contract_created, 
           contract_completed, message_received, review_received, project_posted
    """
    # Console notification for development
    print(f"[NOTIFICATION] {notification_type} for {user.email}")
    print(f"Data: {data}")
    
    # Email notification
    email_templates = {
        'proposal_received': {
            'subject': 'New Proposal Received',
            'template': 'proposal_received'
        },
        'proposal_accepted': {
            'subject': 'Your Proposal Was Accepted!',
            'template': 'proposal_accepted'
        },
        'proposal_rejected': {
            'subject': 'Proposal Update',
            'template': 'proposal_rejected'
        },
        'contract_created': {
            'subject': 'New Contract Created',
            'template': 'contract_created'
        },
        'contract_completed': {
            'subject': 'Contract Completed',
            'template': 'contract_completed'
        },
        'message_received': {
            'subject': 'New Message',
            'template': 'message_received'
        },
        'review_received': {
            'subject': 'New Review Received',
            'template': 'review_received'
        },
        'project_posted': {
            'subject': 'New Project Posted',
            'template': 'project_posted'
        }
    }
    
    if notification_type in email_templates:
        template_info = email_templates[notification_type]
        context = {
            'user_name': user.get_full_name() or user.username,
            'user': user,
            **data
        }
        
        send_notification_email(
            to_email=user.email,
            subject=template_info['subject'],
            template_name=template_info['template'],
            context=context
        )
    
    return True



def notify_proposal_received(client, proposal):
    """Notify client when they receive a proposal"""
    send_notification(
        user=client,
        notification_type='proposal_received',
        data={
            'project_title': proposal.project.title,
            'freelancer_name': proposal.freelancer.get_full_name(),
            'proposed_budget': str(proposal.proposed_budget),
            'estimated_duration': proposal.estimated_duration,
            'cover_letter': proposal.cover_letter[:200] + '...' if len(proposal.cover_letter) > 200 else proposal.cover_letter,
            'message': f"You received a new proposal from {proposal.freelancer.get_full_name()} for your project '{proposal.project.title}'. Budget: ${proposal.proposed_budget}"
        }
    )


def notify_proposal_accepted(freelancer, proposal):
    """Notify freelancer when their proposal is accepted"""
    send_notification(
        user=freelancer,
        notification_type='proposal_accepted',
        data={
            'project_title': proposal.project.title,
            'client_name': proposal.project.client.get_full_name(),
            'agreed_budget': str(proposal.proposed_budget),
            'message': f"Congratulations! Your proposal for '{proposal.project.title}' has been accepted by {proposal.project.client.get_full_name()}."
        }
    )


def notify_proposal_rejected(freelancer, proposal):
    """Notify freelancer when their proposal is rejected"""
    send_notification(
        user=freelancer,
        notification_type='proposal_rejected',
        data={
            'project_title': proposal.project.title,
            'client_name': proposal.project.client.get_full_name(),
            'message': f"Your proposal for '{proposal.project.title}' was not selected this time. Keep applying to other projects!"
        }
    )


def notify_contract_created(client, freelancer, contract):
    """Notify both parties when contract is created"""
    # Notify client
    send_notification(
        user=client,
        notification_type='contract_created',
        data={
            'project_title': contract.project.title,
            'freelancer_name': freelancer.get_full_name(),
            'contract_budget': str(contract.agreed_budget),
            'end_date': contract.end_date.strftime('%B %d, %Y') if contract.end_date else 'TBD',
            'message': f"A contract has been created for your project '{contract.project.title}' with {freelancer.get_full_name()}."
        }
    )
    
    # Notify freelancer
    send_notification(
        user=freelancer,
        notification_type='contract_created',
        data={
            'project_title': contract.project.title,
            'client_name': client.get_full_name(),
            'contract_budget': str(contract.agreed_budget),
            'end_date': contract.end_date.strftime('%B %d, %Y') if contract.end_date else 'TBD',
            'message': f"A contract has been created for the project '{contract.project.title}' with {client.get_full_name()}."
        }
    )


def notify_contract_completed(client, freelancer, contract):
    """Notify both parties when contract is completed"""
    # Notify client
    create_notification(
        recipient=client,
        notification_type='contract_completed',
        title=f'Contract completed for "{contract.project.title}"',
        message=f'The contract for "{contract.project.title}" with {freelancer.get_full_name()} has been completed. Please leave a review!',
        related_contract=contract,
        related_project=contract.project,
        action_url=f'/contracts/{contract.id}'
    )
    
    # Notify freelancer
    create_notification(
        recipient=freelancer,
        notification_type='contract_completed',
        title=f'Contract completed for "{contract.project.title}"',
        message=f'The contract for "{contract.project.title}" with {client.get_full_name()} has been completed. Please leave a review!',
        related_contract=contract,
        related_project=contract.project,
        action_url=f'/contracts/{contract.id}'
    )
    
    # Send email notifications
    send_notification(
        user=client,
        notification_type='contract_completed',
        data={
            'project_title': contract.project.title,
            'freelancer_name': freelancer.get_full_name(),
            'contract_budget': str(contract.agreed_budget),
            'message': f"The contract for '{contract.project.title}' with {freelancer.get_full_name()} has been completed. Please leave a review!"
        }
    )
    
    send_notification(
        user=freelancer,
        notification_type='contract_completed',
        data={
            'project_title': contract.project.title,
            'client_name': client.get_full_name(),
            'contract_budget': str(contract.agreed_budget),
            'message': f"The contract for '{contract.project.title}' with {client.get_full_name()} has been completed. Please leave a review!"
        }
    )


def notify_message_received(recipient, message):
    """Notify user when they receive a message"""
    sender = message.sender
    
    # Create in-app notification
    create_notification(
        recipient=recipient,
        notification_type='message',
        title=f'New message from {sender.get_full_name()}',
        message=f'{sender.get_full_name()} sent you a message: "{message.content[:50]}..."',
        related_message=message,
        action_url=f'/messages/{message.conversation.id}' if hasattr(message, 'conversation') else '/messages'
    )
    
    # Send email notification
    send_notification(
        user=recipient,
        notification_type='message_received',
        data={
            'sender_name': message.sender.get_full_name(),
            'message_preview': message.content[:100] + '...' if len(message.content) > 100 else message.content,
            'conversation_id': message.conversation.id if hasattr(message, 'conversation') else None,
            'message': f"You received a new message from {message.sender.get_full_name()}"
        }
    )


def notify_review_received(reviewee, review):
    """Notify user when they receive a review"""
    stars = '⭐' * review.rating
    
    # Create in-app notification
    create_notification(
        recipient=reviewee,
        notification_type='review_received',
        title=f'New review from {review.reviewer.get_full_name()}',
        message=f'{review.reviewer.get_full_name()} left you a {review.rating}-star review for "{review.contract.project.title}"',
        related_review=review,
        related_contract=review.contract,
        related_project=review.contract.project,
        action_url='/reviews'
    )
    
    # Send email notification
    send_notification(
        user=reviewee,
        notification_type='review_received',
        data={
            'reviewer_name': review.reviewer.get_full_name(),
            'rating': review.rating,
            'rating_stars': stars,
            'project_title': review.contract.project.title,
            'comment_preview': review.comment[:150] + '...' if len(review.comment) > 150 else review.comment,
            'message': f"You received a {review.rating}-star review from {review.reviewer.get_full_name()} for the project '{review.contract.project.title}'"
        }
    )


def notify_project_posted(project):
    """Notify relevant freelancers when a new project is posted"""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        # Get all freelancers
        freelancers = User.objects.filter(user_type='freelancer')
        
        # If project has required skills, filter freelancers by matching skills
        if project.required_skills.exists():
            # Get freelancers who have at least one matching skill
            matching_freelancers = freelancers.filter(
                user_skills__skill__in=project.required_skills.all()
            ).distinct()
            
            # If we have matching freelancers, notify them
            if matching_freelancers.exists():
                freelancers_to_notify = matching_freelancers
            else:
                # If no matching skills, notify all freelancers (first 10 to avoid spam)
                freelancers_to_notify = freelancers[:10]
        else:
            # If no required skills specified, notify all freelancers (first 10)
            freelancers_to_notify = freelancers[:10]
        
        # Send notifications to selected freelancers
        for freelancer in freelancers_to_notify:
            # Create in-app notification
            create_notification(
                recipient=freelancer,
                notification_type='system',
                title=f'New Project: {project.title}',
                message=f'A new project "{project.title}" has been posted by {project.client.get_full_name()}. Budget: ${project.budget_min}-${project.budget_max}',
                related_project=project,
                action_url=f'/projects/{project.id}'
            )
            
            # Send email notification
            send_notification_email(
                to_email=freelancer.email,
                subject=f'New Project Opportunity: {project.title}',
                template_name='project_posted',
                context={
                    'freelancer': freelancer,
                    'project': project,
                    'client': project.client,
                    'user_name': freelancer.get_full_name(),
                    'message': f'A new project "{project.title}" matching your skills has been posted!'
                }
            )
        
        print(f"📢 Notified {freelancers_to_notify.count()} freelancers about new project: {project.title}")
        
    except Exception as e:
        print(f"Error notifying freelancers about new project: {e}")


def notify_review_reminder(recipient, contract):
    """Remind user to leave a review"""
    other_party = contract.freelancer if recipient == contract.client else contract.client
    project = contract.project
    
    # Create in-app notification
    create_notification(
        recipient=recipient,
        notification_type='system',
        title=f'Please review your experience with {other_party.get_full_name()}',
        message=f'Your project "{project.title}" is complete. Please take a moment to review your experience.',
        related_contract=contract,
        related_project=project,
        action_url=f'/reviews/write?contract={contract.id}'
    )
    
    # Send email notification
    send_notification_email(
        to_email=recipient.email,
        subject=f'Please review your experience - {project.title}',
        template_name='review_reminder',
        context={
            'recipient': recipient,
            'other_party': other_party,
            'contract': contract,
            'project': project,
            'user_name': recipient.get_full_name(),
            'message': f'Your project "{project.title}" is complete. Please take a moment to review your experience.'
        }
    )