import os
import uuid
from django.core.files.storage import default_storage
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.conf import settings

ALLOWED_FILE_TYPES = {
    'image': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    'document': ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
    'video': ['.mp4', '.avi', '.mov', '.wmv', '.flv'],
    'audio': ['.mp3', '.wav', '.ogg', '.m4a'],
    'other': ['.zip', '.rar', '.tar', '.gz']
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def get_file_type(filename):
    """Determine file type based on extension"""
    ext = os.path.splitext(filename.lower())[1]
    for file_type, extensions in ALLOWED_FILE_TYPES.items():
        if ext in extensions:
            return file_type
    return 'other'

def validate_file(file):
    """Validate file size and type"""
    if file.size > MAX_FILE_SIZE:
        return False, "File size exceeds 10MB limit"
    
    file_type = get_file_type(file.name)
    if file_type == 'other' and os.path.splitext(file.name.lower())[1] not in ['.zip', '.rar', '.tar', '.gz']:
        return False, "File type not allowed"
    
    return True, None

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_chat_file(request):
    """Upload file for chat messages"""
    if 'file' not in request.FILES:
        return Response(
            {"error": "No file provided"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    file = request.FILES['file']
    
    # Validate file
    is_valid, error_message = validate_file(file)
    if not is_valid:
        return Response(
            {"error": error_message}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Generate unique filename
        timestamp = timezone.now().strftime('%Y%m%d_%H%M%S')
        file_extension = os.path.splitext(file.name)[1]
        unique_filename = f"{uuid.uuid4().hex}_{timestamp}{file_extension}"
        
        # Create upload path
        upload_path = f"chat_files/{request.user.id}/{unique_filename}"
        
        # Save file
        file_path = default_storage.save(upload_path, file)
        file_url = default_storage.url(file_path)
        
        # Get file type
        file_type = get_file_type(file.name)
        
        return Response({
            "file_url": file_url,
            "file_name": file.name,
            "file_type": file_type,
            "file_size": file.size,
            "message": "File uploaded successfully"
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {"error": f"File upload failed: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )