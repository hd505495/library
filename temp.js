// Library array for storing books
let myLibrary = [];

// Load library from previous session (if exists)
loadFromLocalStorage()
render()

// Book object to represent individual books
function Book(title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
}

//Check if in array
function alreadyInLibrary(book) {
    return myLibrary.some(libBook => {
        if(libBook.title === book.title &&
            libBook.author === book.author &&
            libBook.pages === book.pages) {
            return true
        }
    })
}

// Pushes new books into library
function addBookToLibrary(book) {
    if(alreadyInLibrary(book)) return
    myLibrary.push(book)
}

// Renders new books on page.
function render(){
    // Get and clear book elements
    const books = document.querySelector(".books")
    books.innerHTML = ''

    // Save new library array with changes to local storage
    saveToLocalStorage()

    // For each book object in library array, create div for title, author, pages, read, delete, and toggle read. Add event listeners on delete and toggle.
    myLibrary.forEach(function(book, index) {
        const newBook = document.createElement("div")
        newBook.classList.add("book")
        newBook.setAttribute("id", index)

        const title = document.createElement("div")
        title.classList.add("title")
        title.textContent = book.title

        const author = document.createElement("div")
        author.classList.add("author")
        author.textContent = book.author

        const pages = document.createElement("div")
        pages.classList.add("pages")
        pages.textContent = book.pages + ' pages'

        const read = document.createElement("div")
        read.classList.add("read")
        read.textContent = book.read ? 'Read' : 'Not Read'

        const deleteBtn = document.createElement("div")
        deleteBtn.classList.add("delete")
        deleteBtn.classList.add("disable-select")
        deleteBtn.textContent = '\u2715'
        deleteBtn.addEventListener('click', deleteBook)

        const toggleBtn = document.createElement("div")
        toggleBtn.classList.add("toggle")
        toggleBtn.classList.add("disable-select")
        toggleBtn.textContent = "Toggle read"
        toggleBtn.addEventListener('click', toggleRead)

        const optionBar = document.createElement("div")
        optionBar.classList.add("optionBar")
        optionBar.appendChild(toggleBtn)
        optionBar.appendChild(deleteBtn)

        // Append all children to newBook element, append newBook element to books container 
        newBook.appendChild(title)
        newBook.appendChild(author)
        newBook.appendChild(pages)
        newBook.appendChild(read)
        newBook.appendChild(optionBar)
        books.appendChild(newBook)
    })

    // Append add new book card to DOM. Clicking on card will open modal form to add new book.
    const newAddBook = document.createElement("div")
    newAddBook.classList.add("book")
    newAddBook.classList.add("bookAddCard")
    newAddBook.addEventListener('click', openModal)

    const addCard = document.createElement("div")
    addCard.classList.add("addCard")
    addCard.classList.add("disable-select")
    addCard.textContent = "+"

    newAddBook.appendChild(addCard)
    books.appendChild(newAddBook )
}

// Function expression to find closest element which contains class. starts from 'elem' parameter, and moves up to each parent node until 'classSelector' class found
let getCLosestClass = function(elem, classSelector) {
    for( ; elem && elem !== document; elem = elem.parentNode) {
        if(elem.classList.contains(classSelector)) return elem
    }
    return null
}

// Delete particular book by splicing out and re-rendering
function deleteBook(e) {
    let parentElement = getCLosestClass(e.target, "book")
    const index = parentElement.getAttribute("id")
    parentElement.innerHTML = ''
    myLibrary.splice(index, 1)
    render()
}

// Toggle read status of book, and then re-render
function toggleRead(e) {
    let parentElement = getCLosestClass(e.target, "book")
    const index = parentElement.getAttribute("id")
    myLibrary[index].read = !myLibrary[index].read
    parentElement.querySelector(".read").textContent = myLibrary[index].read ? 'Read' : 'Not Read'
    saveToLocalStorage()
}

// Get modal element
const modal = document.querySelector("#myModal")
// Get modal form 
const modalForm = document.querySelector(".modalForm")
// Get close button
const closeBtn = document.querySelector(".closeBtn")
// Get modal submit button
const submitBtn = document.querySelector(".submit-button")

// Listen for close click 
closeBtn.addEventListener('click', closeModal)
// Listen for outside click
window.addEventListener('click', outsideClick)
// Listen for submit click
submitBtn.addEventListener('click', submitModal)

// Function to open modal
function openModal() {
    modal.style.display = 'block'
} 

// Function to close modal
function closeModal(){
    modal.style.display = 'none'
    modalForm.reset()
}

// Function to close modal if outside click 
function outsideClick(e) {
    if(e.target == modal) closeModal()
}

// Function to submit modal form and create new book
function submitModal(){
    let title = document.querySelector('#title-input').value
    let author = document.querySelector('#author-input').value
    let pages = document.querySelector('#pages-input').value
    let read = document.querySelector('#read-input').checked
    if (!title || !author || !pages) return
    let book = new Book(title, author, pages, read)
    addBookToLibrary(book)
    render()
    closeModal()
}

// Save library to local storage for next refresh
function saveToLocalStorage() {
    localStorage.setItem("books", JSON.stringify(myLibrary))
}

// Load library from storage
function loadFromLocalStorage(){
    let loadedLibrary = JSON.parse(localStorage.getItem('books'))
    // If empty library, load the default books and update library array, else, update library array with previous session library
    if(loadedLibrary === null || loadedLibrary === undefined || loadedLibrary.length == 0){
        loadDefaultBooks()
        localStorage.setItem("books", JSON.stringify(myLibrary))
    }
    else {
        myLibrary = loadedLibrary
    }
}

// If no books on page, load the default
function loadDefaultBooks(){
    addBookToLibrary(new Book("1984", "George Orwell", "328", true))
    addBookToLibrary(new Book("Julius Caesar", "William Shakespeare", "200", false))
    addBookToLibrary(new Book("The Origins of Political Order", "Francis Fukuyama", "585", true))
    
}