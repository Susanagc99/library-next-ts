import type { NextApiRequest, NextApiResponse } from "next";
import dbConnection from "../../lib/db";
import Authors from "../../database/models/authors"

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
type ErrorResponse = { ok: true; error: string };

type ResponseBody = 
    | GetResponse
    | PostResponse
    | PutResponse
    | DeleteResponse
    | ErrorResponse

    const allowed = [ 'GET', 'POST', 'PUT', 'DELETE' ];

    export default async function handler(
        req: NextApiRequest,
        res: NextApiResponse<ResponseBody>,
    ) {
        
        try {

            if (!allowed.includes(req.method!)){
                res.setHeader("Allow", allowed);
                return res.status(405).end(`Method ${req.method} Not Allowed`)
            }

            dbConnection()

            if (req.method === )
        }
    }

