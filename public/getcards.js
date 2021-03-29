//PEGAR CARDS
const cards = document.querySelectorAll('.card');
for (let card of cards) {
	card.addEventListener('click', function () {
		const recipeID = card.getAttribute('id');
		window.location.href = `/recipes/${recipeID}`;
	});
}

/* // FUNÇÃO MOSTRAR/ESCONDER
const ShowAndHide = {
	ingredients() {
		var x = document.getElementById("ingredients");
		if(x.style.display === "none"){
			x.style.display = "block";
		} else {
			x.style.display = "none";
		}
	},
	preparation() {
		var x = document.getElementById("preparation");
		if(x.style.display === "none"){
			x.style.display = "block";
		} else {
			x.style.display = "none";
		}
	},
	information() {
		var x = document.getElementById("information");
		if(x.style.display === "none"){
			x.style.display = "block";
		} else {
			x.style.display = "none";
		}
	}
} */
