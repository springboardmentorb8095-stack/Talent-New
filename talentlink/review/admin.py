# from django.contrib import admin
# from .models import Review

# @admin.register(Review)
# class ReviewAdmin(admin.ModelAdmin):
#     list_display = ('contract', 'reviewer', 'rating', 'created_at')
#     list_filter = ('rating', 'created_at')
from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'contract', 'reviewer', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
