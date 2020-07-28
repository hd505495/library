let cardContainer = document.getElementById('book-cards');
let modal = document.getElementById('myModal');
let xSpan = document.querySelector('.close');
let bookForm = document.querySelector('.modal-content');

let library = [];

// Load library from previous session (if exists)
loadFromLocalStorage();

// Book constructor
function Book(title, author, isRead) {
  this.title = title;
  this.author = author;
  this.isRead = isRead;
  /*this.isReadText = function() {
    return this.isRead ? `<span class="section green" id="isReadText"><div>Read</div><div><i class="fa fa-check"></i></div></span>` 
                : `<span class="section red" id="isReadText"><div>Not Read</div><div><i class="fa fa-times"></i></div></span>`;
  }*/
  this.info = function() {
    return `${title} was written by ${author}`;
  }
}

Book.prototype.isReadText = function() {
  return this.isRead ? `<span class="section green" id="isReadText"><div>Read</div><div><i class="fa fa-check"></i></div></span>` 
  : `<span class="section red" id="isReadText"><div>Not Read</div><div><i class="fa fa-times"></i></div></span>`;

}

// Add new book to library
function addBook(title, author, isRead) {
  if (isRead == 'on') isRead = true;
  if (isRead == 'off') isRead = false;
  let book = new Book(title, author, isRead);
  //console.log('creating book with info:');
  //console.log({title, author, isRead});
  if(alreadyInLibrary(book)) {
    return;
  }
  library.push(book);

  render();
}

function render() {
  // remove card before adding new one
  cardContainer.innerHTML = ''

  saveToLocalStorage();

  library.forEach(function(currentValue, index) {
    cardContainer.innerHTML += generateCard(currentValue, index);
    console.log(`generated card from library index ${index}`);
  })
  cardContainer.innerHTML += generateAddBtn();
  let addBtn = document.getElementById('addBtn');
  addBtn.addEventListener('click', generateForm);
  let delBtns = document.querySelectorAll('.delete');

  delBtns.forEach((button, index) => {
    button.addEventListener('click', function(event) {
      console.log(`removing card at index ${index}`);
      library.splice(index, 1);
      render();
    });
  })

  let readStatusBtns = document.querySelectorAll('.changeReadStatus');
    readStatusBtns.forEach((button) => {
      button.addEventListener('click', function(event) {
        let index = parseInt(event.target.parentNode.parentNode.dataset.key);
        console.log(`altering card at index ${index}`);
        library[index].isRead = true;
        render();
      });
  })
}

function generateForm() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
xSpan.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
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
      ${generateCardButtons(data)}
    </div>
    `
}

function generateCardButtons(data) {
  if (data.isRead) {
    return `
      <span class="section" id="cardButtons">
        <div class="delete red"><i class="fa fa-trash"></i></div>
      </span>
  `}
  else {
    return `
      <span class="section" id="cardButtons">
        <div class="delete red"><i class="fa fa-trash"></i></div>
        <div class="yellow changeReadStatus">I read it!</div>
      </span>
    `
  }
}

bookForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const title = this.elements['title'].value;
  const author = this.elements['author'].value;
  const read = this.elements['read'].checked;
  console.log({title, author, read});
  addBook(title, author, read);
  bookForm.reset();
  modal.style.display = "none";
});


/* local storage methods */
//Check if in array
function alreadyInLibrary(book) {
  return library.some(libBook => {
      if(libBook.title === book.title &&
          libBook.author === book.author) {
          return true;
      }
  })
}

// Save library to local storage for next refresh
function saveToLocalStorage() {
  localStorage.setItem("b-cards", JSON.stringify(library));
}

// Load library from storage
function loadFromLocalStorage(){
  let loadedLibrary = JSON.parse(localStorage.getItem('b-cards'));
  console.table(loadedLibrary);
  // If empty library, load the default books and update library array, else, update library array with previous session library
  if(loadedLibrary === null || loadedLibrary === undefined || loadedLibrary.length == 0){
      loadDefaultBooks();
      localStorage.setItem("b-cards", JSON.stringify(library));
  }
  else {
      library = loadedLibrary;
      render();
  }
}

// If no books on page, load the default
function loadDefaultBooks(){
  addBook('1984', 'George Orwell', true);
  addBook('The Old Man and the Sea', 'Ernest Hemmingway', false);
}