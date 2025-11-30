/* ============================================================
   CADASTRO + VALIDAÇÃO + API FAKE (JSON SERVER)
   ============================================================ */

document.addEventListener('DOMContentLoaded', init);

let isSubmitting = false;

function init() {
  const form = document.getElementById('registerForm');
  if (!form) return console.warn('Formulário não encontrado!');

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexSenha = /^.{6,}$/;

  /* ------------------------------------------------------------
     LISTENER CORRETO → agora o form envia APENAS pelo submit
     ------------------------------------------------------------ */
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

    /* ---------------- VALIDAÇÕES ---------------- */
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

    /* ---------------- USUÁRIO ---------------- */
    const usuario = {
      nome: nome.value.trim(),
      email: email.value.trim(),
      senha: senha.value.trim(),
    };

    try {
      setButtonLoading(btn);

      /* ---------------- SALVAR NA API (POST) ---------------- */
      const criado = await criarUsuarioAPI(usuario);

      if (!criado) {
        throw new Error('API não retornou usuário válido');
      }

      console.log('Usuário criado:', criado);

      /* ---------------- ALERTA SUCESSO + LOCALSTORAGE ---------------- */
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
          // SALVAR LOCALMENTE
          localStorage.setItem('usuarioLucky', JSON.stringify(criado));
          console.log('LocalStorage salvo:', JSON.parse(localStorage.getItem('usuarioLucky')));

          // ATUALIZAR LISTA
          listarUsuariosAPI();

          // LIMPAR FORMULÁRIO (opcional)
          form.reset();
        }
      });

      /* ---------------- SALVAR LOCALMENTE ---------------- */
      localStorage.setItem('usuarioLucky', JSON.stringify(criado));

      console.log('LocalStorage salvo:', JSON.parse(localStorage.getItem('usuarioLucky')));

      /* ---------------- ATUALIZAR LISTA ---------------- */
      listarUsuariosAPI();

      // window.location.href = "login.html";
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

  listarUsuariosAPI();
}

/* ============================================================
   BOTÃO
   ============================================================ */

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

/* ============================================================
   ERROS
   ============================================================ */

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

/* ============================================================
   API JSON SERVER
   ============================================================ */

const API_URL = 'http://localhost:3000/usuarios';

async function criarUsuarioAPI(usuario) {
  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  });

  if (!resp.ok) {
    throw new Error('Erro ao criar usuário');
  }

  const data = await resp.json();
  console.log('API retornou:', data); // debug
  return data;
}

async function listarUsuariosAPI() {
  try {
    const req = await fetch(API_URL);
    const dados = await req.json();
    renderizarUsuarios(dados);
  } catch (e) {
    console.log('Erro ao listar:', e);
  }
}

function renderizarUsuarios(lista) {
  const container = document.getElementById('usuariosContainer');
  const secao = document.getElementById('listaUsuarios');

  if (!container) return;

  container.innerHTML =
    lista.length === 0
      ? `<p class="text-gray-600">Nenhum usuário cadastrado.</p>`
      : lista
          .map(
            (u) => `
      <div class="p-4 bg-white border rounded-xl shadow">
        <p><strong>Nome:</strong> ${escapeHtml(u.nome)}</p>
        <p><strong>Email:</strong> ${escapeHtml(u.email)}</p>
        <p class="text-xs text-gray-500">ID: ${u.id}</p>
      </div>
    `
          )
          .join('');

  secao.classList.remove('hidden');
}

/* ============================================================
   UTIL
   ============================================================ */

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
