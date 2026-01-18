# contracts/migrations/0001_initial.py
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),      # only if Contract references User
        ('profiles', '0001_initial'),   # if Contract references Profile
    ]

    operations = [
        migrations.CreateModel(
            name='Contract',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('profile', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    to='profiles.Profile'
                )),
                # add more fields from your Contract model here
            ],
        ),
    ]
