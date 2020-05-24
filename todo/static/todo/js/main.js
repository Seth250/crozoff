
function submitCheckboxForm(checkbox){
	let todo_pk = checkbox.id;
	checkbox.form.action = `${todo_pk}/${checkbox.checked ? 'check' : 'uncheck'}/`;
	checkbox.form.submit();
}

function initialize(){
	elements = document.querySelectorAll("input[type='checkbox']");
	elements.forEach((checkbox) => {
		checkbox.addEventListener('click', function(){
			submitCheckboxForm(checkbox);
		}, false);
	})
}

window.addEventListener('load', initialize, false);