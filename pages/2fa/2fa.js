// 2FA SCRIPT – Lucky Marketplace

const inputs = document.querySelectorAll("input[maxlength='1']");
const form = document.querySelector('form');

// Cria mensagem de erro
const errorMessage = document.createElement('p');
errorMessage.id = 'code-error';
errorMessage.textContent = 'Código inválido. Tente novamente.';
form.appendChild(errorMessage);

// Foca no primeiro campo ao carregar
window.addEventListener('DOMContentLoaded', () => {
  inputs[0].focus();
});

// Lógica dos inputs
inputs.forEach((input, index) => {
  input.classList.add('code-input');

  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, ''); // permite só número

    if (input.value && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  });

  // Backspace volta para o anterior
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !input.value && index > 0) {
      inputs[index - 1].focus();
    }
  });
});

// Validação ao enviar
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const code = Array.from(inputs)
    .map((i) => i.value)
    .join('');

  if (code.length !== 6 || !/^\d{6}$/.test(code)) {
    showError();
    return;
  }

  hideError();

  // EXEMPLO: código correto = 123456
  if (code === '123456') {
    alert('Código verificado com sucesso!');
    window.location.href = '../home/index.html';
  } else {
    showError();
  }
});

// Mostrar erro
function showError() {
  errorMessage.style.display = 'block';
  inputs.forEach((i) => i.classList.add('error'));
}

// Ocultar erro
function hideError() {
  errorMessage.style.display = 'none';
  inputs.forEach((i) => i.classList.remove('error'));
}
