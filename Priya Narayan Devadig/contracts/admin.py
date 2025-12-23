from django.contrib import admin
from .models import Contract


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ('project', 'client', 'freelancer', 'agreed_budget', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('project__title', 'client__email', 'freelancer__email')
    readonly_fields = ('created_at',)