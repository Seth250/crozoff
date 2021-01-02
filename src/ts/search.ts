import { HTMLEvent } from './interfaces';


export function searchTodos(event: HTMLEvent<HTMLInputElement>): void {
    const searchText = event.currentTarget.value.toLowerCase();
    const todoNames = [...document.querySelectorAll('.todo-name') as NodeListOf<HTMLDivElement>];
    todoNames.forEach(name => {
        const nameText = name.textContent!.toLowerCase();
        // const todoElem = name.closest('.todo-item') as HTMLDivElement;
        const todoElem = (name.parentNode as HTMLDivElement).parentNode as HTMLDivElement;
        if (nameText.indexOf(searchText) === -1) {
            todoElem.classList.add('hide');
        } else {
            todoElem.classList.remove('hide');
        }
    })
}

export function mobileSearchBarToggle(event: HTMLEvent): void {
	if (window.matchMedia("(max-width: 600px)").matches) {
		event.currentTarget.classList.toggle('fa-search');
		event.currentTarget.classList.toggle('fa-arrow-left');
		(document.querySelector('.page-header h1') as HTMLHeadingElement).classList.toggle('collapse-mobile');
		(document.querySelector('.search-input') as HTMLInputElement).focus();
    }
}