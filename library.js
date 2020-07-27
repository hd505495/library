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
    return this.isRead ? `<span class="section green" id="isReadText"><div>Read</div><div><i class="fa fa-check"></i></div></span>` 
                : `<span class="section red" id="isReadText"><div>Not Read</div><div><i class="fa fa-times"></i></div></span>`;
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
  cardContainer.innerHTML += generateAddBtn();
  let addBtn = document.getElementById('addBtn');
  addBtn.addEventListener('click', generateForm);
}
function generateForm() {

}

function generateAddBtn () {
  return `
    <button id="addBtn"><i class="fa fa-plus-circle"></i></button>
  `
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
  ${data.isReadText()}
</div>
`
}