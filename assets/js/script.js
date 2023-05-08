const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', e => getStatus(e));
document.getElementById('submit').addEventListener('click', e => postForm(e));

// get 'options' in right format: comma separated list
function processOptions(form) {
    
    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === 'options') {
            optArray.push(entry[1]);
        }
    }
    form.delete('options');
    form.append('options', optArray.join());

    return form;
}


async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById('checksform')));
    
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    })

    const data = await response.json();

    if (response.ok) {
       displayErrors(data);
    } else {        
        displayException(data);
        throw new Error(data.error);
    }
}


function displayErrors(data) {
    
    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no-error">No errors repoted!</div>`;
    } else {
        results = `<div>Total errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>,`;
            results += `column: <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById('resultsModalTitle').innerText = heading;
    document.getElementById('results-content').innerHTML = results;
    
    resultsModal.show();
}


// get request with API url & key, and pass this data to displayStatus function to display it
async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);          // await response

    const data = await response.json();                // convert to .json

    if (response.ok) {
        displayStatus(data);
    } else {        
        displayException(data);
        throw new Error(data.error);
    }
}


function displayStatus(data) {

    let heading = 'API Key Status'
    let results = `<div>Your key is valid until`;
    results += `<div class="key-status" >${data.expiry}</div>`

    document.getElementById('resultsModalTitle').innerText = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();
}


function displayException(data) {

    let heading = `<h5>An Exception occured</h5>`
    let results = `<div>The API retuned status code: ${data.status_code}</div>`;
    results += `<div>Error number: ${data.error_no}</div>`;
    results += `<div>Error text: ${data.error}</div>`;

    document.getElementById('resultsModalTitle').innerHTML = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();
}
