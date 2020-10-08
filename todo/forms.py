from django import forms
from .models import Todo

class TodoForm(forms.ModelForm):

	class Meta:	
		model = Todo
		fields = ('item', 'due_date', )
		widgets = {
			'item': forms.TextInput(
				attrs={
					'class': 'text-input input-box',
					'placeholder': 'Enter Your Todo'
				}
			),
			'due_date': forms.DateTimeInput(
				attrs={
					'type': 'datetime-local', 
					'class': 'date-time-input input-box',
				}
			)
		}
			