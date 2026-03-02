# Generated migration for notification system

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0001_initial'),
        ('proposals', '0001_initial'),
        ('contracts', '0001_initial'),
        ('messaging', '0004_remove_message_subject'),
        ('reviews', '0001_initial'),
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notification_type', models.CharField(choices=[('message', 'New Message'), ('proposal_received', 'Proposal Received'), ('proposal_accepted', 'Proposal Accepted'), ('proposal_rejected', 'Proposal Rejected'), ('contract_created', 'Contract Created'), ('contract_completed', 'Contract Completed'), ('review_received', 'Review Received'), ('payment_received', 'Payment Received'), ('system', 'System Notification')], max_length=20)),
                ('title', models.CharField(max_length=200)),
                ('message', models.TextField()),
                ('is_read', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('action_url', models.CharField(blank=True, max_length=500)),
                ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to=settings.AUTH_USER_MODEL)),
                ('related_contract', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='contracts.contract')),
                ('related_message', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='messaging.message')),
                ('related_project', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='projects.project')),
                ('related_proposal', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='proposals.proposal')),
                ('related_review', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='reviews.review')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='NotificationPreference',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email_messages', models.BooleanField(default=True)),
                ('email_proposals', models.BooleanField(default=True)),
                ('email_contracts', models.BooleanField(default=True)),
                ('email_reviews', models.BooleanField(default=True)),
                ('email_payments', models.BooleanField(default=True)),
                ('email_system', models.BooleanField(default=True)),
                ('inapp_messages', models.BooleanField(default=True)),
                ('inapp_proposals', models.BooleanField(default=True)),
                ('inapp_contracts', models.BooleanField(default=True)),
                ('inapp_reviews', models.BooleanField(default=True)),
                ('inapp_payments', models.BooleanField(default=True)),
                ('inapp_system', models.BooleanField(default=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='notification_preferences', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]