# from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from .forms import UserSignUpForm
from django.contrib.messages.views import SuccessMessageMixin
from django.urls import reverse
from django.views.generic import CreateView
from django.conf import settings

# Create your views here.

class UserCreateView(SuccessMessageMixin, CreateView):
    model = get_user_model()
    form_class = UserSignUpForm
    template_name = 'accounts/signup.html'
    success_message = 'Your Account has been succesfully Created, Login to Continue!'

    def get_success_url(self):
        return reverse(settings.LOGIN_URL)
