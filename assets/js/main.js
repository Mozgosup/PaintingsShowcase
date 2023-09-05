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
