from django.contrib import admin
from .models import Todo

# Register your models here.


class TodoAdmin(admin.ModelAdmin):
	list_display = ('item', 'user', 'due_date', 'completed')
	list_filter = ('completed', 'due_date')
	search_fields = ['item']
	# fieldsets = [
	# 	(None, {'fields': ['item']}),
	# 	('Date Information', {'fields': ['due_date']})
	# ]
	fields = ('user', 'item', 'due_date', 'order', 'completed')
	readonly_fields = ['order']


admin.site.register(Todo, TodoAdmin)