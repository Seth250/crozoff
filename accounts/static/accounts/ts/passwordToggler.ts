import { HTMLEvent } from 'todo/static/todo/ts/interfaces';

export default function togglePasswordVisibility(event: HTMLEvent<HTMLAnchorElement>): void {
    const hide = event.currentTarget.querySelector('.fa-eye-slash') as HTMLElement;
    const show = event.currentTarget.querySelector('.fa-eye') as HTMLElement;
    hide.classList.toggle('eye-slash-hide');
    show.classList.toggle('eye-slash');
    const passwordInput = event.currentTarget.previousElementSibling as HTMLInputElement;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
}