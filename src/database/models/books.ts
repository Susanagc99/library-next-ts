
import { model, Model, Schema } from "mongoose";

const booksSchema = new Schema({
    idBook: {
        type: Number,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    authorId: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    publishedYear: {
        type: Number,
        required: true
    },
    availableCopies: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    createdAt: {
        type: Number,
        required: true
    }    
});


// Utiliza un patrón singleton para garantizar que solo se compile una instancia del modelo
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Books: Model<any>;
try {
    // Intenta compilar el modelo solo una vez
    Books = model("books");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
    // Si el modelo ya está compilado, úsalo
    Books = model("books", booksSchema);
}

export default Books;