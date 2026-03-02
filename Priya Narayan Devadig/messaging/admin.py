from django.contrib import admin
from .models import Message, Conversation


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'content_preview', 'conversation', 'is_read', 'sent_at')
    list_filter = ('is_read', 'sent_at')
    search_fields = ('sender__email', 'recipient__email', 'content')
    readonly_fields = ('sent_at',)
    
    def content_preview(self, obj):
        """Show a preview of the message content"""
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content Preview'


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_participants', 'project', 'contract', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('participants__email', 'project__title', 'contract__id')
    readonly_fields = ('created_at', 'updated_at')
    filter_horizontal = ('participants',)
    
    def get_participants(self, obj):
        """Show conversation participants"""
        return ', '.join([user.get_full_name() or user.username for user in obj.participants.all()])
    get_participants.short_description = 'Participants'