import { todoContainer, todoForm, totalPendingElem } from './DOMVars';
import { todoCreateFragment, emptyTodoListFragment } from './fragmentCreate';
import { HTMLEvent, ResponseMessage, TodoCreateUpdate, TodoFormData, TodoStatus } from './interfaces';
import { displayMessage, errorHandler, smoothScrollIntoView, getDefaultRequestHeaders } from './utilFunctions';


// create
function createTodoElement(responseObj: TodoCreateUpdate): void {
	if (todoContainer.querySelector('.empty-todo-list')) {
		todoContainer.replaceChild(todoCreateFragment(responseObj), todoContainer.firstElementChild as HTMLDivElement);
	} else {
		todoContainer.insertBefore(todoCreateFragment(responseObj), todoContainer.firstChild);
	}
	updatePendingTodoCount('increment');
	displayMessage(responseObj.message, responseObj.message_tag);
	smoothScrollIntoView(todoContainer.firstElementChild as HTMLDivElement);
}

// retrieve todo item and due_date for form use
function getTodoItemEditInfo(editLink: HTMLAnchorElement) {
	fetch(editLink.href, {
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
		}
	}).then(response => response.ok ? response.json() as Promise<TodoFormData> : Promise.reject(response))
	  .then(({ item, due_date }) => {
		(document.getElementById('id_item') as HTMLInputElement).value = item;
		// using slice to remove the seconds(:ss) from the date(the date value won't be valid unless it is removed)
		(document.getElementById('id_due_date') as HTMLInputElement).value = due_date.slice(0, -3);  
		todoForm.action = editLink.href;
		todoForm.scrollIntoView(true);
	  })	
	  .catch(err => errorHandler(err));
}

// update
function updateTodoElement(responseObj: TodoCreateUpdate): void {
    const todoElem = document.querySelector(`[data-item="item-${responseObj.id}"]`) as HTMLDivElement;
	todoElem.querySelector('.todo-name')!.textContent = responseObj.item;
	updateTodoStatus(responseObj, todoElem)
	displayMessage(responseObj.message, responseObj.message_tag);
	smoothScrollIntoView(todoElem);
}

// delete
function deleteTodoElement(deleteBtn: HTMLButtonElement){
	fetch(deleteBtn.getAttribute('data-url')!, {
		method: 'POST',
		headers: getDefaultRequestHeaders()
	}).then(response => response.ok ? response.json() as Promise<ResponseMessage> : Promise.reject(response))
	  .then(data => {
			// const todoElem = deleteBtn.closest('.todo-item') as HTMLDivElement;
			const todoElem = (deleteBtn.parentNode as HTMLDivElement).parentNode as HTMLDivElement
		  	todoElem.style.transform = 'translateY(30%)';
		  	todoElem.style.opacity = '0';
		  	todoElem.style.transition = 'all 0.35s ease-in';
		  	setTimeout(() => {
				if (!(todoElem.querySelector('.todo-status span') as HTMLSpanElement).classList.contains("complete")) {
					updatePendingTodoCount('decrement');
				}
				todoContainer.removeChild(todoElem);
				if (!todoContainer.children.length){
					todoContainer.appendChild(emptyTodoListFragment());
				}
			}, 400);
			displayMessage(data.message, data.message_tag);
		})
	  .catch(err => errorHandler(err));
}

function updateTodoStatus({ class_tag, status }: TodoCreateUpdate | TodoStatus, todoElem: HTMLDivElement): void {
	const todoStatus = todoElem.querySelector('.todo-status span') as HTMLSpanElement;
	todoStatus.className = class_tag;
	todoStatus.textContent = status;
}

function updatePendingTodoCount(action: 'increment' | 'decrement') {
	let value: number = +totalPendingElem.textContent!;
	totalPendingElem.textContent = (action === 'increment' ? ++value : --value).toString();
}

function updateTodoItemDetails(responseObj: TodoStatus, todoElem: HTMLDivElement): void {
	todoElem.querySelector('.todo-name')!.classList.toggle('strike');
	updateTodoStatus(responseObj, todoElem);
	updatePendingTodoCount(responseObj.class_tag === 'complete' ? 'decrement' : 'increment');
	displayMessage(responseObj.message, responseObj.message_tag);
}

function ajaxCheckboxAction(checkboxElem: HTMLInputElement): void {
	const todoPk = checkboxElem.getAttribute('data-pk')!;
	const todoElem = document.querySelector(`[data-item="item-${todoPk}"]`) as HTMLDivElement;
	fetch(`${todoPk}/${checkboxElem.checked ? 'check' : 'uncheck'}/`, {
		method: checkboxElem.form!.method,
		headers: getDefaultRequestHeaders()
	}).then(response => response.ok ? response.json() as Promise<TodoStatus> : Promise.reject(response))
	  .then(data => updateTodoItemDetails(data, todoElem))
	  .catch(err => errorHandler(err));

	checkboxElem.setAttribute('title', `${checkboxElem.checked ? 'Uncheck' : 'Check'} this todo`);
}

export function ajaxTodoFormSubmit(event: HTMLEvent<HTMLFormElement>): void {
	event.preventDefault();
	fetch(event.currentTarget.action, {
		method: event.currentTarget.method,
		headers: getDefaultRequestHeaders(),
		body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget)))
	}).then(response => response.ok ? response.json() as Promise<TodoCreateUpdate> : Promise.reject(response))
	  .then(data => data.action === "create" ? createTodoElement(data) : updateTodoElement(data))
	  .catch(err => errorHandler(err));

	event.currentTarget.reset();
	event.currentTarget.removeAttribute('action');
}

export function delegateClickEvent(event: HTMLEvent): void {
	if (event.target.matches('input[type="checkbox"]')){
		ajaxCheckboxAction(event.target as HTMLInputElement);
	// the reason why event.target matches the edit link and not the edit icon (even though you may be clicking 
	// the icon) is because you set pointer events on the edit icon to None (in your SASS), you also used this 
	// same approach for the delete icon
	} else if (event.target.matches('.edit-link')){
		event.preventDefault(); // prevents the page from redirecting
		getTodoItemEditInfo(event.target as HTMLAnchorElement);
	} else if (event.target.matches('.delete-button')){
		deleteTodoElement(event.target as HTMLButtonElement);
	}
}