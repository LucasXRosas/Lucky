let current = 1;

// CAROUSEL
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

// CEP BOX HOVER
$(document).ready(function () {
  const painel = $('#cepbox');

  painel.slideDown(600);

  $('.group').hover(
    function () {
      painel.stop(true, true).slideDown(300);
    },
    function () {
      painel.stop(true, true).slideUp(300);
    }
  );
});

// VIA CEP - REQUISIÇÃO ASSÍNCRONA
async function buscarCep(cep) {
  const url = `https://viacep.com.br/ws/${cep}/json/`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Erro na requisição');
    }

    const data = await response.json();

    if (data.erro) {
      alert('CEP não encontrado!');
      return;
    }

    alert(`Endereço encontrado:
    Rua: ${data.logradouro}
    Bairro: ${data.bairro}
    Cidade: ${data.localidade} - ${data.uf}`);
  } catch (error) {
    alert('Erro ao buscar CEP. Tente novamente.');
    console.error(error);
  }
}

// BOTÃO CEP
$(document).ready(function () {
  $('#cepbox button').click(function () {
    const cep = $('#campoCep').val().replace(/\D/g, '');
    if (!cep) {
      alert('Digite um CEP válido!');
      return;
    }
    buscarCep(cep);
  });

  // MOBILE
  $('#campoCepMobile').on('blur', function () {
    const cep = $(this).val().replace(/\D/g, '');
    if (cep) {
      buscarCep(cep);
    }
  });
});
