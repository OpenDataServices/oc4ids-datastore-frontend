import { endpoint } from './endpoint.js';

let list;

// Function to fetch data from URL
const getData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    data.forEach((datum) => {
      populateList(datum);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Function to generate HTML list of 'cards' from data
const populateList = (data) => {
  // Restructure download formats data into a simple object
  const downloads = data.downloads.reduce((acc, current) => {
    acc[current.format] = current.url;
    return acc;
  }, {});
  

  const listItem = document.createElement('li');
  listItem.classList.add('card');
  listItem.innerHTML = `
    <header class="card-header">
      <h2>
        <a href="${data.source_url}">
          ${data.publisher.name}
        </a>
      </h2>
    </header>
    <p>License:
      <a class="value" href="${data.license.url}">
        ${data.license.short_name || data.license.name || data.license.url}
      </a>
    </p>
    <footer class="card-footer">
      <p class="date">Last retrieved <time datetime="${data.loaded_at}">${new Date(data.loaded_at).toISOString().slice(0,10)}</time></p>
      <div class="dropdown">
        <button class="download-btn">Download</button>
        <ul class="dropdown-content">
          <li>
            <a href="${downloads.xlsx}">XLSX</a>
          </li>
          <li>
            <a href="${downloads.csv}">CSV</a>
          </li>
          <li>
            <a href="${downloads.json}">JSON</a>
          </li>
        </ul>
      </div>
    </footer>
  `;
  list.appendChild(listItem);
};

// Function to toggle the downloads dropdown
const toggleDownloads = (e) => {
  const dropdown = e.target.nextElementSibling;
  console.log(dropdown)
  dropdown.classList.toggle('show');
}

// Listen for the page to finish loading
document.addEventListener('DOMContentLoaded', async () => {
  list = document.querySelector('#publisher-list');
  
  // Get data from the endpoint
  await getData(endpoint)

  const downloadButtons = document.querySelectorAll('.download-btn');
  downloadButtons.forEach((button) => {
    // Add an event listener to all download buttons to toggle the downloads dropdown when clicked
    button.addEventListener('click', (e) => {
      toggleDownloads(e);
    })
    
    // Add an event listener to all download buttons to toggle the downloads dropdown on pressing the enter key
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        toggleDownloads(e);
      }
    })
  });
});

