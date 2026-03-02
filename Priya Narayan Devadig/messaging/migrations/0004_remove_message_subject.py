# Generated migration to remove subject field from Message model

from django.db import migrations, models


def create_conversations_for_messages(apps, schema_editor):
    """Create conversations for existing messages that don't have one"""
    Message = apps.get_model('messaging', 'Message')
    Conversation = apps.get_model('messaging', 'Conversation')
    
    # Get all messages without conversations
    messages_without_conversations = Message.objects.filter(conversation__isnull=True)
    
    for message in messages_without_conversations:
        # Create a conversation for this message
        conversation = Conversation.objects.create()
        conversation.participants.add(message.sender, message.recipient)
        
        # Link the message to this conversation
        message.conversation = conversation
        message.save()


def reverse_create_conversations(apps, schema_editor):
    """Reverse operation - not needed for this migration"""
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('messaging', '0003_conversation'),
    ]

    operations = [
        # First, create conversations for existing messages
        migrations.RunPython(
            create_conversations_for_messages,
            reverse_create_conversations,
        ),
        
        # Remove the subject field
        migrations.RemoveField(
            model_name='message',
            name='subject',
        ),
        
        # Make conversation field required (not null)
        migrations.AlterField(
            model_name='message',
            name='conversation',
            field=models.ForeignKey(on_delete=models.CASCADE, related_name='messages', to='messaging.conversation'),
        ),
    ]