const booksList = document.getElementById("books_list");
const searchField = document.getElementById("search_query");

searchField.addEventListener("keydown", search);

function search(event) {
  console.log(event.target.value);
}

async function logJSONData() {
  const response = await fetch("http://localhost:3000/books");
  const books = await response.json();
  books.map((book) => {
    const card = createCard(book.name);
    booksList.appendChild(card);
  });
}

function createCard(title) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `<h3 class="card-title">${title}</h3>`;
  return card;
}

logJSONData();
