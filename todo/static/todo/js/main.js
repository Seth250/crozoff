
function submitCheckboxForm(checkbox){
	/* checkbox is disabled after the initial click to prevent subsequent clicks until the form
	   is submiited */
	checkbox.disabled = true;
	let todo_pk = checkbox.id;
	checkbox.form.action = `${todo_pk}/${checkbox.checked ? 'check' : 'uncheck'}/`;
	checkbox.form.submit();
}

function disableSaveButton(){
	let saveButton = document.getElementById('save-button');
	// save button is disabled to prevent multiple form submissions
	saveButton.disabled = true;
}

function initialize(){
	let elements = document.querySelectorAll("input[type='checkbox']");
	elements.forEach((checkbox) => {
		checkbox.addEventListener('click', function(){
			submitCheckboxForm(checkbox);
		}, false);
	})

	let todoForm = document.getElementById('todo-form');
	todoForm.addEventListener('submit', disableSaveButton, false);
}

window.addEventListener('load', initialize, false);