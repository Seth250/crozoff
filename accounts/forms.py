from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import get_user_model
from django.utils.translation import ugettext_lazy as _

class UserSignUpForm(UserCreationForm):
    username = forms.CharField(
        max_length=25,
        label_suffix="",
        widget=forms.TextInput(
            attrs={
                'class': 'text-input-acc standard-input',
            }
        )          
    )
    email = forms.EmailField(
        label=_('Email Address'),
        label_suffix="",
        required=True,
        widget=forms.EmailInput(
            attrs={
                'class': 'text-input-acc standard-input',
            }
        )
    )
    password1 = forms.CharField(
        label=_("Password"),
        label_suffix="",
        strip=False,
        widget=forms.PasswordInput(
            attrs={
                'autocomplete': 'new-password',
                'class': 'text-input-acc password-input',
            }
        ),
    )
    password2 = forms.CharField(
        label=_('Confirm Password'),
        label_suffix="",
        strip=False,
        widget=forms.PasswordInput(
            attrs={
                'autocomplete': 'new-password',
                'class': 'text-input-acc password-input',
            }
        )
    )

    class Meta(UserCreationForm.Meta):
        model = get_user_model()
        fields = ('username', 'email')


class CustomAuthenticationForm(AuthenticationForm):
	username = forms.CharField(
		max_length = 25,
        label_suffix="",
		widget=forms.TextInput(
			attrs={
				'class': 'text-input-acc standard-input',
			}
		)
	)
	password = forms.CharField(
        strip=False,
        label_suffix="",
        widget=forms.PasswordInput(
        	attrs={
        		'autocomplete': 'new-password',
        		'class': 'text-input-acc password-input',
        	}
        )
	)
