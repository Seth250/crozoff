
const todoContainer = document.getElementById('todo-list-container');

function submitCheckboxForm(){
	const todo_pk = this.getAttribute('data-pk');
	this.form.action = `${todo_pk}/${this.checked ? 'check' : 'uncheck'}/`;
	// checkbox.disabled = true;
	// this.form.submit();
}

const getCsrfToken = () => document.querySelector('input[name="csrfmiddlewaretoken"]').value;

function getDefaultRequestHeaders(){
	return {
		'Accept': 'application/json',
		'Content-type': 'application/json; charset=UTF-8',
		'X-Requested-With': 'XMLHttpRequest',
		'X-CSRFToken': getCsrfToken(),
	}
}

function getElementAfterCurrentDrag(yPosition){
	const draggableElements = [...document.querySelectorAll("[draggable='true']:not(.dragging)")];
	return draggableElements.reduce((closest, child) => {
		const box = child.getBoundingClientRect();
		const offset = (yPosition - box.top - box.height) / 2
		if (offset < -10 && offset > closest.defaultOffset){
			return { offset: offset, element: child }
		} else{
			return closest;
		}
	}, { defaultOffset: Number.NEGATIVE_INFINITY }).element;
}

function updateTodoPosition(event){
	event.preventDefault();
	const currentDrag = document.querySelector('.dragging');
	const afterElement = getElementAfterCurrentDrag(event.clientY);
	if (afterElement){
		this.insertBefore(currentDrag, afterElement);
	} else{
		this.appendChild(currentDrag);
	}
}

function searchTodos(event){
	const searchText = event.target.value.toLowerCase()
	const todoNames = [...document.querySelectorAll('.todo-name')];
	todoNames.forEach((name) => {
		const nameText = name.textContent.toLowerCase();
		const todoElem = name.parentElement.parentElement;
		if (nameText.indexOf(searchText) === -1){
			todoElem.classList.add('hide');
		} else{
			todoElem.classList.remove('hide');
		}
	})
}

function mobileSearchBarToggle(event){
	if (window.matchMedia("(max-width: 600px)").matches){
		event.target.classList.toggle('fa-search');
		event.target.classList.toggle('fa-arrow-left');
		document.querySelector('.page-header h1').classList.toggle('heading-collapse-mobile');
		document.querySelector('.search-form').classList.toggle('form-open-mobile');
		const searchInput = document.querySelector('.search-input');
		searchInput.classList.toggle('input-collapse-mobile');
		searchInput.focus();
	}
}

function dragStartHandler(){
	this.classList.add('dragging');
}

function dragEndHandler(){
	this.classList.remove('dragging');
	this.style.transition = 'all 0.3s ease-in';
}

function todoArrangementToggle(event){
	const todoElems = document.querySelectorAll('.todo-item');
	if (event.target.classList.contains('fas')){
		event.target.classList.remove('fas', 'fa-arrows-alt');
		event.target.classList.add('far', 'fa-save');
		event.target.setAttribute('title', 'Save Your Changes');
		todoElems.forEach((elem) => {
			elem.setAttribute('draggable', 'true');
			elem.classList.add('draggable');
			elem.addEventListener('dragstart', dragStartHandler, false);
			elem.addEventListener('dragend', dragEndHandler, false);
		})
		todoContainer.addEventListener('dragover', updateTodoPosition, false);
	} else{
		event.target.classList.remove('far', 'fa-save');
		event.target.classList.add('fas', 'fa-arrows-alt');
		event.target.setAttribute('title', 'Enable Todo re-arrangement');
		const todoOrderArr = [];
		todoElems.forEach((elem, index) => {
			const [pk, order] = elem.getAttribute('data-order').split('-');
			// ensuring the values are not the same cause it'll be both redundant and inefficient to send values that 
			// were not modified
			if (parseInt(order) !== index){
				todoOrderArr.push({pk: parseInt(pk), order: index});
			}
			elem.setAttribute('data-order', `${pk}-${index}`);
			elem.removeAttribute('draggable');
			elem.classList.remove('draggable');
			elem.removeEventListener('dragstart', dragStartHandler, false);
			elem.removeEventListener('dragend', dragEndHandler, false);
		})
		console.log(todoOrderArr);
		todoContainer.removeEventListener('dragover', updateTodoPosition, false);
		// Apparently, empty arrays evaluate to true in javascript(because they are essentially objects and objects are 
		// truthy), so I'm using .length as a workaround
		// the main purpose of this conditional is to prevent a request from being sent if no order has been modified
		if (todoOrderArr.length){
			fetch('save-order/', {
				method: 'POST',
				headers: getDefaultRequestHeaders(),
				body: JSON.stringify(todoOrderArr)
			}).catch((err) => console.log(err));
		}
	}
}

