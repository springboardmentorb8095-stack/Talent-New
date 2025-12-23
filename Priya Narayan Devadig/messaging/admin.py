from django.contrib import admin
from .models import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'subject', 'is_read', 'sent_at')
    list_filter = ('is_read', 'sent_at')
    search_fields = ('sender__email', 'recipient__email', 'subject')
    readonly_fields = ('sent_at',)