
const todoContainer = document.getElementById('todo-list-container');
const todoForm = document.getElementById('todo-form');

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
	// you could probably check this classList and see what you can change
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

function todoCreateFragment(todoObj){
	const todoFrag = document.createDocumentFragment();
	
	const todoItem = document.createElement('div');
	todoItem.classList.add('todo-item');
	todoItem.setAttribute('data-order', `${todoObj.id}-${todoObj.order}`);
	todoItem.id = `item-${todoObj.id}`;

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
	editLink.setAttribute('title', 'Edit this todo');
	editLink.innerHTML = '<i class="far fa-edit"></i>';
	todoCol2.appendChild(editLink);
	const deleteButton = document.createElement('button');
	deleteButton.setAttribute('type', 'submit');
	deleteButton.classList.add('delete-button');
	deleteButton.setAttribute('title', 'Delete this todo');
	deleteButton.setAttribute('data-url', `${todoObj.id}/delete/`);
	deleteButton.innerHTML = '<i class="far fa-trash-alt"></i>';
	todoCol2.appendChild(deleteButton);
	todoItem.appendChild(todoCol2);

	todoFrag.appendChild(todoItem);
	return todoFrag;
}

function emptyTodoListFragment(){
	const todoFrag = document.createDocumentFragment();
	const emptyList = document.createElement('div');
	emptyList.classList.add('empty-todo-list');
	emptyList.innerHTML = '<p>No Todos to Display</p>';
	todoFrag.appendChild(emptyList);
	return todoFrag;
}

// maybe change to todoeditinfo
function getTodoItemInfo(event){
	event.preventDefault();
	fetch(this.href, {
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
		}
	}).then((response) => response.json())
	  .then((data) => {
		document.getElementById('id_item').value = data.item;
		// using slice to remove the seconds(:ss) from the date(the date value won't be valid unless it is removed)
		document.getElementById('id_due_date').value = data.due_date.slice(0, -3);  
		todoForm.action = this.href;
		todoForm.scrollIntoView(true);
	  })	
	  .catch((error) => console.log(error));
}

function updatePendingTodoNumber(objValue){
	document.getElementById('total-pending').textContent = objValue;
}

function updateTodoStatus(obj, elem){
	const todoStatus = elem.querySelector('.todo-status span');
	todoStatus.className = obj.class_tag;
	todoStatus.textContent = obj.status;
	updatePendingTodoNumber(obj.total_pending);
}

function createTodoElement(responseObj){
	todoContainer.insertBefore(todoCreateFragment(responseObj), todoContainer.firstChild);
	updatePendingTodoNumber(responseObj.total_pending);
	smoothScrollIntoView(todoContainer.firstChild);
}

function updateTodoElement(responseObj){
	const todoElem = document.getElementById(`item-${responseObj.id}`);
	// todoElem.querySelector('.todo-name').firstChild.nodeValue = responseObj.item;
	todoElem.querySelector('.todo-name').textContent = responseObj.item;
	updateTodoStatus(responseObj, todoElem)
	smoothScrollIntoView(todoElem);
}

function updateCheckedTodoItem(responseObj, todoElem){
	todoElem.querySelector('.todo-name').classList.add('strike');
	todoElem.setAttribute('title', 'Uncheck this todo');
	updateTodoStatus(responseObj, todoElem);
}

function updateUncheckedTodoItem(responseObj, todoElem){
	todoElem.querySelector('.todo-name').classList.remove('strike');
	todoElem.setAttribute('title', 'Check this todo');
	updateTodoStatus(responseObj, todoElem);
}

function deleteTodoElement(){
	fetch(this.getAttribute('data-url'), {
		method: 'POST',
		headers: getDefaultRequestHeaders()
	}).then((response) => response.json())
	  .then((data) => {
			const todoElem = this.parentElement.parentElement;
		  	todoElem.style.transform = 'translateY(30%) rotateX(15deg)';
		  	todoElem.style.opacity = '0';
		  	todoElem.style.transition = 'all 0.3s ease-in';
		  	setTimeout(() => {
				todoContainer.removeChild(todoElem);
				updatePendingTodoNumber(data.total_pending);
				if (!todoContainer.children.length){
					todoContainer.appendChild(emptyTodoListFragment());
				}
			}, 380);
		})
	  .catch((err) => console.log(err));
}

function ajaxCheckboxAction(){
	const todoPk = this.getAttribute('data-pk');
	const todoElem = document.getElementById(`item-${todoPk}`);
	// this.form.action = `${todo_pk}/${this.checked ? 'check' : 'uncheck'}/`;
	fetch(`${todoPk}/${this.checked ? 'check' : 'uncheck'}/`, {
		method: this.form.method,
		headers: getDefaultRequestHeaders()
	}).then((response) => response.json())
	  .then((data) => data.action === "check" ? updateCheckedTodoItem(data, todoElem) : updateUncheckedTodoItem(data, todoElem))
	  .catch((err) => console.log(err));
}

function ajaxTodoFormSubmit(event){
	event.preventDefault();
	fetch(this.action, {
		method: this.method,
		headers: getDefaultRequestHeaders(),
		body: JSON.stringify(Object.fromEntries(new FormData(this)))
	}).then((response) => response.json())
	  .then((data) => data.action === "create" ? createTodoElement(data) : updateTodoElement(data))
	  .catch((err) => console.log(err));

	this.reset();
	this.removeAttribute('action');
}

function initialize(){
	const searchBox = document.querySelector('.search-input');
	searchBox.addEventListener('keyup', searchTodos, false);

	const checkboxes = document.querySelectorAll("input[type='checkbox']");
	checkboxes.forEach((checkbox) => checkbox.addEventListener('click', ajaxCheckboxAction, false));
	
	const searchIcon = document.querySelector('.search-icon');
	searchIcon.addEventListener('click', mobileSearchBarToggle, false);

	const moveIcon = document.querySelector('.move-icon');
	moveIcon.addEventListener('click', todoArrangementToggle, false);

	const editLinks = document.querySelectorAll('.item-col-2 a');
	editLinks.forEach((link) => link.addEventListener('click', getTodoItemInfo, false));

	todoForm.addEventListener('submit', ajaxTodoFormSubmit, false);

	const deleteButtons = document.querySelectorAll('.delete-button');
	deleteButtons.forEach((button) => button.addEventListener('click', deleteTodoElement, false));
}

window.addEventListener('load', initialize, false);