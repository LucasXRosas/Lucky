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

  // salva dados no localStorage
  const usuario = {
    nome: nome.value.trim(),
    email: email.value.trim(),
    senha: senha.value,
  };

  localStorage.setItem('usuarioLucky', JSON.stringify(usuario));

  alert('Conta criada com sucesso!');
  window.location.href = 'login.html';
});
