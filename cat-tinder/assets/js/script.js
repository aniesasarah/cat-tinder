const catStack = document.getElementById('cat-stack');
let cats = [];
let likedCats = [];
let currentIndex = 0;

async function loadCats() {
  for (let i = 0; i < 10; i++) {
    cats.push(`https://cataas.com/cat?${Math.random()}`);
  }
  displayCat();
}

function displayCat() {
  if (currentIndex >= cats.length) {
    localStorage.setItem('likedCats', JSON.stringify(likedCats));
    window.location.href = 'summary.html';
    return;
  }

  const card = document.createElement('div');
  card.className = 'cat-card';
  card.innerHTML = `<img src="${cats[currentIndex]}" alt="Cat">`;

  // Insert card at top
  catStack.innerHTML = '';
  catStack.appendChild(card);

  setupSwipe(card);
}

function setupSwipe(card) {
  let startX = 0, startY = 0, currentX = 0, currentY = 0, isDragging = false;

  card.addEventListener('pointerdown', e => {
    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
    card.style.transition = 'none';
  });

  card.addEventListener('pointermove', e => {
    if (!isDragging) return;
    currentX = e.clientX - startX;
    currentY = e.clientY - startY;
    const rotate = currentX / 10;
    card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotate}deg)`;
  });

  card.addEventListener('pointerup', e => {
    if (!isDragging) return;
    isDragging = false;

    if (currentX > 120) {
      flyOut(card, 'right');
    } else if (currentX < -120) {
      flyOut(card, 'left');
    } else {
      card.style.transition = 'transform 0.3s';
      card.style.transform = '';
    }
  });

  document.getElementById('like-btn').onclick = () => flyOut(card, 'right');
  document.getElementById('dislike-btn').onclick = () => flyOut(card, 'left');
}

function flyOut(card, direction) {
  card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
  const xOff = direction === 'right' ? window.innerWidth : -window.innerWidth;
  const rotate = direction === 'right' ? 30 : -30;
  card.style.transform = `translate(${xOff}px, -50px) rotate(${rotate}deg)`;
  card.style.opacity = '0';

  setTimeout(() => {
    if (direction === 'right') likedCats.push(cats[currentIndex]);
    currentIndex++;
    displayCat();
  }, 500);
}

loadCats();
