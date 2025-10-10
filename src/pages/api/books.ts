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

        dbConnection()

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
            const {
                id,
                idBook,  
                title,
                authorId,
                category,
                publishedYear,
                availableCopies,
                img,
                createdAt
            } = req.body


            try { 
                const bookUpdate = await Books.findByIdAndUpdate(
                    id, { 
                        idBook,  
                        title,
                        authorId,
                        category,
                        publishedYear,
                        availableCopies,
                        img,
                        createdAt 
                    },
                    { new: true },
                );

                //runvalidator para validar los datos
                if (!bookUpdate) {
                    return res.status(404).json({ 
                        ok: false, 
                        error: "book not found" 
                    });
                }

                console.log(bookUpdate);

                return res
                .status(200)
                .json({
                    ok: true,
                    message: "book updted",
                    updatedId: idBook
                });
                
            } catch (error) {
                console.error("Update error:", error);
                return res.status(400).json({ 
                    ok: false, 
                    error: "Failed to update author" 
                });
            }
        }

        if (req.method === 'DELETE' ) {
            const { id } = req.query;
            console.log(id);

            await Books.findByIdAndDelete(id);
        
            res
                .status(200)
                .json({ ok: true, message: "book deleted", deletedId: `${id}`});    
        }

    } catch (err) {
            console.log(err);
            res.status(500).json({ ok: false, error: "Internal server error" });
    }
}

