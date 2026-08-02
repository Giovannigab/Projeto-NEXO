
        function selecionarTipo(tipo) {
            // Atualiza botões de seleção
            document.querySelectorAll('.opcao-conta').forEach(function (btn) {
                btn.classList.toggle('ativo', btn.dataset.tipo === tipo);
            });

            // Atualiza formulário exibido
            document.querySelectorAll('.form-cadastro').forEach(function (form) {
                form.classList.remove('ativo');
            });
            document.getElementById('form-' + tipo).classList.add('ativo');
        }

        // -------------------Validação do formulário de cadastro do cliente(19/06/2026 - Giovanni-----------------------
        document.querySelector('#form-cliente').addEventListener('submit', function(event) {
        // Impede o envio padrão do formulário
        event.preventDefault();

        const senha = document.querySelector('#senha-cliente').value;
        const confirmarSenha = document.querySelector('#confirmar-senha-cliente').value;

        // 1. Verificador de campos de senha
        if (senha === "") {
            alert("Por favor, preencha o campo de senha.");
            return;
        }

        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem. Por favor, tente novamente.");
            return;
        }

        // 2. Redirecionamento se tudo estiver correto
        // Em um cenário real, enviariamos os dados para o servidor aqui (ex: via fetch)
        // Se a validação passou, redirecionamos para a página desejada:
        window.location.href = "contratante.html";
        });