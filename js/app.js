const API_BASE_URL = 'https://potterapi-fedeperin.vercel.app/en';
const contentSection = document.getElementById('content');
const searchInput = document.getElementById('searchInput');
const randomBtn = document.getElementById('randomBtn');
const navButtons = document.querySelectorAll('.nav-btn');
let currentSection = 'books'; // Default section

// Fetch data from the API
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

// Fetch a random item
async function fetchRandom(section) {
  try {
    const response = await fetch(`${API_BASE_URL}/${section}/random`);
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  } catch (error) {
    console.error('Error fetching random data:', error);
    contentSection.innerHTML = '<p class="text-red-400">Failed to load random item.</p>';
    return null;
  }
}

// Render content dynamically
function renderContent(data, section) {
  contentSection.innerHTML = '';
  if (!data || data.length === 0) {
    contentSection.innerHTML = '<p class="text-gray-400">No results found.</p>';
    return;
  }

  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card bg-gray-800 p-4 rounded-lg shadow-lg';
    
    if (section === 'books') {
      card.innerHTML = `
        <img src="${item.cover || 'https://via.placeholder.com/150'}" alt="${item.title}" class="w-full h-48 object-cover rounded mb-4">
        <h2 class="text-xl font-bold">${item.title}</h2>
        <p><strong>Original Title:</strong> ${item.originalTitle}</p>
        <p><strong>Release Date:</strong> ${item.releaseDate}</p>
        <p><strong>Pages:</strong> ${item.pages}</p>
        <p class="text-gray-400">${item.description.slice(0, 100)}...</p>
      `;
    } else if (section === 'characters') {
      card.innerHTML = `
        <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.fullName}" class="w-full h-48 object-cover rounded mb-4">
        <h2 class="text-xl font-bold">${item.fullName}</h2>
        <p><strong>Nickname:</strong> ${item.nickname || 'N/A'}</p>
        <p><strong>Hogwarts House:</strong> ${item.hogwartsHouse || 'N/A'}</p>
        <p><strong>Actor:</strong> ${item.interpretedBy || 'N/A'}</p>
        <p><strong>Birthdate:</strong> ${item.birthdate || 'N/A'}</p>
      `;
    } else if (section === 'houses') {
      card.innerHTML = `
        <h2 class="text-xl font-bold">${item.house} ${item.emoji}</h2>
        <p><strong>Founder:</strong> ${item.founder}</p>
        <p><strong>Animal:</strong> ${item.animal}</p>
        <p><strong>Colors:</strong> ${item.colors.join(', ')}</p>
      `;
    } else if (section === 'spells') {
      card.innerHTML = `
        <h2 class="text-xl font-bold">${item.spell}</h2>
        <p class="text-gray-400">${item.use}</p>
      `;
    }

    contentSection.appendChild(card);
  });
}

// Load section data
async function loadSection(section) {
  currentSection = section;
  const data = await fetchData(section);
  renderContent(data, section);
}

// Handle search
searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim();
  const data = await fetchData(currentSection, query);
  renderContent(data, currentSection);
});

// Handle random button
randomBtn.addEventListener('click', async () => {
  const data = await fetchRandom(currentSection);
  renderContent([data], currentSection);
});

// Handle navigation buttons
navButtons.forEach(button => {
  button.addEventListener('click', () => {
    navButtons.forEach(btn => btn.classList.remove('bg-yellow-600'));
    button.classList.add('bg-yellow-600');
    loadSection(button.dataset.section);
    searchInput.value = ''; // Clear search
  });
});

// Initialize with books section
loadSection('books');
