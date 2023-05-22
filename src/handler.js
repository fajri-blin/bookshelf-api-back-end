const { nanoid } = require('nanoid');
const books = require('./books')

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
        data : {
            bookId : id,
        }
    });
    response.code(201);
    return response;
};

// const getAllBooksHandler = (request, h) => {
//     const {reading} = request.query;

//     const book = books.map((book) => {
//         const {id, name, publisher} = book;
//         return {id, name, publisher};
//     });

//     //check reading status
//     if(reading !== undefined){
//         if(reading === 1){   
//             const book = books.filter((book) => book.reading === (reading === '1'));
//             return {
//                 status : 'success',
//                 data : {
//                     books : book,
//                 }
//             }
//         }else if(reading === 0){
//             const book = books.filter((book) => book.reading === (reading === '0'));
//             return {
//                 status : 'success',
//                 data : {
//                     books : book,
//                 }
//             }
//         }
//     }
//     //check finished status
//     if(finished !== undefined){
//         if(finished === 1){
//             const book = books.filter((book) => book.finished === (finished === '1'));
//             return {
//                 status : 'success',
//                 data : {
//                     books : book,
//                 }
//             }
//         }else if(finished === 0){
//             const book = books.filter((book) => book.finished === (finished === '0'));
//             return {
//                 status : 'success',
//                 data : {
//                     books : book,
//                 }
//             }
//         }
//     }

//     const response = h.response({
//         status : 'success',
//         data : {
//             books : book,
//         }
//     });
//     response.code(200);
//     return response;
// }

const getAllBooksHandler = (request, h) => {
    const { reading, finished, name } = request.query;
  
    let filteredBooks = books;
  
    if (reading !== undefined) {
      const isReading = reading === '1';
      filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
    }
  
    if (finished !== undefined) {
      const isFinished = finished === '1';
      filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
    }
  
    if (name !== undefined) {
      const searchName = name.toLowerCase();
      filteredBooks = filteredBooks.filter((book) =>
        book.name.toLowerCase().includes(searchName)
      );
    }
  
    const mappedBooks = filteredBooks.map((book) => {
      const { id, name, publisher } = book;
      return { id, name, publisher };
    });
  
    const response = h.response({
      status: 'success',
      data: {
        books: mappedBooks,
      },
    });
  
    response.code(200);
    return response;
  };
  

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
  
    // Check the books array according to the id
    const book = books.find((b) => b.id === bookId);
  
    // Check if book is not found
    if (!book) {
      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
        data: null,
      });
  
      return response.code(404);
    }
  
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
  
    return response.code(200);
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
    const finished = readPage === pageCount;
  
    const index = books.findIndex((book) => book.id === bookId);
  
    if (index !== -1) {
      if (!name) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
      }
  
      if (readPage > pageCount) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
      }
  
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
        finished,
        updatedAt,
      };
  
      return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      }).code(200);
    }
  
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
};
  
const deleteBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const index = books.findIndex((book)=> book.id === bookId);

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