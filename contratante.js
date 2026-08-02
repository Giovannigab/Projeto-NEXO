// ============================================================
// DADOS SIMULADOS
// ============================================================

const prestadores = [
    { iniciais: 'MA', nome: 'Marcos Almeida', cat: 'Elétrica', avaliacao: 4.9, servicos: 47, distancia: '4,2 km', tempo: '12 min', disponivel: true },
    { iniciais: 'CF', nome: 'Carlos Ferreira', cat: 'Elétrica', avaliacao: 4.7, servicos: 31, distancia: '6,8 km', tempo: '18 min', disponivel: true },
    { iniciais: 'RL', nome: 'Roberto Lima',   cat: 'Elétrica', avaliacao: 5.0, servicos: 12, distancia: '9,1 km', tempo: '25 min', disponivel: false },
    { iniciais: 'PO', nome: 'Pedro Oliveira', cat: 'Pintura',  avaliacao: 4.8, servicos: 25, distancia: '3,5 km', tempo: '9 min',  disponivel: true },
    { iniciais: 'JS', nome: 'Juliana Santos', cat: 'Limpeza',  avaliacao: 4.6, servicos: 60, distancia: '5,0 km', tempo: '14 min', disponivel: true },
    { iniciais: 'RN', nome: 'Rafael Nunes',   cat: 'Hidráulica', avaliacao: 4.9, servicos: 38, distancia: '7,2 km', tempo: '20 min', disponivel: true },
];

const solicitacoes = [
    { titulo: 'Instalação elétrica', prestador: 'Marcos Almeida', data: '19/06/2026', status: 'aceito' },
    { titulo: 'Reparo hidráulico',   prestador: 'Carlos Ferreira', data: '18/06/2026', status: 'pendente' },
    { titulo: 'Pintura de sala',      prestador: 'Pedro Oliveira', data: '10/06/2026', status: 'concluido' },
];

const conversas = [
    {
        id: 1,
        iniciais: 'MA',
        nome: 'Marcos Almeida',
        preview: 'Posso ir amanhã às 9h, funciona?',
        status: 'aceito',
        msgs: [
            { de: 'deles', texto: 'Olá! Vi sua solicitação de instalação elétrica.', hora: '14:10' },
            { de: 'minha', texto: 'Oi Marcos, preciso instalar 3 tomadas novas.', hora: '14:15' },
            { de: 'deles', texto: 'Sem problema! O valor fica em torno de R$ 180. Posso ir amanhã às 9h, funciona?', hora: '14:20' },
        ]
    },
    {
        id: 2,
        iniciais: 'CF',
        nome: 'Carlos Ferreira',
        preview: 'Você: Qual o prazo para atendimento?',
        status: 'pendente',
        msgs: [
            { de: 'minha', texto: 'Boa tarde Carlos, solicitei um reparo hidráulico.', hora: '10:00' },
            { de: 'minha', texto: 'Qual o prazo para atendimento?', hora: '10:01' },
        ]
    },
];

// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    carregarNome();
    renderizarPrestadores(prestadores);
    renderizarSolicitacoes(solicitacoes);
    renderizarConversas(conversas);
});

function carregarNome() {
    const nome = sessionStorage.getItem('nexo_nome') || 'João Silva';
    const email = sessionStorage.getItem('nexo_email') || 'joao@email.com';
    const primeiroNome = nome.split(' ')[0];
    const inicial = primeiroNome[0].toUpperCase();

    const hora = new Date().getHours();
    const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

    const elSaudacao = document.getElementById('saudacao');
    if (elSaudacao) elSaudacao.textContent = `${saudacao}, ${primeiroNome}!`;

    document.querySelectorAll('#avatar-inicial, #perfil-avatar').forEach(el => el.textContent = inicial);
    const elPerfilNome = document.getElementById('perfil-nome');
    if (elPerfilNome) elPerfilNome.textContent = nome;
    const elPerfilEmail = document.getElementById('perfil-email');
    if (elPerfilEmail) elPerfilEmail.textContent = email;
    const elCampoNome = document.getElementById('campo-nome');
    if (elCampoNome) elCampoNome.value = nome;
    const elCampoEmail = document.getElementById('campo-email');
    if (elCampoEmail) elCampoEmail.value = email;
}

// ============================================================
// NAVEGAÇÃO ENTRE SEÇÕES
// ============================================================

