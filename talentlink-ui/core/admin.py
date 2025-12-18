from django.contrib import admin
from .models import (
    User, Profile, Skill,
    Project, Proposal, Contract,
    Message, Review
)


admin.site.register(User)
admin.site.register(Profile)
admin.site.register(Skill)
admin.site.register(Project)
admin.site.register(Proposal)
admin.site.register(Contract)
admin.site.register(Message)
admin.site.register(Review)
