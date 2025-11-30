let current = 1;

function nextSlide() {
  current++;
  if (current > 3) current = 1;
  document.getElementById(`slide${current}`).checked = true;
}

setInterval(nextSlide, 5000);

// MOBILE MENU
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

hamburgerBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// CEP MASK
$(document).ready(function () {
  $('#campoCep').mask('00000-000');
  $('#campoCepMobile').mask('00000-000');
});

$(document).ready(function () {
  const painel = $('#cepbox'); // div onde os dados aparecem

  painel.slideDown(600); // slide-down: desliza para baixo

  $('.group').hover(
    function () {
      $('#cepbox').stop(true, true).slideDown(300);
    },
    function () {
      $('#cepbox').stop(true, true).slideUp(300);
    }
  );
});
