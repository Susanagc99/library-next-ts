import axios from "axios";

// Tipos TypeScript para requests y responses
export interface Author {
    authorId: number;
    name: string;
    nationality: string;
    birthYear: number;
    isActive: boolean;
}

export interface CreateAuthorRequest {
    name: string;
    nationality: string;
    birthYear: number;
    isActive: boolean;
}

export interface UpdateAuthorRequest {
    name?: string;
    nationality?: string;
    birthYear?: number;
    isActive?: boolean;
}

export interface AuthorsResponse {
    ok: true;
    data: Author[];
}

export interface AuthorResponse {
    ok: true;
    message: string;
    createdId?: string;
    updatedId?: string;
    deletedId?: string;
}

export interface ErrorResponse {
    ok: false;
    error: string;
}

// Base URL para las peticiones
const API_BASE_URL = "http://localhost:3000/api";

// Función para obtener todos los autores
export const getAuthors = async (): Promise<Author[]> => {
    try {
        const response = await axios.get<AuthorsResponse>(`${API_BASE_URL}/authors`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching authors:", error);
        throw new Error("Failed to fetch authors");
    }
};

// Función para crear un nuevo autor
export const postAuthor = async (authorData: CreateAuthorRequest): Promise<AuthorResponse> => {
    try {
        const response = await axios.post<AuthorResponse>(`${API_BASE_URL}/authors`, authorData);
        return response.data;
    } catch (error) {
        console.error("Error creating author:", error);
        throw new Error("Failed to create author");
    }
};

// Función para actualizar un autor
export const updateAuthor = async (authorId: number, authorData: UpdateAuthorRequest): Promise<AuthorResponse> => {
    try {
        const response = await axios.put<AuthorResponse>(`${API_BASE_URL}/authors?authorId=${authorId}`, authorData);
        return response.data;
    } catch (error) {
        console.error("Error updating author:", error);
        throw new Error("Failed to update author");
    }
};

// Función para eliminar un autor
export const deleteAuthor = async (authorId: string): Promise<AuthorResponse> => {
    try {
        const response = await axios.delete<AuthorResponse>(`${API_BASE_URL}/authors?authorId=${authorId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting author:", error);
        throw new Error("Failed to delete author");
    }
};
