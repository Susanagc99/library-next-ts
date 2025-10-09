
import { model, Model, Schema } from "mongoose";

const booksSchema = new Schema({
    idBook: {
        type: Number,
    },
    title: {
        type: String,
    }
});

let Books: Model<any>;

try {
    Books = model("books");
} catch (error) {
    Books = model("books", booksSchema);
}

export default Books;