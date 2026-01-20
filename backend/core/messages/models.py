# from django.db import models
# from django.conf import settings
# from contracts.models import Contract
# from .validators import validate_file_size

# def upload_to(instance, filename):
#     return f"chat_uploads/{instance.contract.id}/{filename}"

# class Message(models.Model):
#     contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="messages")

#     sender = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.CASCADE,
#         related_name="sent_messages"
#     )

#     body = models.TextField(blank=True, null=True)

#     attachment = models.FileField(
#         upload_to=upload_to,
#         blank=True,
#         null=True,
#         validators=[validate_file_size]
#     )

#     timestamp = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Message {self.id} on Contract {self.contract_id}"

#     class Meta:
#         ordering = ("timestamp",)
from django.db import models
from django.conf import settings
from contracts.models import Contract

class Message(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    text = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to="chat_files/", blank=True, null=True)

    MESSAGE_TYPES = [
        ("text", "Text"),
        ("image", "Image"),
        ("file", "File"),
        ("system", "System"),
    ]
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPES, default="text")

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.file:
            ext = self.file.name.split(".")[-1].lower()
            if ext in ["png", "jpg", "jpeg", "gif", "bmp", "webp"]:
                self.message_type = "image"
            else:
                self.message_type = "file"
        elif self.text:
            self.message_type = "text"
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"Message {self.id} ({self.message_type})"
