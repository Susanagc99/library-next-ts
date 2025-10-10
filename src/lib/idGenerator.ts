import Authors from '../database/models/authors';
import Books from '../database/models/books';

export const getNextAuthorId = async (): Promise<number> => {
    const lastAuthor = await Authors.findOne().sort({ authorId: -1 });
    return lastAuthor ? lastAuthor.authorId + 1 : 1;
};

export const getNextBookId = async (): Promise<number> => {
    const lastBook = await Books.findOne().sort({ idBook: -1 });
    return lastBook ? lastBook.idBook + 1 : 1;
};