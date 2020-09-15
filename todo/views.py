from django.shortcuts import render, redirect, get_object_or_404
from .models import Todo
from .forms import TodoForm
from django.utils import timezone
from django.forms.models import model_to_dict
from django.contrib import messages
from django.http import JsonResponse, Http404
from django.db import transaction
import json
# from django.urls import reverse
from django.views.generic import View
from django.views.generic.detail import SingleObjectMixin
from django.contrib.auth.mixins import LoginRequiredMixin
# from django.core.exceptions import PermissionDenied

# Create your views here.

def action_error():
	response_dict = {'message': 'Action could not be completed, Refresh and retry', 'message_tag': 'error'}
	return JsonResponse(response_dict, status=400)


class AjaxFormMixin(object):

	def form_valid(self, form):
		instance = form.save(commit=False)
		instance.user = self.request.user
		instance.save()
		todo_dict = model_to_dict(instance, fields=['id', 'item', 'order'])
		todo_dict['message'] = self.success_message
		todo_dict['message_tag'] = 'success'
		todo_dict['total_pending'] = self.request.user.todos.filter(completed=False).count()
		todo_dict.update(instance.get_due_info())
		todo_dict['action'] = self.action
		return JsonResponse(todo_dict, status=200)


class BaseTodoView(SingleObjectMixin, View):

	def get_queryset(self):
		return self.request.user.todos.all()


class TodoListCreateView(LoginRequiredMixin, AjaxFormMixin, View):
	
	def get_queryset(self):
		return self.request.user.todos.order_by('order')

	def get(self, request, *args, **kwargs):
		form = TodoForm()
		context = {
			'form': form,
			'todo_list': self.get_queryset(),
			'total_pending': self.request.user.todos.filter(completed=False).count()
		}
		return render(request, 'todo/index.html', context)

	def post(self, request, *args, **kwargs):
		form_data = json.loads(request.body)
		form = TodoForm(data=form_data)
		if request.is_ajax() and form.is_valid():
			with transaction.atomic():
				for order, instance in enumerate(self.get_queryset(), start=1):
					instance.order = order
					instance.save()

			self.success_message = 'New Todo Item has been Added!'
			self.action = 'create'
			return self.form_valid(form)

		return action_error()


class TodoUpdateView(LoginRequiredMixin, AjaxFormMixin, BaseTodoView):

	def get(self, request, *args, **kwargs):
		obj = self.get_object()
		form = TodoForm(instance=obj)
		if request.is_ajax():
			response_dict = {field.name: field.value() for field in form}
			return JsonResponse(response_dict, status=200)

		raise Http404

	def post(self, request, *args, **kwargs):
		obj = self.get_object()
		form_data = json.loads(request.body)
		form = TodoForm(data=form_data, instance=obj)
		if request.is_ajax() and form.is_valid():
			self.success_message = 'Todo Item has been Updated!'
			self.action = 'update'
			return self.form_valid(form)

		return action_error()


class TodoStatusUpdateView(LoginRequiredMixin, BaseTodoView):

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
			return JsonResponse(todo_dict, status=200)

		return action_error()


class TodoCheckView(TodoStatusUpdateView):

	def post(self, request, *args, **kwargs):
		self.info_message = 'Status has been Changed to Completed!'
		self.completed = True
		self.date_completed = timezone.now()
		return super(TodoCheckView, self).post(request, *args, **kwargs)


class TodoUncheckView(TodoStatusUpdateView):

	def post(self, request, *args, **kwargs):
		self.info_message = 'Status change has been reverted!'
		self.completed = False
		self.date_completed = None
		return super(TodoUncheckView, self).post(request, *args, **kwargs)


class TodoDeleteView(LoginRequiredMixin, BaseTodoView):

	def post(self, request, *args, **kwargs):
		if request.is_ajax():
			self.get_object().delete()
			todo_dict = {
				'message': 'Todo Item has been Deleted Successfully!',
				'message_tag': 'success',
				'total_pending': request.user.todos.filter(completed=False).count()
			}
			return JsonResponse(todo_dict, status=200)

		return action_error()


class TodoOrderSaveView(LoginRequiredMixin, View):

	def post(self, request, *args, **kwargs):
		if request.is_ajax():
			todo_data = json.loads(request.body)
			with transaction.atomic():
				for data in todo_data:
					obj = get_object_or_404(Todo, pk=data['pk'])
					if obj.user != request.user:
						return action_error()

					obj.order = data['order']
					obj.save()

			todo_dict = {'message': 'Order has been Saved Successfully!', 'message_tag': 'success'}
			return JsonResponse(todo_dict, status=200)

		return action_error()
