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
        
    def clean_username(self):
        cleaned_data = super(UserSignUpForm, self).clean()
        username = cleaned_data.get("username")
        if len(username) < 4:
            self.add_error('username', 'Username cannot be less than 4 characters')
            
        elif get_user_model().objects.filter(username__iexact=username).exists():
            self.add_error('username', 'This username already exists')

        return username


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
