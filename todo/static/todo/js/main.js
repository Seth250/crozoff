
function submitCheckboxForm(event){
	/* checkbox is disabled after the initial click to prevent subsequent clicks until the form
	   is submiited */
	const checkboxElem = event.target;
	const todo_pk = checkboxElem.id;
	checkboxElem.form.action = `${todo_pk}/${checkboxElem.checked ? 'check' : 'uncheck'}/`;
	// checkbox.disabled = true;
	checkboxElem.form.submit();
}

function disableSaveButton(){
	let saveButton = document.getElementById('save-button');
	// save button is disabled to prevent multiple form submissions
	saveButton.disabled = true;
}

function searchTodos(event){
	const searchText = event.target.value.toLowerCase()
	const todoItems = [...document.querySelectorAll('.todo-name')];
	todoItems.forEach((item) => {
		const itemText = item.textContent.toLowerCase();
		if (itemText.indexOf(searchText) === -1){
			item.parentElement.parentElement.classList.add('hide');
		}else{
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

	const todoForm = document.getElementById('todo-form');
	todoForm.addEventListener('submit', disableSaveButton, false);
}

window.addEventListener('load', initialize, false);