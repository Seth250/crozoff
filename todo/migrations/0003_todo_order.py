# Generated by Django 3.0.4 on 2020-07-17 13:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0002_remove_todo_date_updated'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='order',
            field=models.PositiveIntegerField(default=0),
            preserve_default=False,
        ),
    ]
