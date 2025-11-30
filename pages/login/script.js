const form = document.querySelector('form');
const emailInput = form.querySelector('input[type="email"]');
const passwordInput = form.querySelector('input[type="password"]');
const rememberCheck = form.querySelector('input[type="checkbox"]');

// Criar elemento de erro
const errorMessage = document.createElement('p');
errorMessage.className = 'login-error';
errorMessage.textContent = 'E-mail ou senha inválidos.';
form.insertBefore(errorMessage, form.children[2]);

// Carregar e-mail salvo
window.addEventListener('DOMContentLoaded', () => {
  const savedEmail = localStorage.getItem('lucky-email');

  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberCheck.checked = true;
  }
});

// Validação simples
form.addEventListener('submit', (e) => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Regex leve de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email) || password.length < 4) {
    e.preventDefault();
    showError();
    return;
  }

  hideError();

  // Lembrar-me
  if (rememberCheck.checked) {
    localStorage.setItem('lucky-email', email);
  } else {
    localStorage.removeItem('lucky-email');
  }
});

// Mostrar erro
function showError() {
  errorMessage.style.display = 'block';
  emailInput.classList.add('error');
  passwordInput.classList.add('error');
}

// Ocultar erro
function hideError() {
  errorMessage.style.display = 'none';
  emailInput.classList.remove('error');
  passwordInput.classList.remove('error');
}