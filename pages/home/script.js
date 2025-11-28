// HOME – JS EXTRA (somente necessário)

let current = 1;

function nextSlide() {
  current++;
  if (current > 3) current = 1;
  document.getElementById(`slide${current}`).checked = true;
}

// Auto play simples (opcional). Retire se quiser manual.
setInterval(nextSlide, 5000);

// Recupera favoritos salvos
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

// Atualiza visual dos botões
function atualizarFavoritos() {
  document.querySelectorAll('.btn-favoritar').forEach((btn) => {
    const id = btn.dataset.id;
    if (favoritos.includes(id)) {
      btn.classList.add('favorito');
      btn.textContent = '❤';
    } else {
      btn.classList.remove('favorito');
      btn.textContent = '♡';
    }
  });
}

// Clique no botão
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn-favoritar')) {
    const id = e.target.dataset.id;

    if (favoritos.includes(id)) {
      favoritos = favoritos.filter((item) => item !== id);
    } else {
      favoritos.push(id);
    }

    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    atualizarFavoritos();
  }
});

// Inicializa
atualizarFavoritos();
