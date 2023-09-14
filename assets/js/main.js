function openModal(src, name, details) {

    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('img01');
    const modalPaintingInfo = document.getElementById('modalPaintingInfo');
    modalImage.src = src;
    modalPaintingInfo.innerHTML = `<strong>${name}</strong><br>${details}`;

    modalImage.onclick = function (event) {
        event.stopPropagation();
    }

    modal.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    }

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
            openModal(painting.src, painting.name, painting.details);
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

function changeContent(sectionId) {

    const sections = document.querySelectorAll('.content-section');

    sections.forEach(section => {
        section.style.display = 'none';
    });

    document.getElementById(sectionId).style.display = 'block';

    document.querySelectorAll('#menu li').forEach(item => {
        item.classList.remove('active-menu-item');
    });

    document.getElementById(`menu-${sectionId}`).classList.add('active-menu-item');
}

fetch('assets/data/paintings.json')
    .then(response => response.json())
    .then(data => populateGallery(data))
    .catch((error) => console.error('Error:', error));
