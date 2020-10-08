from django.db import models
from django.utils import timezone
from .utils import get_date_time_diff
from django.conf import settings
from django.utils.translation import gettext_lazy as _

# Create your models here.

class TodoQuerySet(models.QuerySet):

	def pending_count(self):
		return self.filter(completed=False).count()


class Todo(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='todos')
	item = models.CharField(_('todo item'), max_length=200)
	completed = models.BooleanField(default=False)
	due_date = models.DateTimeField()
	order = models.PositiveIntegerField(default=0, editable=False)
	date_created = models.DateTimeField(auto_now_add=True)
	# date_updated = models.DateTimeField(auto_now=True)
	date_completed = models.DateTimeField(blank=True, null=True)
	objects = TodoQuerySet.as_manager()

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
				'status': f'Due {get_date_time_diff(self.due_date, current_date)} from now',
				'class_tag': 'pending'
			}

		else:
			return {
				'status': f'OVERDUE by {get_date_time_diff(current_date, self.due_date)}',
				'class_tag': 'overdue'
			}
