let current = 1;

function nextSlide() {
  current++;
  if (current > 3) current = 1;
  document.getElementById(`slide${current}`).checked = true;
}

// Auto play simples
setInterval(nextSlide, 5000);
