//FUNCÇÃO ADD INGREDIENTE/PREPARAÇÃO
function addIngredient() {
	const ingredients = document.querySelector('#ingredients');
	const fieldContainer = document.querySelectorAll('.ingredient');

	// Realiza um clone do último ingrediente adicionado
	const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

	// Não adiciona um novo input se o último tem um valor vazio
	if (newField.children[0].value == '')
		return false;

	// Deixa o valor do input vazio
	newField.children[0].value = '';
	ingredients.appendChild(newField);
}

document
	.querySelector('.add-ingredient')
	.addEventListener('click', addIngredient);

function addPrepare() {
	const prepares = document.querySelector('#preparation');
	const fieldContainer2 = document.querySelectorAll('.preparation');

	// Realiza um clone do último ingrediente adicionado
	const newField2 = fieldContainer2[fieldContainer2.length - 1].cloneNode(true);

	// Não adiciona um novo input se o último tem um valor vazio
	if (newField2.children[0].value == '') return false;

	// Deixa o valor do input vazio
	newField2.children[0].value = '';
	prepares.appendChild(newField2);
}

document
	.querySelector('.add-prepare')
	.addEventListener('click', addPrepare);
