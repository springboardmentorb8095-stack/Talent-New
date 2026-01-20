from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from projects.models import Project
from proposals.models import Proposal
from contracts.models import Contract
from .models import Notification

channel_layer = get_channel_layer()


# ======================================================
# 1️⃣ PROJECT CREATED
# Client → confirmation
# Freelancers → new project
# ======================================================
@receiver(post_save, sender=Project)
def notify_project_created(sender, instance, created, **kwargs):
    if not created:
        return

    # ✅ Notify client
    Notification.objects.create(
        user=instance.client,
        message=f"Your project '{instance.title}' was posted successfully.",
        project_id=instance.id
    )

    async_to_sync(channel_layer.group_send)(
        f"user_{instance.client.id}",
        {
            "type": "send_notification",
            "message": f"Your project '{instance.title}' was posted successfully.",
        }
    )

    # ✅ Notify freelancers (FIXED RELATION)
    freelancers = User.objects.filter(userprofile__role="freelancer")

    for freelancer in freelancers:
        Notification.objects.create(
            user=freelancer,
            message=f"New project posted: '{instance.title}'",
            project_id=instance.id
        )

        async_to_sync(channel_layer.group_send)(
            f"user_{freelancer.id}",
            {
                "type": "send_notification",
                "message": f"New project posted: '{instance.title}'",
            }
        )


# ======================================================
# 2️⃣ PROPOSAL SUBMITTED
# Client → notified
# ======================================================
@receiver(post_save, sender=Proposal)
def notify_proposal_submitted(sender, instance, created, **kwargs):
    if not created:
        return

    Notification.objects.create(
        user=instance.project.client,
        message=f"New proposal received for '{instance.project.title}'.",
        project_id=instance.project.id,
        proposal_id=instance.id
    )

    async_to_sync(channel_layer.group_send)(
        f"user_{instance.project.client.id}",
        {
            "type": "send_notification",
            "message": f"New proposal received for '{instance.project.title}'.",
        }
    )


# ======================================================
# 3️⃣ PROPOSAL ACCEPTED
# Freelancer → notified
# ======================================================
@receiver(post_save, sender=Contract)
def notify_proposal_accepted(sender, instance, created, **kwargs):
    if not created:
        return

    Notification.objects.create(
        user=instance.freelancer,
        message=f"Your proposal for '{instance.project.title}' was accepted 🎉",
        project_id=instance.project.id,
        proposal_id=instance.project.id
    )

    async_to_sync(channel_layer.group_send)(
        f"user_{instance.freelancer.id}",
        {
            "type": "send_notification",
            "message": f"Your proposal for '{instance.project.title}' was accepted 🎉",
        }
    )


# ======================================================
# 4️⃣ PROPOSAL REJECTED (SAFE)
# ======================================================
@receiver(post_save, sender=Proposal)
def notify_proposal_status_change(sender, instance, created, **kwargs):
    if created:
        return

    if instance.status not in ["accepted", "rejected"]:
        return

    # Prevent duplicate notifications
    if Notification.objects.filter(
        proposal_id=instance.id,
        message__icontains=instance.status
    ).exists():
        return

    if instance.status == "accepted":
        message = f"Your proposal for '{instance.project.title}' was accepted 🎉"
    else:
        message = f"Your proposal for '{instance.project.title}' was rejected ❌"

    Notification.objects.create(
        user=instance.freelancer,
        message=message,
        project_id=instance.project.id,
        proposal_id=instance.id
    )

    async_to_sync(channel_layer.group_send)(
        f"user_{instance.freelancer.id}",
        {
            "type": "send_notification",
            "message": message,
            "project_id": instance.project.id,
            "proposal_id": instance.id,
        }
    )
