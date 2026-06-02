const gerar = document.getElementById("cartao_IA");

gerar.addEventListener("click", () => {
    document.getElementById("conteudo").style.display = "none";
    document.getElementById("cartoes").style.display = "none";
    document.getElementById("gerar").style.display = "block";
});

const inicio = document.querySelectorAll(".inicio")
inicio.forEach( item  => {
    item.addEventListener("click", () => {
        document.body.style.backgroundColor = "#070c21";
        document.getElementById("conteudo").style.display = "block";
        document.getElementById("cartoes").style.display = "flex";
        document.getElementById("gerar").style.display = "none";
    });
});
