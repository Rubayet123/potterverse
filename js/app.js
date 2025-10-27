const API_BASE_URL = 'https://potterapi-fedeperin.vercel.app/en';
const contentSection = document.getElementById('content');
const searchInput = document.getElementById('searchInput');
const navButtons = document.querySelectorAll('.nav-btn');
const homeSection = document.getElementById('home');
const contentContainer = document.getElementById('content-container');
const spellEffect = document.querySelector('.spell-effect');
let currentSection = 'home';
let trail = null;

async function fetchData(section, query = '') {
  try {
    let url = `${API_BASE_URL}/${section}`;
    if (query) url += `?search=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    contentSection.innerHTML = '<p class="text-red-400">Failed to load data. Please try again.</p>';
    return [];
  }
}

function renderContent(data, section) {
  contentSection.innerHTML = '';
  if (!data || data.length === 0) {
    contentSection.innerHTML = '<p class="text-gray-400">No results found.</p>';
    return;
  }

  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card p-4 rounded-lg shadow-lg';

    if (section === 'books') {
      card.innerHTML = `
        <img src="${item.cover || 'https://via.placeholder.com/150'}" alt="${item.title}" class="w-full object-contain rounded-t-lg max-h-64">
        <div class="p-4">
          <h2 class="text-xl font-bold text-yellow-400">Title: ${item.title}</h2>
          <p><strong>Original Title:</strong> ${item.originalTitle}</p>
          <p><strong>Number:</strong> ${item.number}</p>
          <p><strong>Release Date:</strong> ${item.releaseDate}</p>
          <p><strong>Pages:</strong> ${item.pages}</p>
          <p><strong>Description:</strong> ${item.description}</p>
        </div>
      `;
    } else if (section === 'characters') {
      card.innerHTML = `
        <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.fullName}" class="w-full object-contain rounded-t-lg max-h-64">
        <div class="p-4">
          <h2 class="text-xl font-bold text-yellow-400">Name: ${item.fullName}</h2>
          <p><strong>Nickname:</strong> ${item.nickname || 'N/A'}</p>
          <p><strong>House:</strong> ${item.hogwartsHouse || 'N/A'}</p>
          <p><strong>Actor:</strong> ${item.interpretedBy || 'N/A'}</p>
          <p><strong>Children:</strong> ${item.children ? item.children.join(', ') : 'N/A'}</p>
          <p><strong>Birthdate:</strong> ${item.birthdate || 'N/A'}</p>
        </div>
      `;
    } else if (section === 'houses') {
      card.innerHTML = `
        <div class="p-4">
          <h2 class="text-xl font-bold text-yellow-400">House: ${item.house} ${item.emoji}</h2>
          <p><strong>Founder:</strong> ${item.founder}</p>
          <p><strong>Colors:</strong> ${item.colors ? item.colors.join(', ') : 'N/A'}</p>
          <p><strong>Animal:</strong> ${item.animal}</p>
        </div>
      `;
    } else if (section === 'spells') {
      card.innerHTML = `
        <div class="p-4">
          <h2 class="text-xl font-bold text-yellow-400">Spell: ${item.spell}</h2>
          <p><strong>Use:</strong> ${item.use}</p>
        </div>
      `;
    }

    card.addEventListener('click', () => {
      const beam = document.createElement('div');
      beam.className = 'spell-beam';
      beam.style.left = `${card.getBoundingClientRect().left + card.offsetWidth / 2}px`;
      beam.style.top = `${card.getBoundingClientRect().top}px`;
      spellEffect.appendChild(beam);
      setTimeout(() => beam.remove(), 800);
    });

    contentSection.appendChild(card);
  });
}

async function loadSection(section) {
  currentSection = section;
  homeSection.classList.add('hidden');
  contentContainer.classList.remove('hidden');

  if (section === 'home') {
    homeSection.classList.remove('hidden');
    contentContainer.classList.add('hidden');
    return;
  }

  const data = await fetchData(section);
  renderContent(data, section);
}

searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim();
  if (currentSection !== 'home' && query) {
    const data = await fetchData(currentSection, query);
    renderContent(data, currentSection);
  } else if (!query) {
    const data = await fetchData(currentSection);
    renderContent(data, currentSection);
  }
});

navButtons.forEach(button => {
  button.addEventListener('click', () => {
    navButtons.forEach(btn => btn.classList.remove('bg-yellow-600'));
    button.classList.add('bg-yellow-600');
    loadSection(button.dataset.section);
    searchInput.value = ''; // Clear search on section change

    const beam = document.createElement('div');
    beam.className = 'spell-beam';
    beam.style.left = `${button.getBoundingClientRect().left + button.offsetWidth / 2}px`;
    beam.style.top = `${button.getBoundingClientRect().top + button.offsetHeight}px`;
    spellEffect.appendChild(beam);
    spellEffect.classList.remove('hidden');
    setTimeout(() => {
      beam.remove();
      spellEffect.classList.add('hidden');
    }, 800);
  });
});

// Wand Trail Effect
document.addEventListener('mousemove', (e) => {
  if (!trail) {
    trail = document.createElement('div');
    trail.className = 'wand-trail';
    document.body.appendChild(trail);
  }
  trail.style.left = `${e.pageX - 5}px`;
  trail.style.top = `${e.pageY - 5}px`;
  trail.style.opacity = 1;
  setTimeout(() => {
    trail.style.opacity = 0;
  }, 400);
});

loadSection('home');
