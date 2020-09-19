
const todoContainer = document.getElementById('todo-list-container');
const messageBox = document.querySelector('.message');
const todoForm = document.getElementById('todo-form');
const totalPendingElem = document.getElementById('total-pending');
const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

function getDefaultRequestHeaders(){
	return {
		'Accept': 'application/json',
		'Content-type': 'application/json; charset=UTF-8',
		'X-Requested-With': 'XMLHttpRequest',
		'X-CSRFToken': csrfToken
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
	// const todoNames = [...document.querySelectorAll('.todo-name')];
	const todoNames = document.querySelectorAll('.todo-name');
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
		document.querySelector('.page-header h1').classList.toggle('collapse-mobile');
		document.querySelector('.search-input').focus();
	}
}

function displayMessage(message, tag){
	messageBox.classList.remove('hide');
	messageBox.classList.add(`message-${tag}`, 'fade');
	messageBox.textContent = message;
	// we're waiting 3.55s in the setTimeout because the fade animation takes 3.5s(with the initial delay)
	setTimeout(() => {
		messageBox.classList.add('hide')
		messageBox.classList.remove(`message-${tag}`, 'fade');
	}, 3550);
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
		todoContainer.removeEventListener('dragover', updateTodoPosition, false);
		// Apparently, empty arrays evaluate to true in javascript(because they are essentially objects and objects are 
		// truthy), so I'm using .length as a workaround
		// the main purpose of this conditional is to prevent a request from being sent if no order has been modified
		if (todoOrderArr.length){
			fetch('save-order/', {
				method: 'POST',
				headers: getDefaultRequestHeaders(),
				body: JSON.stringify(todoOrderArr)
			}).then((response) => response.ok ? response.json() : Promise.reject(response))
			  .then(({message, message_tag}) => displayMessage(message, message_tag))
			  .catch((err) => errorHandler(err));
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
	checkboxForm.setAttribute('method', 'POST');
	const csrfInput = document.createElement('input');
	csrfInput.setAttribute('name', 'csrfmiddlewaretoken');
	csrfInput.setAttribute('type', 'hidden');
	csrfInput.setAttribute('value', csrfToken);
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

function emptyTodoListFragment(){
	const todoFrag = document.createDocumentFragment();
	const emptyList = document.createElement('div');
	emptyList.classList.add('empty-todo-list');
	emptyList.innerHTML = '<p>No Todos to Display</p>';
	todoFrag.appendChild(emptyList);
	return todoFrag;
}

function getTodoItemEditInfo(editLink){
	fetch(editLink.href, {
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
		}
	}).then((response) => response.ok ? response.json() : Promise.reject(response))
	  .then(({ item, due_date }) => {
		document.getElementById('id_item').value = item;
		// using slice to remove the seconds(:ss) from the date(the date value won't be valid unless it is removed)
		document.getElementById('id_due_date').value = due_date.slice(0, -3);  
		todoForm.action = editLink.href;
		todoForm.scrollIntoView(true);
	  })	
	  .catch((err) => errorHandler(err));
}

async function errorHandler(error){
	if (error.status){
		const { message, message_tag } = await error.json();
		displayMessage(message, message_tag);
	} else {
		console.error(error);
		displayMessage('An Unexpected Error Occurred', 'error');
	}
}

function updatePendingTodoNumber(objValue){
	totalPendingElem.textContent = objValue;
}

function updateTodoStatus(obj, elem){
	const todoStatus = elem.querySelector('.todo-status span');
	todoStatus.className = obj.class_tag;
	todoStatus.textContent = obj.status;
	updatePendingTodoNumber(obj.total_pending);
}

function createTodoElement(responseObj){
	if (todoContainer.querySelector('.empty-todo-list')) {
		todoContainer.replaceChild(todoCreateFragment(responseObj), todoContainer.firstElementChild);
	} else {
		todoContainer.insertBefore(todoCreateFragment(responseObj), todoContainer.firstChild);
	}
	updatePendingTodoNumber(responseObj.total_pending);
	displayMessage(responseObj.message, responseObj.message_tag);
	smoothScrollIntoView(todoContainer.firstElementChild);
}

function updateTodoElement(responseObj){
	const todoElem = document.getElementById(`item-${responseObj.id}`);
	// todoElem.querySelector('.todo-name').firstChild.nodeValue = responseObj.item;
	todoElem.querySelector('.todo-name').textContent = responseObj.item;
	updateTodoStatus(responseObj, todoElem)
	displayMessage(responseObj.message, responseObj.message_tag);
	smoothScrollIntoView(todoElem);
}

function updateTodoItemDetails(responseObj, todoElem){
	todoElem.querySelector('.todo-name').classList.toggle('strike');
	updateTodoStatus(responseObj, todoElem);
	displayMessage(responseObj.message, responseObj.message_tag);
}

function deleteTodoElement(deleteBtn){
	fetch(deleteBtn.getAttribute('data-url'), {
		method: 'POST',
		headers: getDefaultRequestHeaders()
	}).then((response) => response.ok ? response.json() : Promise.reject(response))
	  .then((data) => {
			const todoElem = deleteBtn.parentElement.parentElement;
		  	todoElem.style.transform = 'translateY(30%) rotateX(15deg)';
		  	todoElem.style.opacity = '0';
		  	todoElem.style.transition = 'all 0.3s ease-in';
		  	setTimeout(() => {
				todoContainer.removeChild(todoElem);
				updatePendingTodoNumber(data.total_pending);
				if (!todoContainer.children.length){
					todoContainer.appendChild(emptyTodoListFragment());
				}
			}, 350);
			displayMessage(data.message, data.message_tag);
		})
	  .catch((err) => errorHandler(err));
}

function ajaxCheckboxAction(checkboxElem){
	const todoPk = checkboxElem.getAttribute('data-pk');
	const todoElem = document.getElementById(`item-${todoPk}`);
	fetch(`${todoPk}/${checkboxElem.checked ? 'check' : 'uncheck'}/`, {
		method: checkboxElem.form.method,
		headers: getDefaultRequestHeaders()
	}).then((response) => response.ok ? response.json() : Promise.reject(response))
	  .then((data) => updateTodoItemDetails(data, todoElem))
	  .catch((err) => errorHandler(err));

	checkboxElem.setAttribute('title', `${checkboxElem.checked ? 'Uncheck' : 'Check'} this todo`);
}

function ajaxTodoFormSubmit(event){
	event.preventDefault();
	fetch(this.action, {
		method: this.method,
		headers: getDefaultRequestHeaders(),
		body: JSON.stringify(Object.fromEntries(new FormData(this)))
	}).then((response) => response.ok ? response.json() : Promise.reject(response))
	  .then((data) => data.action === "create" ? createTodoElement(data) : updateTodoElement(data))
	  .catch((err) => errorHandler(err));

	this.reset();
	this.removeAttribute('action');
}

function delegateClickEvent(event){
	if (event.target.matches('input[type="checkbox"]')){
		ajaxCheckboxAction(event.target);
	// the reason why event.target matches the edit link and not the edit icon (even though you may be clicking the icon) 
	// is because you set pointer events on the edit icon to None, you also used this same approach for the delete icon
	} else if (event.target.matches('.edit-link')){
		event.preventDefault(); // prevents the page from redirecting
		getTodoItemEditInfo(event.target);
	} else if (event.target.matches('.delete-button')){
		deleteTodoElement(event.target);
	}
}

function initialize(){
	const searchBox = document.querySelector('.search-input');
	searchBox.addEventListener('keyup', searchTodos, false);
	
	const searchIcon = document.querySelector('.search-icon');
	searchIcon.addEventListener('click', mobileSearchBarToggle, false);

	const detailBar = document.querySelector('.detail-bar');
	const detailBarNav = document.querySelector('.detail-bar__nav');
	detailBar.addEventListener('click', () => detailBarNav.classList.toggle('hide'), false);

	const moveIcon = document.querySelector('.move-icon');
	moveIcon.addEventListener('click', todoArrangementToggle, false);

	todoContainer.addEventListener('click', delegateClickEvent, false);

	todoForm.addEventListener('submit', ajaxTodoFormSubmit, false);
}

window.addEventListener('load', initialize, false);
