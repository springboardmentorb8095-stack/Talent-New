# messages/admin.py
#from django.contrib import admin
#from .models import Message

#admin.site.register(Message)
# messages/admin.py
from django.contrib import admin
from .models import Message

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'receiver', 'short_content', 'timestamp')
    list_filter = ('timestamp',)
    search_fields = ('sender__email', 'receiver__email', 'content')
    readonly_fields = ('timestamp',)

    def short_content(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content
    
    short_content.short_description = "Content"  # Fixed: proper indentation and no extra text
