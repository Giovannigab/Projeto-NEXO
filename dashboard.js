const API_URL = 'http://localhost:3001/prestador/me';
const TOKEN_KEY = 'token'; // ajuste aqui se a chave usada no login for diferente

document.addEventListener('DOMContentLoaded', () => {
    carregarPerfil();
    configurarBotoes();
});

async function carregarPerfil(){
    const token = localStorage.getItem(TOKEN_KEY);

    if(!token){
        mostrarErro('Você precisa estar logado para ver este perfil.');
        return;
    }

    try{
        const resposta = await fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if(resposta.status === 401 || resposta.status === 403){
            localStorage.removeItem(TOKEN_KEY);
            mostrarErro('Sessão expirada. Faça login novamente.');
            return;
        }

        if(!resposta.ok){
            throw new Error(`Erro ${resposta.status} ao buscar dados do prestador`);
        }

        const prestador = await resposta.json();
        preencherPerfil(prestador);

    }catch(erro){
        console.error('Falha ao carregar perfil do prestador:', erro);
        mostrarErro('Não foi possível carregar os dados do prestador. Verifique se a API está rodando na porta 3001.');
    }
}

function preencherPerfil(prestador){
    document.getElementById('nomePrestador').textContent = prestador.user.nome;
    document.getElementById('emailPrestador').textContent = prestador.user.email;
    document.getElementById('membroDesde').textContent = `📅 Membro desde ${formatarAno(prestador.createdAt)}`;

    document.getElementById('qtdServicos').textContent = prestador.servicos.length;
    document.getElementById('precoHora').textContent = formatarMoeda(prestador.precoHora);
    document.getElementById('experienciaPrestador').textContent = `${prestador.experiencia} anos`;

    document.getElementById('descricaoPrestador').textContent = prestador.descricao;

    renderizarServicos(prestador.servicos);
}

function renderizarServicos(servicos){
    const lista = document.getElementById('listaServicos');
    lista.innerHTML = '';

    if(!servicos || servicos.length === 0){
        lista.innerHTML = '<p class="servicos-vazio">Nenhum serviço cadastrado ainda.</p>';
        return;
    }

    servicos.forEach(servico => {
        const item = document.createElement('div');
        item.className = 'servico-item';

        item.innerHTML = `
            <img src="${servico.imagem || 'imagens/servico-placeholder.png'}" class="servico-imagem" alt="${servico.titulo}">
            <div class="servico-info">
                <h3 class="servico-titulo">${servico.titulo}</h3>
                <p class="servico-categoria">${servico.categoria ?? 'Geral'}</p>
                <span class="servico-preco">${formatarMoeda(servico.preco)}</span>
            </div>
        `;

        lista.appendChild(item);
    });
}

function formatarMoeda(valor){
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function formatarAno(dataISO){
    return new Date(dataISO).getFullYear();
}

function configurarBotoes(){
    const btnCadastrar = document.getElementById('btnCadastrarServico');

    if(btnCadastrar){
        btnCadastrar.addEventListener('click', () => {
            window.location.href = 'servico.html';
        });
    }
}

function mostrarErro(mensagem){
    const card = document.querySelector('.perfil-card');

    if(card){
        card.insertAdjacentHTML(
            'beforeend',
            `<p style="color:#c0392b; margin-top:10px;">${mensagem}</p>`
        );
    }
}