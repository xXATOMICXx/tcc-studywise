const cartaoIA = document.getElementById("cartao_IA");
const inicio = document.querySelectorAll(".inicio");
const conteudo = document.getElementById("conteudo");
const cartoes = document.getElementById("cartoes");
const telaGerar = document.getElementById("gerar");
const botaoGerar = document.querySelector(".botao");
const textarea = document.querySelector(".gerar_com_ia textarea");
const cartaoTrilhas = document.querySelector("#cartoes .cartao:first-child");
const cartaoMaterias = document.getElementById("cartao_materias");

cartaoIA.addEventListener("click", () => {
    conteudo.style.display = "none";
    cartoes.style.display = "none";
    telaGerar.style.display = "block";
    cartaoMaterias.style.display = "none";
});

cartaoTrilhas.addEventListener("click", () => {
    conteudo.style.display = "none";
    cartoes.style.display = "none";
    telaGerar.style.display = "none";
    cartaoMaterias.style.display = "flex";
    carregarProgresso();
});

inicio.forEach(item => {
    item.addEventListener("click", () => {
        document.body.style.backgroundColor = "#070c21";
        conteudo.style.display = "block";
        cartoes.style.display = "flex";
        telaGerar.style.display = "none";
        cartaoMaterias.style.display = "none";
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

function carregarProgresso() {
    fetch("http://localhost:3000/api/progresso")
        .then(res => {
            if (!res.ok) throw new Error("Erro na requisição");
            return res.json();
        })
        .then(dados => {
            console.log("Progresso carregado:", dados);
        })
        .catch(erro => console.error("Erro ao carregar progresso:", erro));
}

function atualizarProgresso(materia, porcentagem) {
    fetch("http://localhost:3000/api/progresso", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            materia: materia,
            progresso: porcentagem
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Erro ao salvar progresso");
        return res.json();
    })
    .then(dados => {
        console.log("Progresso salvo com sucesso:", dados);
    })
    .catch(erro => console.error("Erro ao atualizar progresso:", erro));
}

async function cadastrarUsuario(nome, email, senha){
    try{
        const resposta = await fetch("https://localhost:3000/api/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({nome, email, senha})
        });

        const dados = await resposta.json();

        if (!resposta.ok){
            alert(dados.erro || "Erro ao cadastrar");
            return null;
        }

        alert("Cadastrado com sucesso!");
        return dados;
    }catch(erro){
        console.error("Erro no cadastro:", erro);
        alert("Erro de conexão com o servidor");
        return null;
    }
}

async function loginUsuario(email,senha){
    try{
        const resposta = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, senha})
        });
        
        const dados = await resposta.json();

        if (!resposta.ok){
            alert(dados.erro || "Email ou senha incorretos");
            return null;
        }

        localStorage.setItem("token", dados.token);
        localStorage.setItem("usuario", JSON.stringify(dados.usuario));

        alert("Login realizado com sucesso!");
        return dados;

    }catch(erro){
        console.error("Erro no login:", erro);
        alert("Erro de conexão com o servidor");
        return null;
    }
}

function usuarioLogado(){
    const token = localStorage.getItem("token");
    return token ? true : false;
}

function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    alert("Você saiu da conta");
}
