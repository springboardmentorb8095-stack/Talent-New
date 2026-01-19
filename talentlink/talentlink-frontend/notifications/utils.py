
from django.core.mail import send_mail
from django.conf import settings
from .models import Notification

def create_notification(user, title, message, link=None):
    notification = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        link=link
    )

    send_email_notification(user.email, title, message)
    return notification


def send_email_notification(to_email, subject, message):
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[to_email],
        fail_silently=False,
    )
# alias for backward compatibility
def send_email_placeholder(user, subject, message):
    return send_email_notification(user.email, subject, message)
