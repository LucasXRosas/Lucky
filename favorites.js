document.addEventListener('DOMContentLoaded', () => {
  const favContainer = document.getElementById('favorites-list');
  const emptyMessage = document.getElementById('empty-message');

  // Carrega os favoritos (ou lista vazia)
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Se não tiver favoritos
  if (favorites.length === 0) {
    emptyMessage.classList.remove('hidden');
    return;
  }

  // Renderiza cards
  favorites.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow p-4 cursor-pointer card-fav';

    card.innerHTML = `
      <img src="${item.img}" alt="${item.title}" class="favorite-img mb-4" />

      <h4 class="font-semibold text-lg">${item.title}</h4>
      <p class="text-sm text-gray-600">${item.desc}</p>

      <div class="mt-4 font-bold text-xl text-primary">${item.price}</div>

      <button class="w-full bg-red-500 text-white mt-4 py-2 rounded-lg remove-btn">
        Remover
      </button>
    `;

    // Botão de remover
    card.querySelector('.remove-btn').addEventListener('click', () => {
      removeFavorite(item.id);
    });

    favContainer.appendChild(card);
  });
});

// Remove item do localStorage
function removeFavorite(id) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const updated = favorites.filter((p) => p.id !== id);

  localStorage.setItem('favorites', JSON.stringify(updated));
  location.reload();
}
