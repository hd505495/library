let cardContainer = document.getElementById('book-cards');

let library = [];
addBook('1984', 'George Orwell', true);
addBook('The Old Man and the Sea', 'Ernest Hemmingway', false);

// Book constructor
function Book(title, author, isRead) {
  this.title = title;
  this.author = author;
  this.isRead = isRead;
  this.isReadText = function() {
    return this.isRead ? `<span><div>Read</div><div>icon</div></span>` : `<span><div>Not Read</div><div>icon</div></span>`
  }
  this.info = function() {
    return `${title} was written by ${author}`;
  }
}

// Add new book to library
function addBook(title, author, isRead) {
  let book = new Book(title, author, isRead);
  library.push(book);

  render();
}

function render() {
  // remove card before adding new one
  cardContainer.innerHTML = ''

  library.forEach(function(currentValue, index) {
    cardContainer.innerHTML += generateCard(currentValue, index);
  })
}

function generateCard(data, index) {
  return `
  <div class="card" data-key=${index}>
  <span class="section">
    <span id="title"><b>Book Title</b></span><br>
    <span id="title-content">${data.title}</span>
  </span>
  <span class="section">
    <span id="author"><b>Author</b></span><br>
    <span id="author-content">${data.author}</span>
  </span>
  ${data.isReadText}
</div>`
}