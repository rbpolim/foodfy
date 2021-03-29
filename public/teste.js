//UPLOAD DAS FOTOS
/* eslint-disable no-unused-vars */
const PhotosUpload = {
	input: '',
	preview: document.querySelector('#photos-preview'),
	uploadLimit: 1,
	files: [],
	handleFileChefInput(event) {
		const { files: fileList } = event.target;
		PhotoChefUpload.input = event.target;

		if (PhotoChefUpload.hasLimit(event)) {
			PhotoChefUpload.updateInputFiles();
			return;
		}

		Array.from(fileList).forEach(file => {
			PhotoChefUpload.files.push(file);

			const reader = new FileReader();

			reader.onload = () => {
				const image = new Image();
				image.src = String(reader.result);

				const container = PhotoChefUpload.getContainer(image);
				PhotoChefUpload.preview.appendChild(container);
			};

			reader.readAsDataURL(file);
		});

		PhotoChefUpload.updateInputFiles();
	},
	hasLimit(event) {
		const { uploadLimit, input, preview } = PhotoChefUpload;
		const { files: fileList } = input;

		if (fileList.length > uploadLimit) {
			alert(`Você pode enviar até ${uploadLimit} fotos.`);
			event.preventDefault();
			return true;
		}

		const photosDiv = [];
		preview.childNodes.forEach(item => {
			if (item.classList && item.classList.value == 'photo') {
				photosDiv.push(item);
			}
		});
		const totalPhotos = fileList.length + photosDiv.length;
		if (totalPhotos > uploadLimit) {
			alert('Você atingiu o limite máximo de fotos.');
			event.preventDefault();
			return true;
		}

		return false;
	},
	getAllFiles() {
		const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();

		PhotoChefUpload.files.forEach(file => dataTransfer.items.add(file));

		return dataTransfer.files;
	},
	getContainer(image) {
		const container = document.createElement('div');
		container.classList.add('photo');

		container.onclick = PhotoChefUpload.removePhoto;

		container.appendChild(image);

		container.appendChild(PhotoChefUpload.getRemoveButton());

		return container;
	},
	getRemoveButton() {
		const button = document.createElement('i');
		button.classList.add('material-icons');
		button.innerHTML = 'close';

		return button;
	},
	removePhoto(event) {
		const photoDiv = event.target.parentNode;
		const newFiles = Array.from(PhotoChefUpload.preview.children).filter(function (file) {
			if (file.classList.contains('photo') && !file.getAttribute('id')) {
				return true;
			}
		});
		const index = newFiles.indexOf(photoDiv);
		PhotoChefUpload.files.splice(index, 1);

		PhotoChefUpload.updateInputFiles();

		photoDiv.remove();
	},
	removedOldPhoto(event) {
		const photoDiv = event.target.parentNode;

		if (photoDiv.id) {
			const removedFiles = document.querySelector('input[name="removed_files"]');
			if (removedFiles) {
				removedFiles.value += `${photoDiv.id},`;
			}
		}

		photoDiv.remove();
	},
	updateInputFiles() {
		PhotoChefUpload.input.files = PhotoChefUpload.getAllFiles();
	}
};
