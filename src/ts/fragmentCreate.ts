import { TodoCreateUpdate } from './interfaces';
import { csrfToken } from './DOMVars';

export function emptyTodoListFragment(): DocumentFragment {
	const todoFrag = document.createDocumentFragment();
	const emptyList = document.createElement('div');
	emptyList.classList.add('empty-todo-list');
	emptyList.innerHTML = '<p>No Todos to Display</p>';
	todoFrag.appendChild(emptyList);
	return todoFrag;
}

export function todoCreateFragment(todoObj: TodoCreateUpdate): DocumentFragment {
	const todoFrag = document.createDocumentFragment();
	
	const todoItem = document.createElement('div');
	todoItem.classList.add('todo-item');
	todoItem.setAttribute('data-order', `${todoObj.id}-${todoObj.order}`);
	todoItem.setAttribute('data-item', `item-${todoObj.id}`);

	const todoCol1 = document.createElement('div');
	todoCol1.classList.add('item-col-1');
	const todoName = document.createElement('div');
	todoName.classList.add('todo-name');
	todoName.appendChild(document.createTextNode(todoObj.item));
	todoCol1.appendChild(todoName);
	const todoStatus = document.createElement('div');
	todoStatus.classList.add('todo-status');
	const checkboxForm = document.createElement('form');
	checkboxForm.setAttribute('method', 'POST');
	const csrfInput = document.createElement('input');
	csrfInput.setAttribute('name', 'csrfmiddlewaretoken');
	csrfInput.setAttribute('type', 'hidden');
	csrfInput.setAttribute('value', csrfToken);
	checkboxForm.appendChild(csrfInput);
	const checkbox = document.createElement('input');
	checkbox.setAttribute('type', 'checkbox');
	checkbox.setAttribute('data-pk', todoObj.id.toString());
	checkbox.setAttribute('title', 'Check this todo');
	checkboxForm.appendChild(checkbox);
	todoStatus.appendChild(checkboxForm);
	const dueInfo = document.createElement('span');
	dueInfo.classList.add(todoObj.class_tag);
	dueInfo.appendChild(document.createTextNode(todoObj.status));
	todoStatus.appendChild(dueInfo);
	todoCol1.appendChild(todoStatus);
	todoItem.appendChild(todoCol1);

	const todoCol2 = document.createElement('div');
	todoCol2.classList.add('item-col-2');
	const editLink = document.createElement('a');
	editLink.setAttribute('href', `${todoObj.id}/edit/`);
	editLink.classList.add('edit-link');
	editLink.setAttribute('title', 'Edit this todo');
	editLink.innerHTML = '<i class="far fa-edit"></i>';
	todoCol2.appendChild(editLink);
	const deleteButton = document.createElement('button');
	deleteButton.setAttribute('type', 'button');
	deleteButton.classList.add('delete-button');
	deleteButton.setAttribute('title', 'Delete this todo');
	deleteButton.setAttribute('data-url', `${todoObj.id}/delete/`);
	deleteButton.innerHTML = '<i class="far fa-trash-alt"></i>';
	todoCol2.appendChild(deleteButton);	
	todoItem.appendChild(todoCol2);

	todoFrag.appendChild(todoItem);
	return todoFrag;
}