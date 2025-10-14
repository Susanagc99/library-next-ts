import type { NextApiRequest, NextApiResponse } from "next";
import dbConnection from "../../lib/db";
import Authors from "../../database/models/authors"
import { getNextAuthorId } from "../../lib/idGenerator"

interface Author {
    authorId: number;
    name: string;
    nationality: string;
    birthYear: number;
    isActive: boolean;
}

type GetResponse = { ok: true; data: Author[] };
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
            const data = await Authors.find()

            res.status(200).json({
                ok: true,
                data: data as Author[]
            });
        }

        if (req.method === 'POST') {

            const {
                name,
                nationality,
                birthYear,
                isActive
            } = req.body

            // Generar authorId automáticamente
            const authorId = await getNextAuthorId();

            const newAuthor = new Authors({
                authorId,
                name,
                nationality,
                birthYear,
                isActive
            })

            const savedAuthor = await newAuthor.save()

            console.log(savedAuthor)

            return res.status(201).json({
                ok: true,
                message: "author saved",
                createdId: savedAuthor.authorId
            });
        }

        if (req.method === 'PUT') {
            const { authorId } = req.query;
            const {
                name,
                nationality,
                birthYear,
                isActive
            } = req.body


            // LOGS PARA DEBUGGEAR
            console.log("=== DEBUG PUT ===");
            console.log("authorId from query:", authorId);
            console.log("authorId as number:", Number(authorId));
            console.log("Body data:", { name, nationality, birthYear, isActive });

            // Validar que authorId existe
            if (!authorId) {
                return res.status(400).json({
                    ok: false,
                    error: "authorId is required in query params"
                });
            }



            try {
                //LOG PARA VER SI ENCUENTRA EL AUTOR
                const existingAuthor = await Authors.findOne({ authorId: Number(authorId) });
                console.log("Author found:", existingAuthor);

                // Después de la validación de authorId, agregar:
                if (!existingAuthor) {
                    return res.status(404).json({
                        ok: false,
                        error: "Author with authorId not found"
                    });
                }


                const authorUpdate = await Authors.findOneAndUpdate(
                    { authorId: Number(authorId) },
                    { name, nationality, birthYear, isActive },
                    { new: true },
                );

                console.log("Author updated", authorUpdate);

                return res
                    .status(200)
                    .json({
                        ok: true,
                        message: "author updated",
                        updatedId: authorUpdate.authorId
                    });

            } catch (error) {
                console.error("Update error:", error);
                return res.status(400).json({
                    ok: false,
                    error: "Failed to update author"
                });
            }
        }

        if (req.method === 'DELETE') {
            const { authorId } = req.query;
            console.log("=== DELETE AUTHOR DEBUG ===");
            console.log("authorId from query:", authorId);

            // Validar que authorId existe
            if (!authorId) {
                return res.status(400).json({
                    ok: false,
                    error: "authorId is required in query params"
                });
            }

            try {
                // Buscar el autor por authorId (no por _id)
                const author = await Authors.findOne({ authorId: Number(authorId) });
                console.log("Author found:", author);

                if (!author) {
                    console.log("Author not found");
                    return res.status(404).json({
                        ok: false,
                        error: "Author not found"
                    });
                }

                console.log("Deleting author with _id:", author._id);
                const deletedAuthor = await Authors.findByIdAndDelete(author._id);
                console.log("Author deleted successfully:", deletedAuthor);

                return res.status(200).json({
                    ok: true,
                    message: "author deleted",
                    deletedId: `${author.authorId}`
                });
            } catch (deleteError) {
                console.error("Error in delete operation:", deleteError);
                return res.status(500).json({
                    ok: false,
                    error: "Failed to delete author"
                });
            }
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, error: "Internal server error" });
    }
}

