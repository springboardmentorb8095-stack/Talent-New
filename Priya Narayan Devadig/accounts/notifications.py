"""
Simple notification system
In production, this would integrate with email services (SendGrid, AWS SES)
and push notification services
"""

def send_notification(user, notification_type, data):
    """
    Send notification to user
    Types: proposal_received, proposal_accepted, contract_created, 
           contract_completed, message_received, review_received
    """
    # Placeholder for email notification
    print(f"[NOTIFICATION] {notification_type} for {user.email}")
    print(f"Data: {data}")
    
    # In production, implement:
    # - Email notifications via SendGrid/AWS SES
    # - Push notifications
    # - In-app notifications (store in database)
    
    return True


def notify_proposal_received(client, proposal):
    """Notify client when they receive a proposal"""
    send_notification(
        user=client,
        notification_type='proposal_received',
        data={
            'project': proposal.project.title,
            'freelancer': proposal.freelancer.get_full_name(),
            'budget': str(proposal.proposed_budget)
        }
    )


def notify_proposal_accepted(freelancer, proposal):
    """Notify freelancer when their proposal is accepted"""
    send_notification(
        user=freelancer,
        notification_type='proposal_accepted',
        data={
            'project': proposal.project.title,
            'client': proposal.project.client.get_full_name()
        }
    )


def notify_contract_created(client, freelancer, contract):
    """Notify both parties when contract is created"""
    send_notification(
        user=client,
        notification_type='contract_created',
        data={
            'project': contract.project.title,
            'freelancer': freelancer.get_full_name()
        }
    )
    
    send_notification(
        user=freelancer,
        notification_type='contract_created',
        data={
            'project': contract.project.title,
            'client': client.get_full_name()
        }
    )


def notify_message_received(recipient, message):
    """Notify user when they receive a message"""
    send_notification(
        user=recipient,
        notification_type='message_received',
        data={
            'sender': message.sender.get_full_name(),
            'subject': message.subject
        }
    )


def notify_review_received(reviewee, review):
    """Notify user when they receive a review"""
    send_notification(
        user=reviewee,
        notification_type='review_received',
        data={
            'reviewer': review.reviewer.get_full_name(),
            'rating': review.rating,
            'project': review.contract.project.title
        }
    )