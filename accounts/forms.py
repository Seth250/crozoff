from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, UsernameField
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinLengthValidator


class UserSignUpForm(UserCreationForm):

    username = UsernameField(
        max_length=150,
        validators=[MinLengthValidator(4)],
        widget=forms.TextInput(
            attrs={
                'class': 'text-input-acc standard-input',
            }
        )
    )
    email = forms.EmailField(
        label=_('Email Address'),
        required=True,
        widget=forms.EmailInput(
            attrs={
                'class': 'text-input-acc standard-input',
            }
        )
    )   
    password1 = forms.CharField(
        label=_('Password'),
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

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('label_suffix', '')
        return super(UserSignUpForm, self).__init__(*args, **kwargs)
        
    def clean_username(self):
        cleaned_data = super(UserSignUpForm, self).clean()
        username = cleaned_data.get("username")
        if get_user_model().objects.filter(username__iexact=username).exists():
            self.add_error('username', 'This username already exists')

        return username


class CustomAuthenticationForm(AuthenticationForm):
    username = UsernameField(
        widget=forms.TextInput(
            attrs={
                'autofocus': True,
                'class': 'text-input-acc standard-input'
            }
        )
    )
    password = forms.CharField(
        strip=False,
        widget=forms.PasswordInput(
        	attrs={
        		'autocomplete': 'new-password',
        		'class': 'text-input-acc password-input',
        	}
        )
	)

    def __init__(self, request=None, *args, **kwargs):
        kwargs.setdefault('label_suffix', '')
        super(CustomAuthenticationForm, self).__init__(request, *args, **kwargs)
