function setActiveLanguageClass(lang) {
    document.querySelectorAll('.lang-switcher a').forEach(a => {
        a.classList.remove('active-lang');
        if (a.getAttribute('lang') === lang) {
            a.classList.add('active-lang');
        }
    });
}

function openModal(src, name, details) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('img01');
    const modalPaintingInfo = document.getElementById('modalPaintingInfo');

    modalImage.src = src;
    modalPaintingInfo.innerHTML = `<strong>${name}</strong><br>${details}`;

    modalImage.addEventListener('click', event => event.stopPropagation());
    modal.addEventListener('click', event => {
        if (event.target === modal) {
            closeModal();
        }
    });

    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = "none";
}

function populateGallery(paintings) {

    const gallery = document.getElementById('gallery');

    gallery.innerHTML = '';

    paintings.forEach((painting) => {
        const figure = document.createElement('figure');
        figure.className = 'artwork';

        const img = document.createElement('img');
        img.src = painting.src;
        img.alt = painting.alt;
        img.onclick = function () {
            openModal(painting.src, painting.name[currentLanguage], painting.details);
        };

        const figcaption = document.createElement('figcaption');

        const name = document.createElement('p');
        name.className = 'painting-name';
        name.innerText = painting.name[currentLanguage];

        const details = document.createElement('p');
        details.innerText = painting.details;

        figcaption.appendChild(name);
        figcaption.appendChild(details);

        figure.appendChild(img);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);

        img.onload = function () {
            figcaption.style.width = img.offsetWidth + "px";
            this.style.opacity = "1";
        }
    });
}

function setupObserver() {
    let allImagesLoaded = 0;
    const totalImages = document.querySelectorAll('#gallery img').length;

    let observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let img = entry.target;
                let figcaption = img.nextElementSibling;
                figcaption.style.width = img.offsetWidth + "px";

                allImagesLoaded++;

                if (allImagesLoaded === totalImages) {
                    const gallery = document.getElementById('gallery');
                    gallery.style.visibility = "visible";
                    gallery.style.opacity = "1";
                }
            }
        });
    });

    document.querySelectorAll('#gallery img').forEach(img => {
        observer.observe(img);
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

document.addEventListener('contextmenu', function (event) {
    if (event.target.tagName === 'IMG') {
        event.preventDefault();
    }
});

fetch('assets/data/paintings.json')
    .then(response => response.json())
    .then(data => {
        populateGallery(data)
        setupObserver();
    })
    .catch((error) => console.error('Error:', error));

let currentLanguage = 'en';

function applyTranslations(translations) {
    const translatableElements = document.querySelectorAll('[data-translate-key]');
    const currentYear = new Date().getFullYear();

    translatableElements.forEach(el => {
        const key = el.getAttribute('data-translate-key');
        if (translations[key]) {
            if (key === "copyrightStatement") {
                el.textContent = translations[key].replace("{year}", currentYear);
            } else {
                el.textContent = translations[key];
            }
        }
    });
}


function loadLanguage(lang) {
    fetch(`assets/data/${lang}.json`)
        .then(response => response.json())
        .then(data => {
            currentLanguage = lang;
            applyTranslations(data);
            setActiveLanguageClass(lang);
        })
        .catch(error => console.error('Error loading language:', error));
}

function switchLanguage(lang) {
    fetch(`assets/data/${lang}.json`)
        .then(response => response.json())
        .then(data => {
            currentLanguage = lang;
            applyTranslations(data);
            setActiveLanguageClass(lang);
            return fetch('assets/data/paintings.json');
        })
        .then(response => response.json())
        .then(data => {
            populateGallery(data);
            setupObserver();
        })
        .catch((error) => console.error('Error:', error));
}

loadLanguage(currentLanguage);
