// Seleciona o formulário da agenda pelo ID
const form = document.getElementById('form-agenda');

// Seleciona o corpo da tabela onde os contatos serão inseridos
const corpoTabela = document.querySelector('tbody');

// Tenta recuperar os contatos armazenados no localStorage, ou inicia com um array vazio
let contatos = JSON.parse(localStorage.getItem('contatos')) || [];

// Adiciona um ouvinte de evento para quando o formulário for enviado
form.addEventListener('submit', function (e) {
    e.preventDefault(); // Evita o recarregamento da página

    // Obtém os valores dos campos de entrada do formulário
    const inputNome = document.getElementById('nome-completo');
    const inputTelefone = document.getElementById('telefone');

    // Remove espaços em branco extras dos valores
    const nome = inputNome.value.trim();
    const telefone = inputTelefone.value.trim();

    // Verifica se os campos estão preenchidos
    if (!nome || !telefone) {
        alert("Preencha todos os campos!");
        return;
    }

    // Verifica se o telefone já existe na lista de contatos
    if (contatos.some(contato => contato.telefone === telefone)) {
        alert(`O telefone ${telefone} já está na agenda!`);
        return;
    }

    // Adiciona o novo contato ao array
    contatos.push({ nome, telefone });

    // Salva os contatos no localStorage e atualiza a tabela
    salvarContatos();
    atualizarTabela();

    // Limpa os campos do formulário
    inputNome.value = '';
    inputTelefone.value = '';
});

// Função que salva os contatos no localStorage
function salvarContatos() {
    localStorage.setItem('contatos', JSON.stringify(contatos));
}

// Função que atualiza visualmente a tabela de contatos
function atualizarTabela() {
    corpoTabela.innerHTML = ''; // Limpa a tabela atual

    // Para cada contato, cria uma linha com nome, telefone e botões de ação
    contatos.forEach((contato, index) => {
        const linha = document.createElement('tr');

        // Monta a linha com colunas editáveis e botões de editar e excluir
        linha.innerHTML = `
            <td contenteditable="false" data-type="nome">${contato.nome}</td>
            <td contenteditable="false" data-type="telefone">${contato.telefone}</td>
            <td>
                <button class="icon-btn edit-btn" onclick="editarContato(${index}, this)" title="Editar" data-mode="visualizacao">✏️</button>
                <button class="icon-btn delete-btn" onclick="removerContato(${index})" title="Excluir">🗑️</button>
            </td>
        `;

        // Adiciona a linha ao corpo da tabela
        corpoTabela.appendChild(linha);
    });
}

// Função para editar um contato da tabela
function editarContato(index, btn) {
    const linha = btn.closest('tr'); // Encontra a linha do botão clicado
    const celulas = linha.querySelectorAll('td[data-type]'); // Pega as células de nome e telefone
    const modoAtual = btn.getAttribute('data-mode'); // Lê o estado atual do botão (visualização ou edição)

    if (modoAtual !== 'editando') {
        // Entra no modo de edição
        celulas.forEach(td => {
            td.contentEditable = true; // Permite edição direta
            td.style.backgroundColor = '#fff7e6'; // Aplica uma cor de fundo para indicar edição
        });

        btn.setAttribute('data-mode', 'editando'); // Marca como em edição
        btn.innerHTML = '💾'; // Troca ícone para "salvar"
    } else {
        // Salva as alterações feitas
        const novoNome = celulas[0].textContent.trim();
        const novoTelefone = celulas[1].textContent.trim();

        // Valida os campos editados
        if (!novoNome || !novoTelefone) {
            alert("Campos não podem ficar vazios.");
            atualizarTabela(); // Reverte visualmente
            return;
        }

        // Verifica se o telefone já pertence a outro contato
        if (contatos.some((c, i) => c.telefone === novoTelefone && i !== index)) {
            alert("Este telefone já está cadastrado em outro contato.");
            atualizarTabela(); // Reverte visualmente
            return;
        }

        // Atualiza o contato com os novos dados
        contatos[index] = { nome: novoNome, telefone: novoTelefone };

        salvarContatos(); // Salva no localStorage
        atualizarTabela(); // Reatualiza a tabela
    }
}

// Função para remover um contato
function removerContato(index) {
    // Confirma a exclusão com o usuário
    if (confirm('Deseja realmente excluir este contato?')) {
        contatos.splice(index, 1); // Remove o contato do array
        salvarContatos();          // Atualiza o localStorage
        atualizarTabela();         // Atualiza a tabela
    }
}

// Ao carregar a página, exibe os contatos salvos
atualizarTabela();
