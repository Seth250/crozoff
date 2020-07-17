
function submitCheckboxForm(){
	/* checkbox is disabled after the initial click to prevent subsequent clicks until the form
	   is submiited */
	const todo_pk = this.getAttribute('data-pk');
	this.form.action = `${todo_pk}/${this.checked ? 'check' : 'uncheck'}/`;
	// checkbox.disabled = true;
	// this.form.submit();
}

function disableSaveButton(){
	let saveButton = document.getElementById('save-button');
	// save button is disabled to prevent multiple form submissions
	saveButton.disabled = true;
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

function searchTodos(event){
	const searchText = event.target.value.toLowerCase()
	const todoItems = [...document.querySelectorAll('.todo-name')];
	todoItems.forEach((item) => {
		const itemText = item.textContent.toLowerCase();
		if (itemText.indexOf(searchText) === -1){
			item.parentElement.parentElement.classList.add('hide');
		} else{
			item.parentElement.parentElement.classList.remove('hide');
		}
	})
}

function initialize(){
	const searchBox = document.querySelector('.search-input');
	searchBox.addEventListener('keyup', searchTodos, false);

	const checkboxes = document.querySelectorAll("input[type='checkbox']");
	checkboxes.forEach((checkbox) => {
		checkbox.addEventListener('click', submitCheckboxForm, false);
	})

	const draggables = document.querySelectorAll('[draggable="true"]');
	draggables.forEach((draggable) => {
		draggable.addEventListener('dragstart', function(){
			this.classList.add('dragging');
		}, false);
		draggable.addEventListener('dragend', function(){
			this.classList.remove('dragging');
			this.style.transition = 'all 0.3s ease-in';
		}, false);
	})
	const todoContainer = document.getElementById('todo-list-container');
	todoContainer.addEventListener('dragover', updateTodoPosition, false)

	const todoForm = document.getElementById('todo-form');
	todoForm.addEventListener('submit', disableSaveButton, false);
}

window.addEventListener('load', initialize, false);