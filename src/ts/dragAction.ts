import { HTMLEvent, TodoOrder, ResponseMessage } from './interfaces';
import { DragOffset, isDefaultDragOffset } from './types';
import { todoContainer } from './DOMVars';
import { displayMessage, errorHandler, getDefaultRequestHeaders } from './utilFunctions';


function getElementAfterCurrentDrag(yPosition: number): HTMLDivElement | null {
    const draggableElements = [...document.querySelectorAll('[draggable="true"]:not(.dragging)') as NodeListOf<HTMLDivElement>]
    const obj = draggableElements.reduce((closest: DragOffset, child): DragOffset => {
        const box = child.getBoundingClientRect();
        const offset = (yPosition - box.top - box.height) / 2;
        if (isDefaultDragOffset(closest) && (offset < -10 && offset > closest.defaultOffset)) {
            return { offset, element: child }
        } else {
            return closest;
        }
    }, { defaultOffset: Number.NEGATIVE_INFINITY });

    return !isDefaultDragOffset(obj) ? obj.element : null;
}

function updateTodoElemPosition(event: MouseEvent & { currentTarget: HTMLDivElement }): void {
    event.preventDefault();
    const currentDrag = document.querySelector('.dragging') as HTMLDivElement;
    const afterElement = getElementAfterCurrentDrag(event.clientY); // the purpose of using mouse event
    if (afterElement) {
        event.currentTarget.insertBefore(currentDrag, afterElement);
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
    const todoElems = [...document.querySelectorAll('.todo-item') as NodeListOf<HTMLDivElement>];
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
    } else {
        event.target.classList.remove('far', 'fa-save');
		event.target.classList.add('fas', 'fa-arrows-alt');
        event.target.setAttribute('title', 'Enable Todo re-arrangement');
        const todoOrderArr: TodoOrder[] = [];
        todoElems.forEach((elem, index) => {
            const [ pk, order ] = elem.getAttribute('data-order')!.split('-');
            // ensuring the values (order and index) are not the same cause it'll be both redundant and inefficient 
            // to send data of a todo item to the backend when it's order was not modified
            if (+order !== index) {
                todoOrderArr.push({ pk: +pk, order: index });
            }
            elem.setAttribute('data-order', `${pk}-${index}`);
            elem.removeAttribute('draggable');
            elem.classList.remove('draggable');
            elem.removeEventListener('dragstart', dragStartHandler as EventListener, false);
            elem.removeEventListener('dragend', dragEndHandler as EventListener, false);
        })
        todoContainer.removeEventListener('dragover', updateTodoElemPosition as EventListener, false);
        // Apparently, empty arrays evaluate to true in javascript(because they are essentially objects and objects 
        // are truthy), so I'm using .length as a workaround
        // the main purpose of this conditional is to prevent a request from being sent if no order has been modified
        if (todoOrderArr.length) {
            fetch('save-order/', {
                method: 'POST',
                headers: getDefaultRequestHeaders(),
                body: JSON.stringify(todoOrderArr)
            }).then(response => response.ok ? response.json() as Promise<ResponseMessage> : Promise.reject(response))
              .then(({ message, message_tag }) => displayMessage(message, message_tag))
              .catch(err => errorHandler(err));
        }
    }
}