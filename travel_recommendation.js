const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById("report");

const btnSearch = document.getElementById('btnSearch');
const btnReset  = document.getElementById('btnReset');


const patients = [];

function addPatient() {
    const name = document.getElementById("name").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById("age").value;
    const condition = document.getElementById("condition").value;

    if (name && gender && age && condition) {
        patients.push({ name, gender: gender.value, age, condition });
        resetForm();
        generateReport();
    }
}

function resetForm() {
    document.getElementById("name").value = "";
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.getElementById("age").value = "";
    document.getElementById("condition").value = "";
}

function generateReport() {
    const numPatients = patients.length;
    const conditionsCount = {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    };
    const genderConditionsCount = {
      Male: {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
      },
      Female: {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
      },
    };

    for (const patient of patients) {
      conditionsCount[patient.condition]++;
      genderConditionsCount[patient.gender][patient.condition]++;
    }

    report.innerHTML = `Number of patients: ${numPatients}<br><br>`;
    report.innerHTML += `Conditions Breakdown:<br>`;
    for (const condition in conditionsCount) {
      report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
    }

    report.innerHTML += `<br>Gender-Based Conditions:<br>`;
    for (const gender in genderConditionsCount) {
      report.innerHTML += `${gender}:<br>`;
      for (const condition in genderConditionsCount[gender]) {
        report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
      }
    }
  }

// addPatientButton.addEventListener("click", addPatient);

function searchCondition() {
    const input = document.getElementById('conditionInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    fetch('health_analysis.json')
      .then(response => response.json())
      .then(data => {
        const condition = data.conditions.find(item => item.name.toLowerCase() === input);

        if (condition) {
          const symptoms = condition.symptoms.join(', ');
          const prevention = condition.prevention.join(', ');
          const treatment = condition.treatment;

          resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
          resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="hjh">`;

          resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
          resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
          resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
        } else {
          resultDiv.innerHTML = 'Condition not found.';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
      });
}

// btnSearch.addEventListener('click', searchCondition);


function searchReset() {
    const input = document.getElementById('conditionInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';


}
// btnReset.addEventListener('click', searchCondition);







document.getElementById('searchForm').addEventListener('submit', function(event) {
  event.preventDefault();
  console.log('preventDefault(): Keep form from submitting');
});



function getCategoryFromInput(input) {
  const patterns = [
    { regex: /\b(beach|beaches|coast|seashore)\b/i, category: 'beaches' },
    { regex: /\b(temple|temples|shrine|pagoda)\b/i, category: 'temples' },
    { regex: /\b(country|countries|nation)\b/i, category: 'countries' }
  ];

  for (const { regex, category } of patterns) {
    if (regex.test(input)) return category;
  }

  return null;
}



function searchDestination() {
  const input = document.getElementById('destinationInput').value.toLowerCase().trim();
  console.log("Search input: " + input);

  const resultDiv = document.getElementById('searchResult');
  resultDiv.innerHTML = '';

  const section = document.createElement('section');
  section.className = 'd-flex justify-content-center align-items-center min-vh-100x mt-5';

  const div = document.createElement('div');
  div.className = 'w-100 bg-light text-dark p-5 rounded shadow content';

  section.appendChild(div);
  resultDiv.appendChild(section);

  fetch('travel-recommendation.json')
    .then(response => response.json())
    .then(data => {
      const category = getCategoryFromInput(input);
      console.log("Category: " + category);

      if (category) {
        const results = data[category];

        div.innerHTML += `<h2 class="mb-4 text-capitalize">${category}</h2>`;
        results.forEach(item => {
          div.innerHTML += `
            <div class="mb-4">
              <h4>${item.name}</h4>
              ${item.imageUrl ? `<img src="./img/destinations/${item.imageUrl}" alt="${item.name}" class="img-fluid mb-2 rounded" style="max-height:200px;">` : ''}
              <p>${item.description || ''}</p>
            </div>
          `;
        });
      } else {
        div.innerHTML += '<h2 class="fs-3"><i class="fa-solid fa-heart-crack fa-beat-fade"></i> <strong>Oh, no!</strong><br>Such a location was not found!</h2>';
        div.innerHTML += '<p><small>(<strong>Hint:</strong> Try searching for <em>countries</em>, <em>beaches</em>, or <em>temples</em>.)</small></p>';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      div.innerHTML = '<h2 class="fs-3"><i class="fa-solid fa-bomb fa-beat-fade"></i> <strong>Yikes!</strong><br>An error occurred while fetching destination data! Our team has been notified of the problem.</h2>';
    });
}

document.getElementById('btnSearch').addEventListener('click', searchDestination);


