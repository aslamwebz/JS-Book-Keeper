class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn
    }
}

class UI {

    addBookToList(book) {
        const list = document.getElementById('book-list');
        //create table
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
        `;

        list.appendChild(row);
    }

    showAlert(message, className) {
        const div = document.createElement('div');

        div.className = `alert ${className}`;

        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');

        const form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

//Local Storage Class
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book) {
            const ui = new UI();

            ui.addBookToList(book);
        });
    }

    static addBooks(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach(function(book, index) {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//dom load events

document.addEventListener('DOMContentLoaded', Store.displayBooks());

//Event Listeners 
document.getElementById('book-form').addEventListener('submit', function(e) {
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;


    //Instantiate book
    const book = new Book(title, author, isbn);

    const ui = new UI();

    if (title === '' || author === '' || isbn === '') {
        ui.showAlert('Please fil in all fields', 'error');
    } else {

        //show success alert
        ui.showAlert('Book has been added', 'success');

        ui.addBookToList(book);

        Store.addBooks(book);

        ui.clearFields();

    }
    e.preventDefault();
});

//Event listener for delete

document.getElementById('book-list').addEventListener('click', function(e) {

    const ui = new UI();

    ui.deleteBook(e.target);

    //Remove from ls

    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)


    //show an Alert

    ui.showAlert('Book Removed', 'success');

    e.preventDefault();
});