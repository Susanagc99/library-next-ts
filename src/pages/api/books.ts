import type { NextApiRequest, NextApiResponse } from "next";
import dbConnection from "../../lib/db";
import Books from "../../database/models/books"
import { getNextBookId } from "../../lib/idGenerator"

interface Book {
    idBook: number;
    title: string,
    authorId: number,
    category: string;
    publishedYear: number,
    availableCopies: number,
    img: string,
    createdAt: number;
}    

type GetResponse = { ok: true; data: Book[] };
type PostResponse = { ok: true; message: string; createdId?: string };
type PutResponse = { ok: true; message: string; updatedId?: string };
type DeleteResponse = { ok: true; message: string; deletedId?: string };
type ErrorResponse = { ok: false; error: string };

type ResponseBody =
    | GetResponse
    | PostResponse
    | PutResponse
    | DeleteResponse
    | ErrorResponse

const allowed = ['GET', 'POST', 'PUT', 'DELETE'];

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseBody>,
) {

    try {

        if (!allowed.includes(req.method!)) {
            res.setHeader("Allow", allowed);
            return res.status(405).end(`Method ${req.method} Not Allowed`)
        }

        await dbConnection()

        if (req.method === 'GET') {
            const data = await Books.find()

            res.status(200).json({
                ok: true,
                data: data as Book[]
            });
        }

        if (req.method === 'POST') {

            const {  
                title,
                authorId,
                category,
                publishedYear,
                availableCopies,
                img,
                createdAt
            } = req.body

            // Generar idBook automáticamente
            const idBook = await getNextBookId();

            const newBook = new Books({
                idBook,  
                title,
                authorId,
                category,
                publishedYear,
                availableCopies,
                img,
                createdAt
            })

            const savedBook = await newBook.save()

            console.log(savedBook)

            return res.status(201).json({
                ok: true,
                message: "book saved",
                createdId: savedBook.id
            });
        }

        if (req.method === 'PUT') { 
            const { id } = req.body;
            const {
                title,
                authorId,
                category,
                publishedYear,
                availableCopies,
                img
            } = req.body;

            console.log("=== UPDATE BOOK DEBUG ===");
            console.log("id from body:", id);
            console.log("Update data:", { title, authorId, category, publishedYear, availableCopies, img });

            // Validar que id existe
            if (!id) {
                return res.status(400).json({
                    ok: false,
                    error: "id is required in body"
                });
            }

            try { 
                // Buscar el libro por idBook
                const existingBook = await Books.findOne({ idBook: Number(id) });
                console.log("Book found:", existingBook);

                if (!existingBook) {
                    return res.status(404).json({ 
                        ok: false, 
                        error: "Book not found" 
                    });
                }

                // Actualizar solo los campos que se envían
                const updateData: any = {};
                if (title !== undefined) updateData.title = title;
                if (authorId !== undefined) updateData.authorId = authorId;
                if (category !== undefined) updateData.category = category;
                if (publishedYear !== undefined) updateData.publishedYear = publishedYear;
                if (availableCopies !== undefined) updateData.availableCopies = availableCopies;
                if (img !== undefined) updateData.img = img;

                const bookUpdate = await Books.findByIdAndUpdate(
                    existingBook._id, 
                    updateData,
                    { new: true, runValidators: true }
                );

                if (!bookUpdate) {
                    return res.status(404).json({ 
                        ok: false, 
                        error: "Book not found during update" 
                    });
                }

                console.log("Book updated successfully:", bookUpdate);

                return res.status(200).json({
                    ok: true,
                    message: "book updated",
                    updatedId: `${bookUpdate.idBook}`
                });
                
            } catch (error) {
                console.error("Update error:", error);
                return res.status(400).json({ 
                    ok: false, 
                    error: "Failed to update book" 
                });
            }
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            console.log("=== DELETE BOOK DEBUG ===");
            console.log("Query id:", id);
            console.log("Type of id:", typeof id);

            // Validar que id existe
            if (!id) {
                return res.status(400).json({
                    ok: false,
                    error: "id is required in query params"
                });
            }

            try {
                // Buscar el libro por idBook
                const book = await Books.findOne({ idBook: Number(id) });
                console.log("Book found:", book);

                if (!book) {
                    console.log("Book not found");
                    return res.status(404).json({ 
                        ok: false, 
                        error: "Book not found" 
                    });
                }

                console.log("Deleting book with _id:", book._id);
                const deletedBook = await Books.findByIdAndDelete(book._id);
                console.log("Book deleted successfully:", deletedBook);
            
                return res.status(200).json({ 
                    ok: true, 
                    message: "book deleted", 
                    deletedId: `${book.idBook}`
                });    
            } catch (deleteError) {
                console.error("Error in delete operation:", deleteError);
                return res.status(500).json({ 
                    ok: false, 
                    error: "Failed to delete book"
                });
            }
        }

    } catch (err) {
            console.log(err);
            res.status(500).json({ ok: false, error: "Internal server error" });
    }
}

