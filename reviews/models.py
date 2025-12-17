
from django.db import models
from users.models import User
from projects.models import Project

class Review(models.Model):
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="given_reviews")
    reviewed_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_reviews")
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    rating = models.IntegerField(
        choices=[(i, i) for i in range(1, 6)],  # 1 to 5 stars
        default=5
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.reviewer.username} for {self.reviewed_user.username}"
