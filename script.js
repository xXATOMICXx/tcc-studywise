const cartaoIA = document.getElementById("cartao_IA");
const inicio = document.querySelectorAll(".inicio");
const conteudo = document.getElementById("conteudo");
const cartoes = document.getElementById("cartoes");
const telaGerar = document.getElementById("gerar");
const botaoGerar = document.querySelector(".botao");
const textarea = document.querySelector(".gerar_com_ia textarea");

cartaoIA.addEventListener("click", () => {
    conteudo.style.display = "none";
    cartoes.style.display = "none";
    telaGerar.style.display = "block";
});

inicio.forEach(item => {
    item.addEventListener("click", () => {
        document.body.style.backgroundColor = "#070c21";
        conteudo.style.display = "block";
        cartoes.style.display = "flex";
        telaGerar.style.display = "none";
    });
});

botaoGerar.addEventListener("click", () => {
    const texto = textarea.value.trim();

    if (texto === "") {
        alert("Digite um conteúdo primeiro para a IA gerar o material.");
        return;
    }

    let resultado = document.getElementById("resultado_ia");

    if (!resultado) {
        resultado = document.createElement("div");
        resultado.id = "resultado_ia";
        telaGerar.appendChild(resultado);
    }

    resultado.innerHTML = `
        <h2>📚 Material gerado pela IA</h2>

        <h3>✅ Resumo</h3>
        <p>O conteúdo enviado foi analisado e organizado em uma explicação mais simples, destacando as ideias principais para facilitar seus estudos.</p>

        <h3>🧠 Quiz</h3>
        <p><strong>1.</strong> Qual é o tema principal do texto?</p>
        <p><strong>2.</strong> Quais informações são mais importantes?</p>
        <p><strong>3.</strong> Como esse assunto pode aparecer em uma prova?</p>

        <h3>🃏 Flashcards</h3>
        <p><strong>Frente:</strong> Qual é a ideia central do conteúdo?</p>
        <p><strong>Verso:</strong> A ideia central é revisar e compreender os pontos principais do tema estudado.</p>

        <p class="aviso_mvp">
            MVP Mágico de Oz: nesta versão, a resposta da IA é simulada para testar a experiência do usuário antes da implementação real.
        </p>
    `;
});
