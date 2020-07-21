from django.shortcuts import render, redirect, get_object_or_404
from .models import Todo
from .forms import TodoForm
from django.utils import timezone
from django.contrib import messages
from django.http import HttpResponse
import json
from django.urls import reverse
from django.views.generic import (
	View,
	UpdateView,
	DeleteView,
)

# Create your views here.

class BaseTodoObjectView(View):
	success_message = None
	template_name = 'todo/index.html'
	form_class = TodoForm

	def get_object(self):
		_pk = self.kwargs.get('pk')
		obj = None
		if _pk is not None:
			obj = get_object_or_404(Todo, pk=_pk)

		return obj

	def get(self, request, *args, **kwargs):
		obj = self.get_object()
		form = self.form_class(instance=obj)
		total_pending = Todo.objects.filter(completed=False).count()
		todo_list = Todo.objects.all().order_by('order');
		# pending_todos = Todo.objects.filter(completed=False).order_by('-date_created')
		# completed_todos = Todo.objects.filter(completed=True).order_by('-date_completed')
		# todo_list = [*pending_todos, *completed_todos]
		# todo_list = [*completed_todos, *pending_todos]

		context = {
			'todo_list': todo_list,
			'total_pending': total_pending,
			'form': form
		}

		return render(request, self.template_name, context)

	def post(self, request, *args, **kwargs):
		obj = self.get_object()
		form = self.form_class(data=request.POST, instance=obj)
		if form.is_valid():
			form.save()
			messages.success(request, self.success_message)
			return redirect("todo:todo_list_create")


class TodoListCreateView(BaseTodoObjectView):
	success_message = 'Todo Item has been Added Successfully!'


class TodoUpdateView(BaseTodoObjectView):
	success_message = 'Todo Item has been Updated!'


class TodoDeleteView(DeleteView):
	model = Todo
	success_message = 'Todo Item has been Deleted Successfully!'

	def get_success_url(self):
		return reverse("todo:todo_list_create")

	def delete(self, request, *args, **kwargs):
		# obj = self.get_object()
		messages.success(self.request, self.success_message)
		return super(TodoDeleteView, self).delete(request, *args, **kwargs)


class TodoCheckView(UpdateView):
	model = Todo
	info_message = 'Status has been Changed to Completed!'

	def post(self, request, *args, **kwargs):
		obj = self.get_object()
		obj.completed = True
		obj.date_completed = timezone.now()
		obj.save()
		messages.info(self.request, self.info_message)
		return redirect("todo:todo_list_create")


class TodoUncheckView(UpdateView):
	model = Todo
	info_message = 'Status change has been reverted!'

	def post(self, request, *args, **kwargs):
		obj = self.get_object()
		obj.completed = False
		obj.date_completed = None
		obj.save()
		messages.info(self.request, self.info_message)
		return redirect("todo:todo_list_create")


class TodoOrderSaveView(View):
	model = Todo

	def post(self, request, *args, **kwargs):
		if request.is_ajax():
			todo_data = json.loads(request.body)
			for data in todo_data:
				obj = get_object_or_404(self.model, pk=data['pk'])
				obj.order = data['order']
				obj.save()

			return HttpResponse('saved')