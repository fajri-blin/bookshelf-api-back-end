const {nanoid} = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
    //created by user input
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

    //created by server
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = (pageCount === readPage) ? true : false;

    //check the input
    if(name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    //create new array of book
    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    }
    
    //insert newBook Object into books array
    books.push(newBook);

    //check if book is added
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if(!isSuccess){
        const response = h.response({
            status : 'fail',
            message : 'Data buku gagal ditambahkan'
        });
        response.code(500);
        return response;
    }

    //return response
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
    });
    response.code(201);
    return response;
};

const getAllBooksHandler = () => ({
    status :'success',
    data : {
        books,
    }
});

const getBookByIdHandler = (request, h) => {};
const editBookByIdHandler = (request, h) => {};
const deleteBookByIdHandler = (request, h) => {};

module.exports = { addBooksHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };