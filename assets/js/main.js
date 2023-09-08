function openModal(src) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('img01');
    modalImage.src = src;
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = "none";
}

function populateGallery(paintings) {
    const gallery = document.getElementById('gallery');

    paintings.forEach((painting) => {
        const figure = document.createElement('figure');
        figure.className = 'artwork';

        const img = document.createElement('img');
        img.src = painting.src;
        img.alt = painting.alt;
        img.onclick = function () {
            openModal(painting.src);
        };

        const figcaption = document.createElement('figcaption');

        const name = document.createElement('p');
        name.className = 'painting-name';
        name.innerText = painting.name;

        const details = document.createElement('p');
        details.innerText = painting.details;

        figcaption.appendChild(name);
        figcaption.appendChild(details);

        figure.appendChild(img);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);

        img.onload = function () {
            figcaption.style.width = img.offsetWidth + "px";
        }
    });
}

fetch('assets/data/paintings.json')
    .then(response => response.json())
    .then(data => populateGallery(data))
    .catch((error) => console.error('Error:', error));
