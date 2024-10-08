if (window.location.pathname.includes('paginaPrincipal.html')) {
    let slideIndex = 0;
    showSlides();

    function showSlides() {
        let slides = document.getElementsByClassName("mySlides");

        if (slides.length === 0) {
            return; // Não há slides, saia da função
        }

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) { slideIndex = 1 }
        slides[slideIndex - 1].style.display = "block";
        setTimeout(showSlides, 4000); // Muda a imagem a cada 4 segundos
    }
}


/* Locais */
$(document).ready(function() {
    // Lista de locais e suas coordenadas (latitude e longitude)
    var locais = {
        "Brasília - Distrito Federal, Brasil": [-15.7801, -47.9292],
        "Parque Nacional de Brasília": [-15.6718013, -47.9812152],
        "Floresta Nacional de Brasília": [-15.7950, -47.9200],
        "Jardim Botânico de Brasília": [-15.8884, -47.8819],
        "Circuito Floresta Nacional de Brasília": [-15.8024, -47.9357]
    };

    // Autocomplete com redirecionamento para o mapa
    $("#search-input").autocomplete({
        source: Object.keys(locais), // Sugere os nomes dos locais
        select: function (event, ui) {
            var location = ui.item.value;
            var coordinates = locais[location]; // Pega as coordenadas do local selecionado
            // Abre uma nova aba com o mapa centrado no local
            window.open("Mapa/mapa.html?lat=" + coordinates[0] + "&lng=" + coordinates[1], "_blank");
        }
    });

    // Quando o usuário clicar no botão de pesquisa
    $("#search-btn").on("click", function () {
        var searchValue = $("#search-input").val();
        if (locais[searchValue]) {
            var coordinates = locais[searchValue]; // Pega as coordenadas
            window.open("Mapa/mapa.html?lat=" + coordinates[0] + "&lng=" + coordinates[1], "_blank");
        } else {
            alert("Local não encontrado.");
        }
    });
});