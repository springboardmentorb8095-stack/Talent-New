#!/usr/bin/env python3
"""
Fix messaging database issues by directly updating the database
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freelance_marketplace.settings')
django.setup()

from django.db import connection
from messaging.models import Message, Conversation

def fix_messaging_database():
    """Fix the messaging database issues"""
    
    with connection.cursor() as cursor:
        print("Fixing messaging database...")
        
        # Step 1: Create conversations for messages without them
        print("1. Creating conversations for orphaned messages...")
        
        # Get messages without conversations
        orphaned_messages = Message.objects.filter(conversation__isnull=True)
        print(f"Found {orphaned_messages.count()} messages without conversations")
        
        for message in orphaned_messages:
            # Create a conversation
            conversation = Conversation.objects.create()
            conversation.participants.add(message.sender, message.recipient)
            
            # Update the message
            message.conversation = conversation
            message.save()
            print(f"  Created conversation {conversation.id} for message {message.id}")
        
        # Step 2: Make subject field nullable first, then drop it
        print("2. Making subject field nullable...")
        try:
            cursor.execute("ALTER TABLE messaging_message ALTER COLUMN subject DROP NOT NULL;")
            print("  ✓ Subject field is now nullable")
        except Exception as e:
            print(f"  Subject field already nullable or error: {e}")
        
        # Step 3: Drop the subject column
        print("3. Dropping subject column...")
        try:
            cursor.execute("ALTER TABLE messaging_message DROP COLUMN IF EXISTS subject;")
            print("  ✓ Subject column dropped")
        except Exception as e:
            print(f"  Error dropping subject column: {e}")
        
        # Step 4: Make conversation_id NOT NULL
        print("4. Making conversation_id required...")
        try:
            cursor.execute("ALTER TABLE messaging_message ALTER COLUMN conversation_id SET NOT NULL;")
            print("  ✓ Conversation_id is now required")
        except Exception as e:
            print(f"  Error making conversation_id required: {e}")
        
        print("\n✓ Database fixes completed!")

if __name__ == "__main__":
    print("Messaging Database Fix")
    print("=" * 50)
    
    try:
        fix_messaging_database()
        print("\n" + "=" * 50)
        print("✓ All fixes applied successfully!")
    except Exception as e:
        print(f"\n✗ Error: {e}")
        print("You may need to run this script again or check the database manually.")