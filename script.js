const cartoes = document.querySelectorAll(".cartao");

cartoes.forEach(cartao => {
    cartao.addEventListener("click", () => {
        document.body.style.backgroundColor = "#070c21";
        document.getElementById("conteudo").style.display = "none";
        document.getElementById("cartoes").style.display = "none";
    });
});

const inicio = document.querySelectorAll(".inicio")
inicio.forEach( item  => {
    item.addEventListener("click", () => {
        document.body.style.backgroundColor = "#070c21";
        document.getElementById("conteudo").style.display = "block";
        document.getElementById("cartoes").style.display = "flex";
    });
});