import { Book } from "../types/Book";

interface FetchBooksResponse {
    books: Book[];
    totalNumBooks: number;
}

const API_URL = 'https://bezosbaze-tippetts-backend-efd4cwcsehdmcth4.eastus-01.azurewebsites.net/bezos'

export const fetchBooks = async (
    pageSize: number,
    pageNum: number,
    selectedCategories: string[]
): Promise<FetchBooksResponse> => {

    try{
        const categoryParams = selectedCategories
        .map((cat) => `bookTypes=${encodeURIComponent(cat)}`)
        .join('&');
    
    const response = await fetch(`${API_URL}/AllBooks?pageHowMany=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`, 
    {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch books')
    }

    return await response.json();
    
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }

};

export const addBook = async (newBook: Book): Promise<Book> => {
    try {
        const response = await fetch(`${API_URL}/AddBook?`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: 
            JSON.stringify(newBook)
        });

        if (!response.ok) {
            throw new Error('Failed to add book');

        }
        return await response.json();
    } catch (error) {
        console.error('Error adding project', error);
        throw error;
    }
};

export const updateBook = async (
    bookID: number, 
    updatedBook: Book
  ): Promise<Book> => {
    try {
        const response = await fetch(`${API_URL}/UpdateBook/${bookID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: 
            JSON.stringify(updatedBook)
        });

        return await response.json();

    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
};

export const deleteBook = async (bookID: number): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/DeleteBook/${bookID}`,
            {
                method: 'DELETE'
            }
        );

        if (!response.ok) {
            throw new Error('Failed to delete project');
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
};

