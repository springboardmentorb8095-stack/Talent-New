from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from proposals.models import Proposal
from contracts.models import Contract
from projects.models import Project
from .models import Notification

User = get_user_model()


@receiver(post_save, sender=Proposal)
def create_proposal_notification(sender, instance, created, **kwargs):
    if created:
        # Notify client about new proposal
        Notification.objects.create(
            user=instance.project.client,
            notification_type='proposal_received',
            title=f'New Proposal for {instance.project.title}',
            message=f'{instance.freelancer.username} submitted a proposal for ${instance.proposed_price}',
            project=instance.project,
            proposal=instance
        )


@receiver(post_save, sender=Proposal)
def proposal_status_notification(sender, instance, created, **kwargs):
    if created:
        return  # Skip status check for new proposals
    
    # Check if status changed to accepted or rejected
    try:
        old_instance = Proposal.objects.get(pk=instance.pk)
    except Proposal.DoesNotExist:
        return

    if old_instance.status != instance.status:
        if instance.status == 'accepted':
            Notification.objects.create(
                user=instance.freelancer,
                notification_type='proposal_accepted',
                title=f'Proposal Accepted: {instance.project.title}',
                message=f'Your proposal for ${instance.proposed_price} has been accepted!',
                project=instance.project,
                proposal=instance
            )
        elif instance.status == 'rejected':
            Notification.objects.create(
                user=instance.freelancer,
                notification_type='proposal_rejected',
                title=f'Proposal Not Selected: {instance.project.title}',
                message=f'Your proposal was not selected for this project.',
                project=instance.project,
                proposal=instance
            )


@receiver(post_save, sender=Contract)
def contract_created_notification(sender, instance, created, **kwargs):
    if created:
        # Notify both client and freelancer
        freelancer = instance.proposal.freelancer
        client = instance.proposal.project.client

        Notification.objects.create(
            user=freelancer,
            notification_type='contract_created',
            title=f'New Contract: {instance.proposal.project.title}',
            message=f'Contract created. Start date: {instance.start_date}',
            contract=instance,
            project=instance.proposal.project
        )

        Notification.objects.create(
            user=client,
            notification_type='contract_created',
            title=f'Contract Started: {instance.proposal.project.title}',
            message=f'Contract with {freelancer.username} has started.',
            contract=instance,
            project=instance.proposal.project
        )


@receiver(post_save, sender=Contract)
def contract_status_notification(sender, instance, created, **kwargs):
    if created:
        return  # Skip status check for new contracts
    
    try:
        old_instance = Contract.objects.get(pk=instance.pk)
    except Contract.DoesNotExist:
        return

    # Notify when work is submitted
    if old_instance.status != instance.status and instance.status == 'submitted':
        Notification.objects.create(
            user=instance.proposal.project.client,
            notification_type='contract_submitted',
            title=f'Work Submitted: {instance.proposal.project.title}',
            message=f'{instance.proposal.freelancer.username} has submitted work for review.',
            contract=instance,
            project=instance.proposal.project
        )

    # Notify when contract is completed
    if old_instance.status != instance.status and instance.status == 'completed':
        Notification.objects.create(
            user=instance.proposal.freelancer,
            notification_type='contract_completed',
            title=f'Contract Completed: {instance.proposal.project.title}',
            message='Your contract has been completed and approved!',
            contract=instance,
            project=instance.proposal.project
        )
