let current = 1;

function nextSlide() {
  current++;
  if (current > 3) current = 1;
  document.getElementById(`slide${current}`).checked = true;
}

// Auto play simples
setInterval(nextSlide, 5000);
<<<<<<< HEAD

const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

hamburgerBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

$('#campoCep').mask('00000-000');
=======
>>>>>>> 3daf8e017a106d576d2de515156cada076e5f6ea
