from django.contrib import admin
from .models import (
    Profile,
    Project,
    Proposal,
    Contract,
    Review,
    Message
)

admin.site.register(Profile)
admin.site.register(Project)
admin.site.register(Proposal)
admin.site.register(Contract)
admin.site.register(Review)
admin.site.register(Message)

