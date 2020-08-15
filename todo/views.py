from django.shortcuts import render, redirect, get_object_or_404
from .models import Todo
from .forms import TodoForm
from django.utils import timezone
from django.contrib import messages
from django.http import JsonResponse
from django.db import transaction
import json
from django.urls import reverse
from django.views.generic import View
from django.views.generic.detail import SingleObjectMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import PermissionDenied

# Create your views here.

class BaseTodoObjectView(LoginRequiredMixin, View):
	success_message = None

	def get_object(self):
		pk = self.kwargs.get('pk')
		obj = None
		if pk is not None:
			obj = get_object_or_404(Todo, pk=pk)
			if not self.request.user.is_superuser or self.request.user != obj.user:
				raise PermissionDenied('You cannot access this page')

		return obj

	def get(self, request, *args, **kwargs):
		obj = self.get_object()
		form = TodoForm(instance=obj)
		total_pending = request.user.todos.filter(completed=False).count()
		todo_list = request.user.todos.all().order_by('order');

		# if it is an ajax request and we want to get the data for an object
		if request.is_ajax() and obj:
			response_dict = {field.name: field.value() for field in form}
			return JsonResponse(response_dict)
			
		else:
			context = {
				'todo_list': todo_list,
				'total_pending': total_pending,
				'form': form
			}
			return render(request, 'todo/index.html', context)

	def post(self, request, *args, **kwargs):
		obj = self.get_object()
		form_data = json.loads(request.body)
		form = TodoForm(data=form_data, instance=obj)
		if request.is_ajax() and form.is_valid():
			# todo_instance = form.save(commit=False)
			todo_instance = form.save()
			todo_dict = todo_instance.__dict__
			todo_dict.pop('_state')
			todo_dict['message'] = self.success_message
			todo_dict['message_tag'] = 'success'
			todo_dict['total_pending'] = request.user.todos.filter(completed=False).count()
			todo_dict.update(todo_instance.get_due_info())
			todo_dict['action'] = 'update' if obj else 'create' 
			return JsonResponse(todo_dict)

		# else:
		# 	form = self.form_class(data=request.POST, instance=obj)
		# 	if form.is_valid():
		# 		form.save(commit=False)
		# 		messages.success(request, self.success_message)
		# 		return redirect("todo:todo_list_create")


class TodoStatusUpdateView(LoginRequiredMixin, SingleObjectMixin, View):
	model = Todo
	info_message = None
	completed = False
	date_completed = None

	def post(self, request, *args, **kwargs):
		if request.is_ajax():
			obj = self.get_object()
			obj.completed = self.completed
			obj.date_completed = self.date_completed
			obj.save()
			todo_dict = {}
			todo_dict.update(obj.get_due_info())
			todo_dict['message'] = self.info_message
			todo_dict['message_tag'] = 'info'			
			todo_dict['total_pending'] = request.user.todos.filter(completed=False).count()
			todo_dict['action'] = 'check' if self.completed else 'uncheck'
			return JsonResponse(todo_dict)


class TodoListCreateView(BaseTodoObjectView):
	success_message = 'Todo Item has been Added Successfully!'


class TodoUpdateView(BaseTodoObjectView):
	success_message = 'Todo Item has been Updated!'


class TodoCheckView(TodoStatusUpdateView):
	info_message = 'Status has been Changed to Completed!'
	completed = True
	date_completed = timezone.now()


class TodoUncheckView(TodoStatusUpdateView):
	info_message = 'Status change has been reverted!'


class TodoDeleteView(LoginRequiredMixin, SingleObjectMixin, View):
	model = Todo

	def post(self, request, *args, **kwargs):
		if request.is_ajax():
			self.get_object().delete()
			todo_dict = {
				'message': 'Todo Item has been Deleted Successfully!',
				'message_tag': 'success',
				'total_pending': request.user.todos.filter(completed=False).count()
			}
			return JsonResponse(todo_dict)


class TodoOrderSaveView(LoginRequiredMixin, View):

	def post(self, request, *args, **kwargs):
		if request.is_ajax():
			todo_data = json.loads(request.body)
			with transaction.atomic():
				for data in todo_data:
					obj = get_object_or_404(Todo, pk=data['pk'])
					obj.order = data['order']
					obj.save()

			todo_dict = {
				'message': 'Order has been Saved Successfully!', 
				'message_tag': 'success'
			}
			return JsonResponse(todo_dict)

