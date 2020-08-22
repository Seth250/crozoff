from django.db import models
from django.utils import timezone
from .utils import convert_date_time
from django.conf import settings

# Create your models here.

class Todo(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='todos', 
							 related_query_name='todo')
	item = models.CharField(max_length=200, verbose_name="todo item")
	completed = models.BooleanField(default=False)
	due_date = models.DateTimeField(verbose_name="due date")
	order = models.PositiveIntegerField(default=0)
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
