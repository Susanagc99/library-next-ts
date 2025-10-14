import { model, Model, Schema } from "mongoose";

const authorsSchema = new Schema({
    authorId: {
        type: Number,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    birthYear: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    }
});

// Utiliza un patrón singleton para garantizar que solo se compile una instancia del modelo
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Authors: Model<any>;
try {
    // Intenta compilar el modelo solo una vez
    Authors = model("authors");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
    // Si el modelo ya está compilado, úsalo
    Authors = model("authors", authorsSchema);
}

export default Authors;


