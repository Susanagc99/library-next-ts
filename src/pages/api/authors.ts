import type { NextApiRequest, NextApiResponse } from "next";
import dbConnection from "../../lib/db";
import Authors from "../../database/models/authors"

interface Author {
    authorId: number;
    name: string;
    nationality: string,
    birthYear: 
}