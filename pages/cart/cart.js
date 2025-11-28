// =========================
// 🛒 CARREGAR CARRINHO
// =========================

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

const lista = document.getElementById('cart-items');
const emptyState = document.getElementById('empty-cart');

// Atualiza resumo
function atualizarResumo() {
  let subtotal = carrinho.reduce((acc, item) => acc + item.preco * item.qtd, 0);

  document.querySelectorAll('#subtotal, #total').forEach((el) => {
    if (el) el.textContent = `R$ ${subtotal.toFixed(2)}`;
  });
}

// Renderiza os produtos
function renderCarrinho() {
  if (carrinho.length === 0) {
    lista.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  lista.classList.remove('hidden');
  emptyState.classList.add('hidden');

  lista.innerHTML = '';

  carrinho.forEach((item, index) => {
    lista.innerHTML += `
        <div class="bg-white shadow rounded-xl p-5 flex gap-5 items-center hover:shadow-lg transition fade">
          <img src="${item.img}" class="w-32 rounded-lg" />

          <div class="flex-1">
            <h3 class="font-semibold text-xl">${item.nome}</h3>

            <div class="flex items-center gap-4 mt-4">
              <label class="text-sm font-medium text-gray-600">Quantidade:</label>
              <input 
                type="number" 
                min="1" 
                value="${item.qtd}" 
                data-index="${index}"
                class="qtd-input w-20 border rounded-lg py-2 px-3"
              />
            </div>
          </div>

          <div class="text-right">
            <div class="font-bold text-2xl text-violet-700">R$ ${(item.preco * item.qtd).toFixed(
              2
            )}</div>
            <button 
              data-index="${index}" 
              class="btn-remover text-red-500 hover:text-gray-400 mt-2 text-sm"
            >
              Remover
            </button>
          </div>
        </div>
        `;
  });

  atualizarResumo();
}

// =========================
// 🚮 REMOVER ITEM
// =========================

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn-remover')) {
    const index = e.target.dataset.index;
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    renderCarrinho();
  }
});

// =========================
// 🔢 ALTERAR QUANTIDADE
// =========================

document.addEventListener('input', function (e) {
  if (e.target.classList.contains('qtd-input')) {
    const index = e.target.dataset.index;
    const novaQtd = Number(e.target.value);

    if (novaQtd >= 1) {
      carrinho[index].qtd = novaQtd;
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      renderCarrinho();
    }
  }
});

// =========================
// 🚀 INICIAR
// =========================

renderCarrinho();
