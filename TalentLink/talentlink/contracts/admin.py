from django.contrib import admin
from .models import Contract

@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ('id', 'proposal', 'agreed_amount', 'status', 'start_date', 'end_date')
    list_filter = ('status',)
