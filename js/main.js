import { endpoint } from './endpoint.js';
import countries from 'https://cdn.jsdelivr.net/npm/i18n-iso-countries@7.14.0/+esm';

const countriesData = 'https://cdn.jsdelivr.net/npm/i18n-iso-countries@7.14.0/langs/en.json';
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

// Function to load English language country data
const getCountries = async (url) => {
  try {
    const response = await fetch(url);
    const locale = await response.json();
    countries.registerLocale(locale);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function to generate HTML list of 'cards' from data
const populateList = (data) => {
  let portalHTML;
  let licenseHTML;
  let downloadsHTML;
  let countryHTML;

  // Set snippet of HTML for links to available downloads
  if (data.downloads.length > 0) {
    downloadsHTML = data.downloads.sort((a, b) => a.format.localeCompare(b.format)).map((download) => {
      return `
        <li>
          <a href="${download.url}">${download.format.toUpperCase()}</a>
        </li>
      `;
    }).join('');
  }
  
  // Set snippet of HTML for publisher portal links
  if (data.portal.url) {
    portalHTML = `
      <p>Publisher portal:
        <a class="value" href="${data.portal.url}">
          ${data.portal.title || data.portal.url}
        </a>
      </p>
    `;
  } else if (data.portal.title && !data.portal.url) {
    portalHTML = `
      <p>Publisher portal: ${data.portal.title}</p>
    `;
  } else {
    portalHTML = ``;
  }

  // Set snippet of HTML for license fallbacks
  if (data.license.url) {
    licenseHTML = `
      <a class="value" href="${data.license.url}">
        ${data.license.title_short || data.license.title || data.license.url}
      </a>
    `;
  } else {
    licenseHTML = `
      <span>Unknown</span>
    `;
  }

  // Set snippet of HTML for publisher countries
  if (data.publisher.country) {
    countryHTML = `
      <p class="country">
        (${data.publisher.country && countries.getName(data.publisher.country.toUpperCase(), 'en')})
      </p>
    `;
  } else {
    countryHTML = '';
  }

  const listItem = document.createElement('li');
  listItem.classList.add('card');
  listItem.innerHTML = `
    <header class="card-header">
      <h2>
        ${data.publisher.name}
      </h2>
      ${countryHTML}
    </header>
    ${portalHTML}
    <p>License:
      ${licenseHTML}
    </p>
    <footer class="card-footer">
      <p class="date">Last retrieved <time datetime="${data.loaded_at}">${new Date(data.loaded_at).toISOString().slice(0,10)}</time></p>
      <div class="dropdown">
        <button class="download-btn" ${data.downloads.length === 0 ? 'disabled' : ''}>Download</button>
        <ul class="dropdown-content">
          ${downloadsHTML}
        </ul>
      </div>
    </footer>
  `;
  list.appendChild(listItem);
};

// Function to toggle the downloads dropdown
const toggleDownloads = (e) => {
  e.stopPropagation();
  const dropdown = e.target.nextElementSibling;

  // Close open dropdowns
  const openDropdowns = document.querySelectorAll('.dropdown-content.show');
  openDropdowns.forEach((openDropdown) => {
    if (openDropdown !== dropdown) {
      openDropdown.classList.remove('show');
    }
  });
  
  // Show the targeted dropdown
  dropdown.classList.toggle('show');
}

// Function to scroll to the top of the page smoothly
const scrollToTop = () => {
  document.documentElement.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Listen for the page to finish loading
document.addEventListener('DOMContentLoaded', async () => {
  const scrollToTopButton = document.querySelector('#return-to-top-btn');
  const header = document.querySelector('#page-header');

  // Check for header to move off screen and toggle the scroll to top button
  if (header) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        scrollToTopButton.style.display = 'none';
      } else {
        scrollToTopButton.style.display = 'block';
      }
    }, {
      root: null,
      threshold: 1.0
    });
    
    observer.observe(header);
  }

  scrollToTopButton.addEventListener('click', scrollToTop);
  
  list = document.querySelector('#publisher-list');
  
  // Get countries data from i18n-iso-countries
  await getCountries(countriesData);

  // Get data from the endpoint
  await getData(endpoint);

  const downloadButtons = document.querySelectorAll('.download-btn');
  downloadButtons.forEach((button) => {
    // Add an event listener to all download buttons to toggle the downloads dropdown when clicked
    button.addEventListener('click', (e) => {
      toggleDownloads(e);
    })
  });

  // Add an event listener to close dropdowns when clicking outside of one
  document.addEventListener('click', () => {
    // Close open dropdowns
    const openDropdowns = document.querySelectorAll('.dropdown-content.show');
    openDropdowns.forEach((openDropdown) => {
      openDropdown.classList.remove('show');
    });
  });
});

