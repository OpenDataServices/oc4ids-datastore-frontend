const mockUrl = 'https://my.api.mockaroo.com/datasets.json?key=0a23bcf0';

let list;

const getData = async (url) => {
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((datum) => {
        populateList(datum);
      });
    })
    .catch((error) => console.error(error));
};

const populateList = (data) => {
  const listItem = document.createElement('li');
  listItem.classList.add('card');
  listItem.innerHTML = `
    <div class="left">
      <h2>${data.name}</h2>
      <p class="date">Last updated <time datetime="${data.updated}">${data.updated}</time></p>
    </div>
    <div class="right">
      <ul>
        <li>
          <span class="title">Projects</span>
          <span class="value">${data.projects}</span>
        </li>
        <li>
          <span class="title">Valid data</span>
            ${data.valid ? '<img class="validity" src="./assets/check.svg" alt="">' : '<img class="validity" src="./assets/cross.svg" alt="">'}
          <span class="value sr-only">
            ${data.valid ? 'Valid data' : 'Invalid data'}
          </span>
        </li>
        <li>
          <span class="title">Licence</span>
          <img class="licence" src="./assets/licences/nd.svg" alt="">
          <span class="value sr-only">
            ${data.licence}
          </span>
        </li>
      </ul>
       <div class="dropdown">
        <button class="download-btn">Download</button>
        <ul class="dropdown-content">
          <li>
            <a href="${data.xlsx}">XLSX</a>
          </li>
          <li>
            <a href="${data.csv}">CSV</a>
          </li>
          <li>
            <a href="${data.json}">JSON</a>
          </li>
        </ul>
      </div> 
    </div>
  `;
  list.appendChild(listItem);
};

const toggleDownloads = (e) => {
  const dropdown = e.target.nextElementSibling;
  console.log(dropdown)
  dropdown.classList.toggle('show');
}

document.addEventListener('DOMContentLoaded', async () => {
  list = document.querySelector('#publisher-list');
  await getData(mockUrl)

  const downloadButtons = document.querySelectorAll('.download-btn');
  downloadButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      toggleDownloads(e);
    })
  });
});

