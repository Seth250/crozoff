from django.urls import path
from .views import (
	TodoListCreateView, 
	TodoDeleteView,
	TodoUpdateView,
	TodoCheckView,
	TodoUncheckView,
	TodoOrderSaveView,
)

app_name = 'todo'

urlpatterns = [
	path('', TodoListCreateView.as_view(), name='todo_list_create'),
	path('<int:pk>/edit/', TodoUpdateView.as_view(), name="todo_edit"),
	path('<int:pk>/delete/', TodoDeleteView.as_view(), name='todo_delete'),
	path('<int:pk>/check/', TodoCheckView.as_view(), name='todo_check'),
	path('<int:pk>/uncheck/', TodoUncheckView.as_view(), name='todo_uncheck'),
	path('save-order/', TodoOrderSaveView.as_view(), name="todo_order_save"),
]