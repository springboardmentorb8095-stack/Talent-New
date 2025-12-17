from django.contrib import admin
from .models import Contract

@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ('proposal', 'status', 'start_date')
    list_filter = ('status', 'start_date')

