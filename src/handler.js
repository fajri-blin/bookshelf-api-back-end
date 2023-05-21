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

const getBookByIdHandler = (request, h) => {
    const {id} = request.params;

    //check the books array according to the id
    const book = books.filter((b) => b.id === id)[0];

    //check if book is not found
    if(book === undefined){
        const response = h.response({
            status : 'fail',
            message : 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
    }

    return {
        status : 'success',
        data : {
            book,
        }
    }
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const updatedAt = new Date().toISOString;


    const index = books.findIndex((book)=> book.id === id);

    //check if book is found
    if(index !== -1){
        if(name === undefined){
            response.code(400);
            return h.response({
                status : 'fail',
                message : 'Gagal memperbarui buku, Mohon isi nama buku'
            });
        }
        if(readPage > pageCount){
            response.code(404);
            return h.response({
                status : 'fail',
                message : 'Gagal memperbarui buku, readPage tidak boleh lebih besar dari pageCount'
            });
        }

        // insert book data to books array
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        };

        response.code(200);
        return h.response({
            status : 'success',
            message : 'Buku berhasil diperbarui' 
        })
    }
};

const deleteBookByIdHandler = (request, h) => {
    const {id} = request.params;
    const index = books.findIndex((book)=> book.id === id);

    if (index !== -1){
        books.splice(index, 1);
        const response = h.response({
            status:'success',
            message:'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status : 'fail',
        message : 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404);
    return response;
};

module.exports = { addBooksHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };