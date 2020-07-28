let cardContainer = document.getElementById('book-cards');
let modal = document.getElementById('myModal');
let xSpan = document.querySelector('.close');
let bookForm = document.querySelector('.modal-content');

let library = [];

// Load library from previous session (if exists) or default library else
loadFromLocalStorage();

// Book constructor
function Book(title, author, isRead) {
  this.title = title;
  this.author = author;
  this.isRead = isRead;
}

// Add new book to library
function addBook(title, author, isRead) {
  let book = new Book(title, author, isRead);

  if(alreadyInLibrary(book)) {
    return;
  }
  library.push(book);

  render();
}

function render() {
  // remove card before adding new one
  cardContainer.innerHTML = ''

  // save most recent alterations to library
  saveToLocalStorage();

  // render each book "card" from book objects
  library.forEach(function(currentValue, index) {
    cardContainer.innerHTML += generateCard(currentValue, index);
  })
  // append html for 'add new book' button
  cardContainer.innerHTML += generateAddBtn(); 
  // grab it from the DOM
  let addBtn = document.getElementById('addBtn');
  // attach click listener
  addBtn.addEventListener('click', generateForm);

  // grab all delete buttons (one from each card)
  let delBtns = document.querySelectorAll('.delete');
  // attach a listener to each delete button
  // which removes that specific book card from library
  delBtns.forEach((button, index) => {
    button.addEventListener('click', function(event) {
      library.splice(index, 1); // delete button index = book index
      render(); // display the change
    });
  })

  // grab all "change read status" buttons
  // note: only unread book cards contain one,
  // so correspondance is not 1-to-1
  let readStatusBtns = document.querySelectorAll('.changeReadStatus');
  // attach click listeners
  readStatusBtns.forEach((button) => {
    button.addEventListener('click', function(event) {
      // grabs data attribute from parent card element
      // which corresponds to book index in library
      let index = parseInt(event.target.parentNode.parentNode.dataset.key);
      library[index].isRead = true;
      render(); //display the change
    });
  })
}

// show modal
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

// return html for 'add new book' button
function generateAddBtn () {
  return `
    <button id="addBtn"><i class="fa fa-plus-circle"></i></button>
  `
}

// return appropriate html depending on book.isRead property
function generateCard(data, index) {
  if (data.isRead) {
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
        <span class="section green" id="isReadText">
          <div>Read</div>
          <div><i class="fa fa-check"></i></div>
        </span>
        <span class="section" id="cardButtons">
          <div class="delete red"><i class="fa fa-trash"></i></div>
        </span>
      </div>
        `
  }
  else {
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
        <span class="section red" id="isReadText">
          <div>Not Read</div>
          <div><i class="fa fa-times"></i></div>
        </span>
        <span class="section" id="cardButtons">
          <div class="delete red"><i class="fa fa-trash"></i></div>
          <div class="yellow changeReadStatus">I read it!</div>
        </span>
      </div>
        `
  }
}

// submit form functionality
bookForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const title = this.elements['title'].value;
  const author = this.elements['author'].value;
  const read = this.elements['read'].checked;
  addBook(title, author, read);
  bookForm.reset();
  modal.style.display = "none"; 
});

//Check if book is already in array
function alreadyInLibrary(book) {
  return library.some(libBook => {
      if(libBook.title === book.title &&
          libBook.author === book.author) {
          return true;
      }
  })
}

/* ------LOCAL STORAGE FUNCTIONS------ */

// Save library to local storage for next refresh
function saveToLocalStorage() {
  localStorage.setItem("myLibrary", JSON.stringify(library));
}

// Load library from storage
function loadFromLocalStorage(){
  let loadedLibrary = JSON.parse(localStorage.getItem('myLibrary'));
  // If empty library, load the default books and update library array, else, update library array with previous session library
  if(loadedLibrary === null || loadedLibrary === undefined || loadedLibrary.length == 0){
      loadDefaultBooks();
      localStorage.setItem("myLibrary", JSON.stringify(library));
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