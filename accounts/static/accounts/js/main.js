const togglers = document.querySelectorAll('.password-toggler');
togglers.forEach((toggler) => {
    toggler.addEventListener('click', () => {
        const hide = toggler.querySelector('.fa-eye-slash');
        const show = toggler.querySelector('.fa-eye');
        hide.classList.toggle('eye-slash-hide');
        show.classList.toggle('eye-show');
        const passwordInput = toggler.previousElementSibling;
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    })
})