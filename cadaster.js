(() => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const form = document.getElementById('registerForm');
    if (!form) {
      console.warn('registerForm not found');
      return;
    }

    form.replaceWith(form.cloneNode(true));
    const newForm = document.getElementById('registerForm');

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexSenha = /^.{6,}$/;

    newForm.addEventListener('submit', function (ev) {
      ev.preventDefault();

      const nome = document.getElementById('nome') || newForm.querySelector("input[type='text']");
      const email =
        document.getElementById('email') || newForm.querySelector("input[type='email']");
      const senhaInputs = newForm.querySelectorAll("input[type='password']");
      const senha = senhaInputs[0];
      const confirmar = senhaInputs[1];
      const terms = document.getElementById('termsCheck');

      document.querySelectorAll('.error-msg').forEach((el) => el.remove());
      newForm.querySelectorAll('input').forEach((i) => i.classList.remove('input-error'));

      let valido = true;

      function criarErro(campo, mensagem) {
        if (!campo) return;
        const prev = campo.parentElement.querySelector('.error-msg');
        if (prev) prev.remove();

        const p = document.createElement('p');
        p.className = 'error-msg text-red-600 text-sm mt-1';
        p.textContent = mensagem;

        try {
          campo.insertAdjacentElement('afterend', p);
        } catch (err) {
          campo.parentElement.appendChild(p);
        }

        p.style.display = 'block';
        campo.classList.add('input-error');
        valido = false;
      }

      if (!nome || nome.value.trim().length < 3) {
        criarErro(nome, 'Digite seu nome completo (mínimo 3 letras).');
      }

      if (!email || !regexEmail.test(email.value.trim())) {
        criarErro(email, 'Digite um e-mail válido.');
      }

      if (!senha || !regexSenha.test(senha.value)) {
        criarErro(senha, 'A senha deve ter no mínimo 6 caracteres.');
      }

      if (!confirmar || senha.value !== confirmar.value) {
        criarErro(confirmar, 'As senhas não coincidem.');
      }

      if (!terms || !terms.checked) {
        if (terms) terms.classList.add('input-error');
        Swal.fire({
          icon: 'warning',
          title: 'Aceite os Termos',
          text: 'Você precisa aceitar os termos de uso para continuar.',
          confirmButtonColor: '#7C3AED',
        });
        return;
      }

      if (!valido) {
        const firstError = document.querySelector('.error-msg');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const pessoa = {
        nome: nome.value.trim(),
        email: email.value.trim(),
      };

      Swal.fire({
        title: 'Cadastro Realizado!',
        html: `
            <div style="text-align:left;">
              <h3 style="font-size:16px;margin-bottom:8px">Dados cadastrados:</h3>
              <p><strong>Nome:</strong> ${escapeHtml(pessoa.nome)}</p>
              <p><strong>E-mail:</strong> ${escapeHtml(pessoa.email)}</p>
            </div>
          `,
        icon: 'success',
        confirmButtonColor: '#7C3AED',
      }).then(() => {
        const usuario = {
          nome: nome.value.trim(),
          email: email.value.trim(),
        };

        localStorage.setItem('usuarioLucky', JSON.stringify(usuario));
        window.location.href = 'login.html';

        newForm.reset();
      });
    });
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
// Seleciona o formulário
const form = document.querySelector('form');

// REGEX
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexSenha = /^.{6,}$/; // mínimo 6 caracteres

form.addEventListener('submit', function (e) {
  e.preventDefault();

  // campos
  const nome = form.querySelector("input[type='text']");
  const email = form.querySelector("input[type='email']");
  const senha = form.querySelectorAll("input[type='password']")[0];
  const confirmar = form.querySelectorAll("input[type='password']")[1];

  // limpa estados de erro
  document.querySelectorAll('.error-msg').forEach((el) => (el.style.display = 'none'));
  form.querySelectorAll('input').forEach((i) => i.classList.remove('input-error', 'shake'));

  let valido = true;

  // cria mensagens de erro caso não existam
  function criarErro(campo, mensagem) {
    let erro = campo.parentElement.querySelector('.error-msg');
    if (!erro) {
      erro = document.createElement('p');
      erro.className = 'error-msg';
      campo.parentElement.appendChild(erro);
    }
    erro.innerText = mensagem;
    erro.style.display = 'block';
    campo.classList.add('input-error', 'shake');
  }

  // valida nome
  if (nome.value.trim().length < 3) {
    criarErro(nome, 'Digite seu nome completo.');
    valido = false;
  }

  // valida email
  if (!regexEmail.test(email.value.trim())) {
    criarErro(email, 'Digite um e-mail válido.');
    valido = false;
  }

  // valida senha
  if (!regexSenha.test(senha.value)) {
    criarErro(senha, 'A senha deve ter no mínimo 6 caracteres.');
    valido = false;
  }

  // valida confirmação
  if (senha.value !== confirmar.value) {
    criarErro(confirmar, 'As senhas não coincidem.');
    valido = false;
  }

  document.querySelector('form').addEventListener('submit', function (e) {
    const check = document.getElementById('termsCheck');
    const error = document.getElementById('termsError');

    if (!check.checked) {
      e.preventDefault();
      error.classList.remove('hidden');
      check.classList.add('ring-2', 'ring-red-400');
    } else {
      error.classList.add('hidden');
      check.classList.remove('ring-2', 'ring-red-400');
    }
  });

  if (!valido) return;
});
