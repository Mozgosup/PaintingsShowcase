(function () {
    const IMAGE_MODAL = document.getElementById('imageModal');
    const MODAL_IMG = document.getElementById('img01');
    const MODAL_INFO = document.getElementById('modalPaintingInfo');
    let currentLanguage = mapToSupportedLanguage(getBrowserLanguage());

    // --------------------- Utility Functions ---------------------

    function fetchJSON(url) {
        return fetch(url).then(response => response.json());
    }

    function getBrowserLanguage() {
        return navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language || 'en';
    }

    function mapToSupportedLanguage(lang) {
        const supportedLanguages = ['en', 'ru'];
        return supportedLanguages.includes(lang.substr(0, 2).toLowerCase()) ? lang.substr(0, 2).toLowerCase() : 'en';
    }

    // --------------------- Content Loading Functions ---------------------

    function applyTranslations(translations) {
        const currentYear = new Date().getFullYear();
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.getAttribute('data-translate-key');
            if (translations[key]) {
                el.textContent = key === "copyrightStatement"
                    ? translations[key].replace("{year}", currentYear)
                    : translations[key];
            }
        });
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
            img.loading = "lazy";
            img.addEventListener('click', () => openModal(painting.src, painting.name[currentLanguage], painting.details));

            const figcaption = document.createElement('figcaption');
            figcaption.innerHTML = `<p class="painting-name">${painting.name[currentLanguage]}</p><p>${painting.details}</p>`;

            figure.append(img, figcaption);
            gallery.appendChild(figure);

            img.onload = () => {
                figcaption.style.width = img.offsetWidth + "px";
                img.style.opacity = "1";
            };
        });
        setupObserver();
    }

    function loadBiography(lang) {
        const biographyWrapper = document.querySelector('.image-wrapper');
        biographyWrapper.innerHTML = '';

        fetch(`assets/data/biography_${lang}.html`)
            .then(response => response.text())
            .then(data => {
                document.getElementById('biography-container').innerHTML = data;
            })
            .catch(error => console.error('Error loading biography:', error));

        fetchJSON('assets/data/biography_photos.json')
            .then(photos => {
                photos.forEach(photo => {
                    const img = document.createElement('img');
                    img.src = photo.src;
                    img.alt = photo.alt;
                    img.loading = "lazy";
                    img.className = 'biography-image';
                    img.onclick = () => openModal(photo.src);
                    biographyWrapper.appendChild(img);
                });
            })
            .catch(error => console.error('Error loading biography photos:', error));
    }

    function loadLanguage(lang) {
        fetchJSON(`assets/data/${lang}.json`)
            .then(data => {
                applyTranslations(data);
                setActiveLanguageClass(lang);
                currentLanguage = lang;
                return fetchJSON('assets/data/paintings.json');
            })
            .then(populateGallery)
            .then(() => loadBiography(lang))
            .catch(error => console.error('Error:', error));
    }

    // --------------------- Event Handlers ---------------------

    function openModal(src, name = '', details = '') {
        MODAL_IMG.src = src;
        MODAL_INFO.innerHTML = `<strong>${name}</strong><br>${details}`;
        IMAGE_MODAL.style.display = "block";
    }

    function closeModal() {
        IMAGE_MODAL.style.display = "none";
    }

    function setActiveLanguageClass(lang) {
        document.querySelectorAll('.lang-switcher a').forEach(a => {
            a.classList.toggle('active-lang', a.getAttribute('lang') === lang);
        });
    }

    function setupObserver() {
        const gallery = document.getElementById('gallery');
        let allImagesLoaded = 0;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.nextElementSibling.style.width = img.offsetWidth + "px";
                    allImagesLoaded++;
                    if (allImagesLoaded === gallery.children.length) {
                        gallery.style.visibility = "visible";
                        gallery.style.opacity = "1";
                    }
                }
            });
        });

        gallery.querySelectorAll('img').forEach(img => observer.observe(img));
    }

    function changeContent(sectionId) {
        document.querySelectorAll('.content-section').forEach(section => section.style.display = 'none');
        document.getElementById(sectionId).style.display = 'block';
        document.querySelectorAll('#menu li').forEach(item => item.classList.remove('active-menu-item'));
        document.getElementById(`menu-${sectionId}`).classList.add('active-menu-item');
    }

    // --------------------- Event Listeners ---------------------

    document.addEventListener('DOMContentLoaded', () => {
        loadLanguage(currentLanguage);

        document.querySelector('.close').addEventListener('click', closeModal);
        IMAGE_MODAL.addEventListener('click', (event) => {
            if (event.target === IMAGE_MODAL) {
                closeModal();
            }
        });
        document.getElementById('menu').addEventListener('click', (event) => {
            event.preventDefault();
            if (event.target.tagName === 'A') {
                changeContent(event.target.getAttribute('data-section'));
            }
        });
        document.querySelector('.lang-switcher').addEventListener('click', (event) => {
            event.preventDefault();
            if (event.target.tagName === 'A') {
                loadLanguage(event.target.getAttribute('lang'));
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        });
        document.addEventListener('contextmenu', (event) => {
            if (event.target.tagName === 'IMG') {
                event.preventDefault();
            }
        });
    });
})();
