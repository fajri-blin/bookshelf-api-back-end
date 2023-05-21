const {nanoid} = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {};
const getAllBooksHandler = (request, h) => {};
const getBookByIdHandler = (request, h) => {};
const editBookByIdHandler = (request, h) => {};
const deleteBookByIdHandler = (request, h) => {};

module.exports = { addBooksHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };