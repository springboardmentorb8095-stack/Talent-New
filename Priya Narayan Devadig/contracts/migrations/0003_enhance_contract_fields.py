# Generated migration for enhanced contract fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contracts', '0002_alter_contract_options_contract_updated_at_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='contract',
            name='actual_completion_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='contract',
            name='deliverables',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='contract',
            name='last_activity',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='contract',
            name='milestones',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='contract',
            name='paid_amount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name='contract',
            name='payment_status',
            field=models.CharField(choices=[('pending', 'Pending'), ('partial', 'Partial'), ('paid', 'Paid'), ('overdue', 'Overdue')], default='pending', max_length=20),
        ),
        migrations.AddField(
            model_name='contract',
            name='progress_percentage',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='contract',
            name='status',
            field=models.CharField(choices=[('draft', 'Draft'), ('active', 'Active'), ('in_progress', 'In Progress'), ('completed', 'Completed'), ('terminated', 'Terminated'), ('disputed', 'Disputed'), ('cancelled', 'Cancelled')], default='active', max_length=20),
        ),
    ]