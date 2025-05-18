// Search form validation and submission
// =========================================================
const searchForm = document.getElementById('searchForm');
if (searchForm) {
  searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('preventDefault(): Keep form from submitting');
  });
}

const btnReset = document.getElementById('btnReset');
if (btnReset) {
  btnReset.addEventListener('click', searchReset);
} else {
  // console.warn('searchReset: btnReset element not found.');
}

const btnSearch = document.getElementById('btnSearch');
if (btnSearch) {
  btnSearch.addEventListener('click', searchDestination);
} else {
  // console.warn('btnSearch: btnSearch element not found.');
}


// Resets the search input and result display
// =========================================================
function searchReset() {
  const inputElement = document.getElementById('destinationInput');
  const resultDiv = document.getElementById('searchResult');
  
  if (inputElement && resultDiv) {
    inputElement.value = '';
    resultDiv.innerHTML = '';
  } else {
    console.warn('searchReset: Required elements not found.');
  }
}


// Uused to categorize the user input into predefined categories
// and uses regular expressions to match keywords in the input string
// =========================================================
function getCategoryFromInput(input) {
  const patterns = [
    { regex: /\b(beach|beaches|coast|seashore)\b/i, category: 'beaches' },
    { regex: /\b(temple|temples|shrine|pagoda)\b/i, category: 'temples' },
    { regex: /\b(country|countries|nation)\b/i,     category: 'countries' }
  ];

  for (const { regex, category } of patterns) {
    if (regex.test(input)) return category;
  }

  return null;
}


// Formats the results based on the category and displays them in the result div
// Dependencies: function.formatResultsDestination()
// =========================================================
function formatResults(div, category, results) {
  div.innerHTML += `<h2 class="mb-4 text-capitalize">${category}</h2>`;
  // div.innerHTML += `<p class="mb-4">Here are some ${category} you might want to visit:</p>`;

  results.forEach(item => {
    div.innerHTML += `<hr>`;
    div.innerHTML += `<div class="mb-4">`;
    if (category === 'countries') {
      // Sort countries and cities alphabetically
      results.sort((a, b) => a.name.localeCompare(b.name));
      item.cities.sort((a, b) => a.name.localeCompare(b.name));
      item.cities.forEach(city => {
        // console.log(city.name);
        div.innerHTML += `<h3>${city.name}</h3>`;
        formatResultsDestination(div, city);
      });
    } else {
      // console.log(item.name);
      div.innerHTML += `<h3>${item.name}</h3>`;
      formatResultsDestination(div, item);
    }
    div.innerHTML += `</div>`;
  });
  
}


// Formats the results card for each destination
// =========================================================
function formatResultsDestination(div, input) {
  div.innerHTML += `
  ${input.imageUrl ? `<img src="./img/destinations/${input.imageUrl}" alt="${input.imageAlt}" class="img-fluid mb-2 rounded">` : ''}
  <p>${input.description || ''}<br>
  <a href="./contact.html?destination=${input.name}" class="btn btn-sm btn-light shadow mt-3 mb-4">Book Now <i class="fa-solid fa-arrow-right fa-beat-fade ms-2" style="--fa-animation-duration: 2.5s;"></i></a></p>
`;
}


// Fetches the travel recommendation data and displays results based on user input
// Dependencies: fetch API, JSON data file (travel-recommendation.json), function.getCategoryFromInput(), function.formatResults(), and Bootstrap for styling
// =========================================================
function searchDestination() {
  const json = './_data/travel-recommendation.json';
  const input = document.getElementById('destinationInput').value.toLowerCase().trim();
  // console.log("Search input: " + input);

  const resultDiv = document.getElementById('searchResult');
  resultDiv.innerHTML = '';

  const section = document.createElement('section');
  section.className = 'd-flex justify-content-center align-items-center min-vh-100x mt-5';

  const div = document.createElement('div');
  div.className = 'w-100 bg-light text-dark p-5 rounded shadow content';

  section.appendChild(div);
  resultDiv.appendChild(section);

  fetch(json)
    .then(response => response.json())
    .then(data => {
      const category = getCategoryFromInput(input);

      if (category) {
        const results = data[category];
        formatResults(div, category, results);
      } else {
        div.innerHTML += '<h2 class="fs-3"><i class="fa-solid fa-heart-crack fa-beat-fade"></i> <strong>Oh, no!</strong><br>Such a location was not found!</h2>';
        div.innerHTML += '<p><small>(<strong>Hint:</strong> Try searching for <em>countries</em>, <em>beaches</em>, or <em>temples</em>.)</small></p>';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      div.innerHTML =  '<h2 class="fs-3"><i class="fa-solid fa-bomb fa-beat-fade"></i> <strong>Yikes!</strong> There has been an error!</h2>';
      div.innerHTML += '<p>An error occurred while fetching destination data! Our team has been notified of the problem.</p>';
    });
}


// Contact form validation and submission
// =========================================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const form = event.target;
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('destination');
    console.log('Destination:', destination);
    if (destination) {
      message.value += `I am interested in learning more about ${destination}.`;
    }


    if (!name || !email || !message) {
      alert('All fields are required.');
      return;
    }

    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    // Replace form with response message
    const responseMessage = document.createElement('div');
    responseMessage.className  = 'alert alert-success mt-3';
    responseMessage.innerHTML  = '<h3><i class="fa-solid fa-paper-plane fa-shake primary fs-3"  style="color: #fff; --fa-animation-duration: 5s;" aria-hidden="true"></i> Thank you!</h3><p class="fs-5"></h3>';
    responseMessage.innerHTML += '<p>Your message has been sent successfully to Katherine Nguyen! She will be in contact very soon! Adventure awaits!</p>';
    responseMessage.innerHTML += '<p class="small"><em>(Logged to console.)</em></p>';
    form.parentNode.replaceChild(responseMessage, form);
  });
}

