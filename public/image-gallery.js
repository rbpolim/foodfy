const ImageGallery = {
	highlight: document.querySelector('.highlight > img'),
	previews: document.querySelectorAll('.previews img'),
	setImage(e) {
		const { target } = e;

		ImageGallery.previews.forEach(preview =>
			preview.classList.remove('active')
		);

		target.classList.add('active');

		ImageGallery.highlight.src = target.src;
	},
};
