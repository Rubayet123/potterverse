const API_BASE_URL = 'https://potterapi-fedeperin.vercel.app/en';
const contentSection = document.getElementById('content');
const searchInput = document.getElementById('searchInput');
const navButtons = document.querySelectorAll('.nav-btn');
const homeSection = document.getElementById('home');
const contentContainer = document.getElementById('content-container');
let currentSection = 'home';

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
          <h2 class="text-xl font-bold text-yellow-400">${item.title}</h2>
          <p><strong>Original:</strong> ${item.originalTitle}</p>
          <p><strong>Release:</strong> ${item.releaseDate}</p>
          <p class="text-gray-400">${item.description.slice(0, 100)}...</p>
        </div>
      `;
    } else if (section === 'characters') {
      card.innerHTML = `
        <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.fullName}" class="w-full object-contain rounded-t-lg max-h-64">
        <div class="p-4">
          <h2 class="text-xl font-bold text-yellow-400">${item.fullName}</h2>
          <p><strong>House:</strong> ${item.hogwartsHouse || 'N/A'}</p>
          <p><strong>Actor:</strong> ${item.interpretedBy || 'N/A'}</p>
        </div>
      `;
    } else if (section === 'houses') {
      card.innerHTML = `
        <div class="p-4">
          <h2 class="text-xl font-bold text-yellow-400">${item.house} ${item.emoji}</h2>
          <p><strong>Founder:</strong> ${item.founder}</p>
          <p><strong>Animal:</strong> ${item.animal}</p>
        </div>
      `;
    } else if (section === 'spells') {
      card.innerHTML = `
        <div class="p-4">
          <h2 class="text-xl font-bold text-yellow-400">${item.spell}</h2>
          <p class="text-gray-400">${item.use}</p>
        </div>
      `;
    }

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
  });
});

loadSection('home');
