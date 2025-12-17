from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('proposals', '0001_initial'),  # adjust to your latest migration
    ]

    operations = [
        migrations.AddField(
            model_name='proposal',
            name='proposed_rate',
            field=models.DecimalField(max_digits=10, decimal_places=2, default=0),
        ),
    ]
