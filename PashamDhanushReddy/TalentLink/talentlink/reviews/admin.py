from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'contract', 'reviewer', 'rating', 'review_date')
    list_filter = ('rating',)
