const API_URL = 'http://localhost:3001/servico/criacao';
const TOKEN_KEY = 'token';

document.addEventListener('DOMContentLoaded', () => {
    const btnPublicar = document.getElementById('btnPublicar');
    const btnCancelar = document.getElementById('btnCancelar');

    if(btnPublicar){
        btnPublicar.addEventListener('click', publicarServico);
    }

    if(btnCancelar){
        btnCancelar.addEventListener('click', () => history.back());
    }
});

function pegarValor(id){
    const elemento = document.getElementById(id);

    if(!elemento){
        console.error(`Campo com id="${id}" não foi encontrado no HTML. Verifique se o servico.html está atualizado.`);
        return '';
    }

    return elemento.value.trim();
}

async function publicarServico(){
    // campos que existem no model Servico
    const titulo = pegarValor('inputTitulo');
    const categoria = pegarValor('inputCategoria');
    const descricao = pegarValor('inputDescricao');
    const precoTexto = pegarValor('inputPreco');
    const campoFoto = document.getElementById('foto');
    const arquivoImagem = campoFoto ? campoFoto.files[0] : null;

    // tipoCobranca, cidade, telefone e email ainda não existem no model Servico,
    // então por enquanto não são enviados pra API

    if(!titulo || !categoria || !descricao || !precoTexto){
        alert('Preencha nome do serviço, categoria, descrição e preço antes de publicar.');
        return;
    }

    const preco = parseFloat(precoTexto.replace(',', '.'));

    if(isNaN(preco) || preco < 0){
        alert('Informe um preço válido.');
        return;
    }

    const token = localStorage.getItem(TOKEN_KEY);

    if(!token){
        alert('Sessão não encontrada. Faça login novamente.');
        return;
    }

    const dadosServico = new FormData();
    dadosServico.append('titulo', titulo);
    dadosServico.append('categoria', categoria);
    dadosServico.append('descricao', descricao);
    dadosServico.append('preco', preco);

    if(arquivoImagem){
        dadosServico.append('imagem', arquivoImagem);
    }

    try{
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // não defina 'Content-Type' aqui: o navegador monta o boundary do multipart/form-data automaticamente
            },
            body: dadosServico
        });

        if(resposta.status === 401 || resposta.status === 403){
            alert('Sessão expirada. Faça login novamente.');
            return;
        }

        if(!resposta.ok){
            throw new Error(`Erro ${resposta.status} ao cadastrar serviço`);
        }
        window.location.href = 'dashboard.html';
        alert('Serviço publicado com sucesso!');
        

    }catch(erro){
        console.error('Falha ao publicar serviço:', erro);
        alert('Não foi possível publicar o serviço. Tente novamente.');
    }
}