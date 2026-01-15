from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone

from .models import Contract
from projects.models import Project

@receiver(post_save, sender=Contract)
def update_project_status_on_contract_creation(sender, instance, created, **kwargs):
    """
    Automatically update project status when a contract is created.
    
    When a contract is created, the associated project status changes from 'open' to 'in_progress'.
    """
    if created:
        # Update project status to "in_progress" when contract is created
        project = instance.proposal.project
        if project.status == Project.STATUS_OPEN:
            project.status = Project.STATUS_IN_PROGRESS
            project.save()

@receiver(pre_save, sender=Contract)
def update_project_status_on_contract_completion(sender, instance, **kwargs):
    """
    Automatically update project status when a contract is marked as completed.
    
    When a contract status changes to 'completed', the associated project status 
    changes from 'in_progress' to 'completed'.
    """
    if instance.pk:  # Only for existing instances (updates, not creations)
        try:
            old_instance = Contract.objects.get(pk=instance.pk)
            
            # Check if status changed to completed
            if old_instance.status != Contract.STATUS_COMPLETED and instance.status == Contract.STATUS_COMPLETED:
                # Update project status to completed
                project = instance.proposal.project
                if project.status == Project.STATUS_IN_PROGRESS:
                    project.status = Project.STATUS_COMPLETED
                    project.save()
                    
        except Contract.DoesNotExist:
            # This shouldn't happen for existing instances, but handle gracefully
            pass