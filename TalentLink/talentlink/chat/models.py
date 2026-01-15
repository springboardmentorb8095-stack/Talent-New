from django.db import models
from django.conf import settings
from contracts.models import Contract

class Conversation(models.Model):
    contract = models.OneToOneField(Contract, on_delete=models.CASCADE, related_name='conversation')
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='conversations')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Conversation: {self.contract.title}"

class Message(models.Model):
    MESSAGE_TYPE_TEXT = 'text'
    MESSAGE_TYPE_CONTRACT = 'contract'
    MESSAGE_TYPE_FILE = 'file'
    MESSAGE_TYPE_SYSTEM = 'system'
    
    MESSAGE_TYPES = [
        (MESSAGE_TYPE_TEXT, 'Text'),
        (MESSAGE_TYPE_CONTRACT, 'Contract'),
        (MESSAGE_TYPE_FILE, 'File'),
        (MESSAGE_TYPE_SYSTEM, 'System'),
    ]
    
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default=MESSAGE_TYPE_TEXT)
    
    # Message content
    text = models.TextField(blank=True)
    file_url = models.URLField(blank=True, null=True)
    file_name = models.CharField(max_length=255, blank=True)
    
    contract_action = models.CharField(max_length=50, blank=True, help_text="Action related to contract (e.g., 'signed', 'status_changed')")
    contract_data = models.JSONField(default=dict, blank=True)
    
    # Message status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.sender}: {self.text[:50]}..."
    
    def mark_as_read(self):
        if not self.is_read:
            from django.utils import timezone
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])

class MessageReadReceipt(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='read_receipts')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    read_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['message', 'user']
        
    def __str__(self):
        return f"{self.user} read {self.message}"
