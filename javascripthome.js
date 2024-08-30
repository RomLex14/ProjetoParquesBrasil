let slideIndex = 0;
showSlides();

function showSlides() {
    let slides = document.getElementsByClassName("mySlides");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 4000); // Muda a imagem a cada 4 segundos
}

/* Locais */
document.querySelectorAll('.favorite-icon').forEach(function(icon) {
icon.addEventListener('click', function() {
icon.classList.toggle('active');
});
});


