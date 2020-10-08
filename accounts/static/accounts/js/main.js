function togglePasswordVisibility(){
    const hide = this.querySelector('.fa-eye-slash');
    const show = this.querySelector('.fa-eye');
    hide.classList.toggle('eye-slash-hide');
    show.classList.toggle('eye-show');
    const passwordInput = this.previousElementSibling;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
}

function initialize(){
    const messageBox = document.querySelector('.message-container');
    if (messageBox){
        const close = document.querySelector('.close');
        close.addEventListener('click', () => messageBox.classList.add('hide'), false);
    }

    const togglers = document.querySelectorAll('.password-toggler');
    if (togglers.length){
        togglers.forEach((toggler) => toggler.addEventListener('click', togglePasswordVisibility, false))
    }
}

window.addEventListener('load', initialize, false);