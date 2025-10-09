
import { Model, model, Schema } from "mongoose";

const authorsSchema = new Schema({
    authorId: {
        type: Number,

    },
    name: {
        type: String,
    },
    nationality: {
        type: String,
    },
    birthYear: {
        type: Number,
    },
    isActive: {
        type: Boolean,
    }
});

let Authors: Model<any>;
try {
    Authors = model("authors");
} catch (error) {
    Authors = model("authors", authorsSchema)
}

export default Authors;