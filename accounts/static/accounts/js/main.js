function togglePasswordVisibility(){
    const hide = this.querySelector('.fa-eye-slash');
    const show = this.querySelector('.fa-eye');
    hide.classList.toggle('eye-slash-hide');
    show.classList.toggle('eye-show');
    const passwordInput = this.previousElementSibling;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
}

function initialize(){
    const togglers = document.querySelectorAll('.password-toggler');
    togglers.forEach((toggler) => toggler.addEventListener('click', togglePasswordVisibility, false))
}

window.addEventListener('load', initialize, false);