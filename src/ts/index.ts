import { searchTodos, mobileSearchBarToggle } from './search';
import { todoArrangementToggle } from './dragAction';
import { todoForm, todoContainer } from './DOMVars';
import { ajaxTodoFormSubmit, delegateClickEvent } from './CRUDActions';
import { togglePasswordVisibility } from './passwordToggler';

function initialize(): void {
    const searchBox = document.querySelector('.search-input') as HTMLInputElement | null;
    if (searchBox) {
        searchBox.addEventListener('keyup', searchTodos as EventListener, false);

        const searchIcon = document.querySelector('.search-icon') as HTMLElement;
        searchIcon.addEventListener('click', mobileSearchBarToggle as EventListener, false);

        const detailBar = document.querySelector('.detail-bar') as HTMLDivElement;
        const detailBarNav = document.querySelector('.detail-bar__nav') as HTMLElement;
        detailBar.addEventListener('click', () => detailBarNav.classList.toggle('hide'), false);
        detailBar.addEventListener('blur', () => detailBarNav.classList.add('hide'), false);

        const moveIcon = document.querySelector('.move-icon') as HTMLElement;
        moveIcon.addEventListener('click', todoArrangementToggle as EventListener, false);

        todoContainer.addEventListener('click', delegateClickEvent as EventListener, false);

        todoForm.addEventListener('submit', ajaxTodoFormSubmit as EventListener, false);
    } else {
        const messageContainer = document.querySelector('.message-container') as HTMLDivElement | null;
        if (messageContainer) {
            const close = document.querySelector('.close') as HTMLSpanElement;
            close.addEventListener('click', () => messageContainer.classList.add('hide'), false);
        }
    
        const togglers = [...document.querySelectorAll('.password-toggler') as NodeListOf<HTMLAnchorElement>];
        if (togglers.length) {
            togglers.forEach(toggler => toggler.addEventListener('click', togglePasswordVisibility as EventListener, false));
        }
    }
}

window.addEventListener('load', initialize, false);