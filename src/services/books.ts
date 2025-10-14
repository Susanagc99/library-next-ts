import axios from "axios";

// Tipos TypeScript para requests y responses
export interface Book {
    idBook: number;
    title: string;
    authorId: number;
    category: string;
    publishedYear: number;
    availableCopies: number;
    img: string;
    createdAt: number;
}

export interface CreateBookRequest {
    title: string;
    authorId: number;
    category: string;
    publishedYear: number;
    availableCopies: number;
    img: string;
}

export interface UpdateBookRequest {
    title?: string;
    authorId?: number;
    category?: string;
    publishedYear?: number;
    availableCopies?: number;
    img?: string;
}

export interface BooksResponse {
    ok: true;
    data: Book[];
}

export interface BookResponse {
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

// Función para obtener todos los libros
export const getBooks = async (): Promise<Book[]> => {
    try {
        const response = await axios.get<BooksResponse>(`${API_BASE_URL}/books`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching books:", error);
        throw new Error("Failed to fetch books");
    }
};

// Función para crear un nuevo libro
export const postBook = async (bookData: CreateBookRequest): Promise<BookResponse> => {
    try {
        // Agregar createdAt automáticamente
        const bookDataWithTimestamp = {
            ...bookData,
            createdAt: Date.now()
        };

        const response = await axios.post<BookResponse>(`${API_BASE_URL}/books`, bookDataWithTimestamp);
        return response.data;
    } catch (error) {
        console.error("Error creating book:", error);
        throw new Error("Failed to create book");
    }
};

// Función para actualizar un libro
export const updateBook = async (bookId: string, bookData: UpdateBookRequest): Promise<BookResponse> => {
    try {
        const response = await axios.put<BookResponse>(`${API_BASE_URL}/books`, {
            id: bookId,
            ...bookData
        });
        return response.data;
    } catch (error) {
        console.error("Error updating book:", error);
        throw new Error("Failed to update book");
    }
};

// Función para eliminar un libro
export const deleteBook = async (bookId: string): Promise<BookResponse> => {
    try {
        console.log("=== DELETE BOOK SERVICE DEBUG ===");
        console.log("Book ID to delete:", bookId);
        console.log("Type of bookId:", typeof bookId);
        console.log("URL:", `${API_BASE_URL}/books?id=${bookId}`);
        
        const response = await axios.delete<BookResponse>(`${API_BASE_URL}/books?id=${bookId}`);
        console.log("Delete response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting book:", error);
        if (axios.isAxiosError(error)) {
            console.error("Response data:", error.response?.data);
            console.error("Response status:", error.response?.status);
        }
        throw new Error("Failed to delete book");
    }
};