function smoothScrollIntoView(elem, yOffset=-200){
	const yPosition = elem.getBoundingClientRect().top;
	todoContainer.scrollTo({
		top: yPosition + todoContainer.scrollTop + yOffset,
		behavior: 'smooth'
	});
	window.scrollTo({
		top: yPosition + window.pageYOffset + (yOffset / 2),
		behavior: 'smooth'
	});
}

// maybe change to todoeditinfo
function getTodoItemInfo(event){
	event.preventDefault();
	fetch(this.href, {
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
		}
	})
	  .then((response) => {
		  console.log(response);
		//   response.json()
	  })
	  .catch((error) => console.log(error));
}

function todoCreateFragment(todoObj){
	const todoFrag = document.createDocumentFragment();
	
	const todoItem = document.createElement('div');
	todoItem.classList.add('todo-item');
	todoItem.setAttribute('data-order', `${todoObj.id}-${todoObj.order}`);

	const todoCol1 = document.createElement('div');
	todoCol1.classList.add('item-col-1');
	const todoName = document.createElement('div');
	todoName.classList.add('todo-name');
	todoName.appendChild(document.createTextNode(todoObj.item));
	todoCol1.appendChild(todoName);
	const todoStatus = document.createElement('div');
	todoStatus.classList.add('todo-status');
	const checkboxForm = document.createElement('form');
	const csrfInput = document.createElement('input');
	csrfInput.setAttribute('name', 'csrfmiddlewaretoken');
	csrfInput.setAttribute('type', 'hidden');
	csrfInput.setAttribute('value', getCsrfToken());
	checkboxForm.appendChild(csrfInput);
	const checkbox = document.createElement('input');
	checkbox.setAttribute('type', 'checkbox');
	checkbox.setAttribute('data-pk', todoObj.id);
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
	editLink.innerHTML = '<i class="far fa-edit"></i>';
	todoCol2.appendChild(editLink);
	const deleteForm = document.createElement('form');
	deleteForm.setAttribute('method', 'POST');
	deleteForm.setAttribute('action', `${todoObj.id}/delete/`);
	const deleteButton = document.createElement('button');
	deleteButton.setAttribute('type', 'submit');
	deleteButton.classList.add('delete-button');
	deleteButton.setAttribute('title', 'Delete this todo');
	deleteButton.innerHTML = '<i class="far fa-trash-alt"></i>';
	deleteForm.appendChild(deleteButton);
	todoCol2.appendChild(deleteForm);
	todoItem.appendChild(todoCol2);

	todoFrag.appendChild(todoItem);

	return todoFrag;
}

function createTodoElement(responseObj){
	todoContainer.insertBefore(todoCreateFragment(responseObj), todoContainer.firstChild);
	smoothScrollIntoView(todoContainer.firstChild);
}

function ajaxTodoFormSubmit(event){
	event.preventDefault();
	fetch(this.action, {
		method: this.method,
		headers: getDefaultRequestHeaders(),
		body: JSON.stringify(Object.fromEntries(new FormData(this)))
	}).then((response) => response.json())
	  .then((data) => createTodoElement(data))
	  .catch((err) => console.log(err));

	this.reset();
}

function initialize(){
	const searchBox = document.querySelector('.search-input');
	searchBox.addEventListener('keyup', searchTodos, false);

	const checkboxes = document.querySelectorAll("input[type='checkbox']");
	checkboxes.forEach((checkbox) => {
		checkbox.addEventListener('click', submitCheckboxForm, false);
	})
	
	const searchIcon = document.querySelector('.search-icon');
	searchIcon.addEventListener('click', mobileSearchBarToggle, false);

	const moveIcon = document.querySelector('.move-icon');
	moveIcon.addEventListener('click', todoArrangementToggle, false);

	const editLinks = document.querySelectorAll('.item-col-2 a');
	editLinks.forEach((link) => {
		link.addEventListener('click', getTodoItemInfo, false);
	})

	const todoForm = document.getElementById('todo-form');
	todoForm.addEventListener('submit', ajaxTodoFormSubmit, false);
}

window.addEventListener('load', initialize, false);