import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('projects', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contract',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateField()),
                ('end_date', models.DateField(blank=True, null=True)),
                ('agreed_amount', models.DecimalField(decimal_places=2, max_digits=12)),
                ('status', models.CharField(choices=[('active', 'Active'), ('completed', 'Completed'), ('terminated', 'Terminated')], default='active', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('proposal', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='contract', to='projects.proposal')),
            ],
        ),
    ]