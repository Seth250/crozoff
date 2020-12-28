import { HTMLEvent, ElementDragOffset, DefaultDragOffset } from './interfaces';
import { todoContainer } from './DOMVariables';

// type guard
function isDefaultOffset(value: ElementDragOffset | DefaultDragOffset): value is DefaultDragOffset {
    return value.hasOwnProperty('defaultOffset');
}

function getElementAfterCurrentDrag(yPosition: number): HTMLDivElement {
    const draggableElements = Array.from(
        document.querySelectorAll("[draggable='true']:not(.dragging)") as NodeListOf<HTMLDivElement>
    )
    return draggableElements.reduce((closest: ElementDragOffset | DefaultDragOffset, child): ElementDragOffset | DefaultDragOffset => {
        const box = child.getBoundingClientRect();
        const offset = (yPosition - box.top - box.height) / 2;
        if (isDefaultOffset(closest) && (offset < -10 && offset > closest.defaultOffset)) {
            return { offset, element: child }
        } else {
            return closest;
        }
    }, { defaultOffset: Number.NEGATIVE_INFINITY }).element
}

function updateTodoElemPosition(event: MouseEvent & { currentTarget: HTMLElement }): void {
    event.preventDefault();
    const currentDrag = document.querySelector('.dragging') as HTMLDivElement;
    const afterElement = getElementAfterCurrentDrag(event.clientY);
    if (afterElement) {
        event.currentTarget.prepend(currentDrag);
    } else {
        event.currentTarget.appendChild(currentDrag);
    }
}

function dragStartHandler(event: HTMLEvent<HTMLDivElement>): void {
    event.currentTarget.classList.add('dragging');
}

function dragEndHandler(event: HTMLEvent<HTMLDivElement>): void {
    event.currentTarget.classList.remove('dragging');
    event.currentTarget.style.transition = 'all 0.3s ease-in';
}

export function todoArrangementToggle(event: HTMLEvent) {
    const todoElems = document.querySelectorAll('.todo-item') as NodeListOf<HTMLDivElement>;
    if (event.target.classList.contains('fas')) {
		event.target.classList.remove('fas', 'fa-arrows-alt');
        event.target.classList.add('far', 'fa-save');
        event.target.setAttribute('title', 'Save Your Changes');
        todoElems.forEach(elem => {
			elem.setAttribute('draggable', 'true');
			elem.classList.add('draggable');
			elem.addEventListener('dragstart', dragStartHandler as EventListener, false);
			elem.addEventListener('dragend', dragEndHandler as EventListener, false);
        })
        todoContainer.addEventListener('dragover', updateTodoElemPosition as EventListener, false);
    }
}