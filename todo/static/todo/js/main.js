
function submitCheckboxForm(){
	/* checkbox is disabled after the initial click to prevent subsequent clicks until the form
	   is submiited */
	const todo_pk = this.getAttribute('data-pk');
	this.form.action = `${todo_pk}/${this.checked ? 'check' : 'uncheck'}/`;
	// checkbox.disabled = true;
	// this.form.submit();
}

function getCsrfToken(){
	return document.querySelector('input[name="csrfmiddlewaretoken"]').value;
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
	const todoItems = [...document.querySelectorAll('.todo-name')];
	todoItems.forEach((item) => {
		const itemText = item.textContent.toLowerCase();
		const elem = item.parentElement.parentElement;
		if (itemText.indexOf(searchText) === -1){
			elem.classList.add('hide');
		} else{
			elem.classList.remove('hide');
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
	const todoContainer = document.getElementById('todo-list-container');
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
			const pk = parseInt(elem.getAttribute('data-order').split('-')[0]);
			todoOrderArr.push({pk, order: index}); // pk in this object, is the same thing as saying pk: pk
			elem.setAttribute('data-order', `${pk}-${index}`);
			elem.removeAttribute('draggable');
			elem.classList.remove('draggable');
			elem.removeEventListener('dragstart', dragStartHandler, false);
			elem.removeEventListener('dragend', dragEndHandler, false);
		})
		todoContainer.removeEventListener('dragover', updateTodoPosition, false);
		fetch('save-order/', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'X-CSRFToken': getCsrfToken(),
			},
			body: JSON.stringify(todoOrderArr)
		}).catch((err) => console.log(err));
	}
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

	// const todoForm = document.getElementById('todo-form');
	// todoForm.addEventListener('submit', disableSaveButton, false);
}

window.addEventListener('load', initialize, false);