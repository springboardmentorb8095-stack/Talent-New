#!/usr/bin/env python3
"""
Mark the migration as applied without running it
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freelance_marketplace.settings')
django.setup()

from django.db import connection

def mark_migration_applied():
    """Mark the migration as applied"""
    
    with connection.cursor() as cursor:
        # Check if migration already exists
        cursor.execute("""
            SELECT COUNT(*) FROM django_migrations 
            WHERE app = 'messaging' AND name = '0004_remove_message_subject';
        """)
        
        if cursor.fetchone()[0] == 0:
            # Insert the migration record
            cursor.execute("""
                INSERT INTO django_migrations (app, name, applied) 
                VALUES ('messaging', '0004_remove_message_subject', NOW());
            """)
            print("✓ Migration marked as applied")
        else:
            print("✓ Migration already marked as applied")

if __name__ == "__main__":
    print("Marking migration as applied...")
    mark_migration_applied()
    print("Done!")