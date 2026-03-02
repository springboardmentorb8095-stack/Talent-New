from django.db import models
from django.conf import settings


class Conversation(models.Model):
    """A conversation between two users"""
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='conversations')
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, related_name='conversations', blank=True, null=True)
    contract = models.ForeignKey('contracts.Contract', on_delete=models.CASCADE, related_name='conversations', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        participants = list(self.participants.all())
        if len(participants) >= 2:
            return f"Conversation between {participants[0].get_full_name()} and {participants[1].get_full_name()}"
        return f"Conversation {self.id}"

    def get_other_participant(self, user):
        """Get the other participant in the conversation"""
        return self.participants.exclude(id=user.id).first()

    def get_last_message(self):
        """Get the most recent message in this conversation"""
        return self.messages.first()

    def mark_as_read(self, user):
        """Mark all messages as read for a specific user"""
        self.messages.filter(recipient=user, is_read=False).update(is_read=True)

    def get_unread_count(self, user):
        """Get count of unread messages for a specific user"""
        return self.messages.filter(recipient=user, is_read=False).count()


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-sent_at']

    def __str__(self):
        return f"Message from {self.sender.get_full_name()} to {self.recipient.get_full_name()}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update conversation's updated_at timestamp
        self.conversation.save()