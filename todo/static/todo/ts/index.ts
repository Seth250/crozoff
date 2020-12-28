import { searchTodos, mobileSearchBarToggle } from './search';
import { todoArrangementToggle } from './dragElement';

const todoContainer = document.getElementById('todo-list-container') as HTMLDivElement;
const messageBox = document.querySelector('.message') as HTMLDivElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const totalPendingElem = document.getElementById('total-pending') as HTMLSpanElement;

function initialize(): void {
    const searchBox = document.querySelector('.search-input') as HTMLInputElement;
    searchBox.addEventListener('click', searchTodos as EventListener, false);

    const searchIcon = document.querySelector('.search-icon') as HTMLElement;
    searchIcon.addEventListener('click', mobileSearchBarToggle as EventListener, false);

    const detailBar = document.querySelector('.detail-bar') as HTMLDivElement;
    const detailBarNav = document.querySelector('.detail-bar__nav') as HTMLElement;
    detailBar.addEventListener('click', () => detailBarNav.classList.toggle('hide'), false);
    detailBar.addEventListener('blur', () => detailBarNav.classList.add('hide'), false);

    const moveIcon = document.querySelector('.move-icon') as HTMLElement;
    moveIcon.addEventListener('click', todoArrangementToggle as EventListener, false);
}

window.addEventListener('load', initialize, false);