document.addEventListener('DOMContentLoaded', init);

let isSubmitting = false;
const API_URL = 'http://localhost:3000/usuarios';

function init() {
  const form = document.getElementById('registerForm');
  if (!form) return console.warn('Formulário não encontrado!');

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexSenha = /^.{6,}$/;
  const camposPersistentes = ['nome', 'email', 'senha', 'senhaConfirm'];

  // Preencher campos ao carregar
  camposPersistentes.forEach((id) => {
    const input = document.getElementById(id);
    const valorSalvo = localStorage.getItem(`form_${id}`);
    if (valorSalvo) input.value = valorSalvo;

    input.addEventListener('input', () => {
      localStorage.setItem(`form_${id}`, input.value);
    });
  });

  /* SUBMIT FORM */
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;

    limparErros();

    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const senha = document.getElementById('senha');
    const confirmar = document.getElementById('senhaConfirm');
    const terms = document.getElementById('termsCheck');
    const btn = form.querySelector("button[type='submit']");

    let valido = true;

    /* VALIDAÇÕES */
    if (!nome.value.trim() || nome.value.trim().length < 3) {
      criarErro(nome, 'Digite seu nome completo (mínimo 3 letras).');
      valido = false;
    }

    if (!regexEmail.test(email.value.trim())) {
      criarErro(email, 'Digite um e-mail válido.');
      valido = false;
    }

    if (!regexSenha.test(senha.value)) {
      criarErro(senha, 'A senha deve ter no mínimo 6 caracteres.');
      valido = false;
    }

    if (senha.value !== confirmar.value) {
      criarErro(confirmar, 'As senhas não coincidem.');
      valido = false;
    }

    if (!terms.checked) {
      criarErro(terms, 'Você deve aceitar os termos.');
      Swal.fire({
        icon: 'warning',
        title: 'Aceite os Termos',
        text: 'Você precisa aceitar os termos para continuar.',
      });
      valido = false;
    }

    if (!valido) {
      resetButton(btn);
      isSubmitting = false;
      return;
    }

    const usuario = {
      nome: nome.value.trim(),
      email: email.value.trim(),
      senha: senha.value.trim(), // salvo, mas não exibido
    };

    try {
      setButtonLoading(btn);

      // SALVAR NO JSON SERVER
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      });

      if (!resp.ok) throw new Error('Erro ao salvar no JSON Server');

      const criado = await resp.json();

      // SALVAR NO LOCALSTORAGE
      const usuarios = JSON.parse(localStorage.getItem('usuariosLucky') || '[]');
      usuarios.push(usuario);
      localStorage.setItem('usuariosLucky', JSON.stringify(usuarios));

      // ALERTA SUCESSO
      await Swal.fire({
        title: 'Cadastro concluído!',
        html: `
          <p><strong>Nome:</strong> ${escapeHtml(usuario.nome)}</p>
          <p><strong>E-mail:</strong> ${escapeHtml(usuario.email)}</p>
        `,
        icon: 'success',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          form.reset();
          camposPersistentes.forEach((id) => localStorage.removeItem(`form_${id}`));
          listarUsuarios();
        }
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao cadastrar',
        text: err.message || 'Ocorreu um erro.',
      });
    } finally {
      resetButton(btn);
      isSubmitting = false;
    }
  });

  listarUsuarios();
}

/* BOTÃO */
function setButtonLoading(btn) {
  if (!btn) return;
  btn.dataset.originalText = btn.innerText;
  btn.disabled = true;
  btn.innerText = 'Aguarde...';
}

function resetButton(btn) {
  if (!btn) return;
  btn.disabled = false;
  btn.innerText = btn.dataset.originalText || 'Cadastrar';
}

/* ERROS */
function limparErros() {
  document.querySelectorAll('.error-msg').forEach((e) => e.remove());
  document.querySelectorAll('input').forEach((i) => i.classList.remove('input-error'));
}

function criarErro(campo, mensagem) {
  if (!campo) return;
  campo.classList.add('input-error');

  const p = document.createElement('p');
  p.className = 'error-msg text-red-600 text-sm mt-1';
  p.textContent = mensagem;

  const prev = campo.parentElement.querySelector('.error-msg');
  if (prev) prev.remove();

  campo.insertAdjacentElement('afterend', p);
}

/* LISTA DE USUÁRIOS */
async function listarUsuarios() {
  const container = document.getElementById('usuariosContainer');
  const secao = document.getElementById('listaUsuarios');

  try {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error('Erro ao buscar usuários do JSON Server');
    const usuarios = await resp.json();

    if (!container) return;

    if (usuarios.length === 0) {
      container.innerHTML = `<p class="text-gray-600">Nenhum usuário cadastrado.</p>`;
      secao.classList.add('hidden');
      return;
    }

    container.innerHTML = usuarios
      .map(
        (u, i) => `
          <div class="p-4 bg-white border rounded-xl shadow">
            <p><strong>Nome:</strong> ${escapeHtml(u.nome)}</p>
            <p><strong>Email:</strong> ${escapeHtml(u.email)}</p>
            <p class="text-xs text-gray-500">ID: ${u.id || i + 1}</p>
          </div>
        `
      )
      .join('');

    secao.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="text-gray-600">Erro ao carregar usuários.</p>`;
    secao.classList.remove('hidden');
  }
}

/* UTIL */
function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
