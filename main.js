let autocompleteWrapper = document.querySelector('.autocomplete-wrapper');
let autocompleteContainer = document.querySelector('.autocomplete-container');
let autocompleteContent = document.querySelector('.autocomplete-content');
const searchInput = document.querySelector('#search-input');
let todos;
let filterTodos = [];
let indexToSelect = 0;
todos = await getTodos();

document.addEventListener('mouseover', e => {
  if (e.target.matches('.list')) {
    const id = e.target.dataset.id;
    const currentListElement = document.querySelector(`[data-id="${id}"]`);
    removeAllActive();
    currentListElement.classList.add('active');
    indexToSelect = id;
  }
});

searchInput.addEventListener('input', e => {
  handleSearch(e.target.value);
});

document.addEventListener('keydown', e => {
  // check searchInput is focused or not
  if (document.activeElement !== searchInput) return;

  if (filterTodos.length === 0) return;

  const key = e.key;
  if (key === 'ArrowDown') {
    indexToSelect++;
    if (indexToSelect > filterTodos.length) {
      indexToSelect = 1;
    }

    removeAllActive();
    const listElement = document.querySelector(`[data-id="${indexToSelect}"]`);
    listElement.classList.add('active');

    // calculate the visible portion of listElement within autoCompleteContainer
    const parentRect = autocompleteContainer.getBoundingClientRect();
    const rect = listElement.getBoundingClientRect();
    if ((rect.bottom - parentRect.top) > parentRect.height) {
      autocompleteContainer.scrollTop += rect.bottom - parentRect.bottom;
    } else if (indexToSelect === 1) {
      autocompleteContainer.scrollTop = 0;
    }
  } else if (key === 'ArrowUp') {
    indexToSelect--;
    if (indexToSelect <= 0) {
      indexToSelect = filterTodos.length;
    }

    removeAllActive();
    const listElement = document.querySelector(`[data-id="${indexToSelect}"]`);
    listElement.classList.add('active');

    // calculate the visible portion of listElement within autoCompleteContainer
    const parentRect = autocompleteContainer.getBoundingClientRect();
    const rect = listElement.getBoundingClientRect();
    if (rect.top < parentRect.top) {
      autocompleteContainer.scrollTop -= parentRect.top - rect.top;
    } else if (indexToSelect === filterTodos.length) {
      autocompleteContainer.scrollTop = autocompleteContainer.scrollHeight;
    }
  }
});

const handleSearch = debounce(value => {
  search(value);
}, 250);

function search(value) {
  indexToSelect = 0;
  autocompleteContent.innerHTML = '';
  if (autocompleteWrapper.classList.contains('active'))
    autocompleteWrapper.classList.remove('active');
  const searchValue = value.toLowerCase();
  if (todos.length === 0 || searchValue == '') return;
  filterTodos = todos.filter(todo => todo.title.includes(searchValue));
  autocompleteWrapper.classList.add('active');
  if (filterTodos.length === 0) {
    const html = `
    <div class="not-found">
      <h5>No Data Found</h5>
    </div>
    `;
    autocompleteContent.innerHTML = html;
  } else {
    filterTodos.forEach((res, index) => {
      const html = `
      <div class="list" data-id="${index + 1}">
        <h5>${index + 1}. ${markTheWords(res.title, searchValue)}</h5>
      </div>
      `;
      autocompleteContent.innerHTML += html;
    });
  }
}

async function getTodos() {
  let url = 'https://jsonplaceholder.typicode.com/todos';
  const response = await fetch(url);
  return await response.json();
}

function debounce(func, duration) {
  let time;

  return (...args) => {
    if (time) clearTimeout(time);
    time = setTimeout(() => {
      func(...args);
    }, duration);
  };
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function removeAllActive() {
  const activeElement = document.querySelector('.list.active');
  if(activeElement) {
    activeElement.classList.remove('active');
  }
}

function markTheWords(string, value) {
  return string.replaceAll(value, `<mark>${value}</mark>`)
}