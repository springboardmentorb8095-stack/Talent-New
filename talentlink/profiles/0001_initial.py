from django.db import migrations, models
from django.conf import settings
from django.db.models.deletion import CASCADE

class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=255)),
                ('bio', models.TextField(blank=True, null=True)),
                ('role', models.CharField(max_length=50)),
                ('user', models.OneToOneField(
                    on_delete=CASCADE,
                    to=settings.AUTH_USER_MODEL
                )),
            ],
        ),
    ]
