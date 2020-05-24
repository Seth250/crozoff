from django.db import models
from django.utils import timezone
from .convert import convert_date_time

# Create your models here.

class Todo(models.Model):
	item = models.CharField(max_length=100, verbose_name="todo item")
	completed = models.BooleanField(default=False)
	due_date = models.DateTimeField(verbose_name="due date")
	date_created = models.DateTimeField(auto_now_add=True)
	# date_updated = models.DateTimeField(auto_now=True)
	date_completed = models.DateTimeField(blank=True, null=True)

	def __str__(self):
		return self.item

	def get_due_info(self):
		current_date = timezone.now()
		if self.completed:
			return {
				'status': 'Completed', 
				'class_tag': 'complete'
			}

		elif current_date < self.due_date:
			return {
				'status': f'Due {convert_date_time(self.due_date - current_date)} from now',
				'class_tag': 'pending'
			}

		else:
			return {
				'status': f'OVERDUE by {convert_date_time(current_date - self.due_date)}',
				'class_tag': 'overdue'
			}