function mostrarSecao(id, elNav) {
    document.querySelectorAll('.secao').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const secao = document.getElementById('sec-' + id);
    if (secao) secao.classList.add('active');
    if (elNav) elNav.classList.add('active');

    const titulos = {
        inicio: 'Início',
        buscar: 'Buscar prestadores',
        solicitacoes: 'Minhas solicitações',
        mensagens: 'Mensagens',
        perfil: 'Meu perfil'
    };
    const topbarTitulo = document.getElementById('topbar-titulo');
    if (topbarTitulo) topbarTitulo.textContent = titulos[id] || 'Nexo';

    // Fechar sidebar mobile
    document.querySelector('.sidebar').classList.remove('aberta');
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('aberta');
}

// ============================================================
// CATEGORIA CLICÁVEL (vai para busca com filtro pré-aplicado)
// ============================================================

function selecionarCategoria(cat) {
    document.getElementById('filtro-categoria').value = cat;
    filtrarPrestadores();
    mostrarSecao('buscar', document.querySelector('[data-section="buscar"]'));
}

// ============================================================
// RENDERIZAR PRESTADORES
// ============================================================

function renderizarPrestadores(lista) {
    const grid = document.getElementById('prestadores-grid');
    if (!grid) return;

    if (lista.length === 0) {
        grid.innerHTML = '<p style="color:#aaa;font-size:14px;grid-column:1/-1;">Nenhum prestador encontrado para esta busca.</p>';
        return;
    }

    grid.innerHTML = lista.map((p, i) => `
        <div class="prestador-card">
            <div class="prestador-topo">
                <div class="prestador-avatar">${p.iniciais}</div>
                <div style="flex:1;">
                    <div class="prestador-nome">${p.nome}</div>
                    <div class="prestador-cat">${p.cat}</div>
                </div>
                <span class="status-tag ${p.disponivel ? 'aceito' : 'pendente'}">${p.disponivel ? 'Disponível' : 'Ocupado'}</span>
            </div>
            <div class="prestador-meta">
                <span class="estrelas">★</span>
                <span class="meta-tag">${p.avaliacao} · ${p.servicos} serviços</span>
                <span class="meta-tag">🚗 ${p.tempo} · ${p.distancia}</span>
            </div>
            <div class="prestador-acoes">
                <button class="btn-ver-perfil">Ver perfil</button>
                <button class="button-acesso" style="flex:2;" onclick="abrirModalSolicitar(${i})">Solicitar serviço</button>
            </div>
        </div>
    `).join('');
}

function filtrarPrestadores() {
    const busca = (document.getElementById('input-busca').value || '').toLowerCase();
    const cat = document.getElementById('filtro-categoria').value;

    const filtrados = prestadores.filter(p => {
        const matchBusca = !busca || p.nome.toLowerCase().includes(busca) || p.cat.toLowerCase().includes(busca);
        const matchCat = !cat || p.cat === cat;
        return matchBusca && matchCat;
    });

    const el = document.getElementById('resultado-busca');
    if (el) el.textContent = `${filtrados.length} prestador(es) encontrado(s)`;
    renderizarPrestadores(filtrados);
}

// ============================================================
// RENDERIZAR SOLICITAÇÕES
// ============================================================

function renderizarSolicitacoes(lista) {
    const el = document.getElementById('solicitacoes-lista');
    if (!el) return;

    el.innerHTML = lista.map(s => `
        <div class="solic-card" data-status="${s.status}">
            <div class="atividade-avatar ${s.status === 'aceito' ? 'azul' : s.status === 'concluido' ? 'verde' : 'cinza'}">
                ${s.prestador.split(' ').map(n => n[0]).join('').slice(0,2)}
            </div>
            <div class="solic-info">
                <div class="solic-titulo">${s.titulo}</div>
                <div class="solic-detalhe">Prestador: ${s.prestador} · Data: ${s.data}</div>
            </div>
            <span class="status-tag ${s.status}">${{ aceito: 'Aceito', pendente: 'Aguardando', concluido: 'Concluído' }[s.status]}</span>
        </div>
    `).join('');
}

function filtrarStatus(status, btn) {
    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');

    document.querySelectorAll('.solic-card').forEach(card => {
        card.style.display = (status === 'todos' || card.dataset.status === status) ? 'flex' : 'none';
    });
}

// ============================================================
// RENDERIZAR CONVERSAS / CHAT
// ============================================================

