from django.core.exceptions import ValidationError

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def validate_file_size(value):
    if value.size > MAX_FILE_SIZE:
        raise ValidationError("File too large. Max size is 10MB.")