function renderizarConversas(lista) {
    const el = document.getElementById('chat-lista');
    if (!el) return;

    el.innerHTML = lista.map(c => `
        <div class="chat-item" onclick="abrirConversa(${c.id})">
            <div class="atividade-avatar azul">${c.iniciais}</div>
            <div class="chat-item-info">
                <div class="chat-item-nome">${c.nome}</div>
                <div class="chat-item-preview">${c.preview}</div>
            </div>
            <span class="status-tag ${c.status}" style="font-size:11px;">${{ aceito: 'Aceito', pendente: 'Aguardando', concluido: 'Concluído' }[c.status]}</span>
        </div>
    `).join('');
}

function abrirConversa(id) {
    const conversa = conversas.find(c => c.id === id);
    if (!conversa) return;

    document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('ativo'));
    const items = document.querySelectorAll('.chat-item');
    const idx = conversas.findIndex(c => c.id === id);
    if (items[idx]) items[idx].classList.add('ativo');

    const janela = document.getElementById('chat-janela');
    janela.innerHTML = `
        <div class="chat-header-janela">
            <div class="atividade-avatar azul">${conversa.iniciais}</div>
            <div>
                <strong style="font-size:14px;color:#1a2d47;">${conversa.nome}</strong>
                <p style="font-size:12px;color:#7a8a9a;margin:1px 0 0;">Online</p>
            </div>
        </div>
        <div class="chat-mensagens" id="chat-msgs">
            ${conversa.msgs.map(m => `
                <div class="msg-balao ${m.de === 'minha' ? 'msg-minha' : 'msg-deles'}">${m.texto}
                    <div style="font-size:11px;opacity:0.65;margin-top:4px;text-align:right;">${m.hora}</div>
                </div>
            `).join('')}
        </div>
        <div class="chat-input-area">
            <input class="chat-input" id="chat-input-msg" placeholder="Digite uma mensagem..." onkeydown="enviarMsgChat(event, ${id})">
            <button class="btn-enviar" onclick="enviarMsgChatBtn(${id})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>
            </button>
        </div>
    `;
    scrollChat();
}

function scrollChat() {
    const el = document.getElementById('chat-msgs');
    if (el) el.scrollTop = el.scrollHeight;
}

function enviarMsgChat(event, id) {
    if (event.key === 'Enter') enviarMsgChatBtn(id);
}

function enviarMsgChatBtn(id) {
    const input = document.getElementById('chat-input-msg');
    const texto = input ? input.value.trim() : '';
    if (!texto) return;

    const conversa = conversas.find(c => c.id === id);
    if (!conversa) return;

    const agora = new Date();
    const hora = `${String(agora.getHours()).padStart(2,'0')}:${String(agora.getMinutes()).padStart(2,'0')}`;
    conversa.msgs.push({ de: 'minha', texto, hora });
    input.value = '';

    const msgsEl = document.getElementById('chat-msgs');
    if (msgsEl) {
        const div = document.createElement('div');
        div.className = 'msg-balao msg-minha';
        div.innerHTML = `${texto}<div style="font-size:11px;opacity:0.65;margin-top:4px;text-align:right;">${hora}</div>`;
        msgsEl.appendChild(div);
        scrollChat();
    }
}

// ============================================================
// MODAL SOLICITAR SERVIÇO
// ============================================================

function abrirModalSolicitar(idx) {
    const p = prestadores[idx];
    const modal = document.getElementById('modal-solicitar');
    if (!modal) return;

    document.getElementById('modal-titulo').textContent = `Solicitar serviço · ${p.cat}`;
    document.getElementById('modal-avatar').textContent = p.iniciais;
    document.getElementById('modal-prestador-nome').textContent = p.nome;
    document.getElementById('modal-prestador-cat').textContent = p.cat;
    document.getElementById('prestador-selecionado').style.display = 'flex';

    modal.style.display = 'flex';
}

function fecharModal() {
    const modal = document.getElementById('modal-solicitar');
    if (modal) modal.style.display = 'none';
}

function enviarSolicitacao() {
    fecharModal();
    const badge = document.getElementById('badge-solic');
    if (badge) {
        const atual = parseInt(badge.textContent) || 0;
        badge.textContent = atual + 1;
    }
    alert('✅ Solicitação enviada! O prestador receberá uma notificação e entrará em contato em breve.');
}

// Fechar modal clicando fora
document.addEventListener('click', function (e) {
    const modal = document.getElementById('modal-solicitar');
    if (modal && e.target === modal) fecharModal();
});

// ============================================================
// NOTIFICAÇÕES (placeholder)
// ============================================================

function toggleNotif() {
    alert('🔔 Você tem 1 nova mensagem de Marcos Almeida.');
}