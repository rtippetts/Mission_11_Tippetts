import { useEffect, useState } from 'react';
import { Book } from './types/Book';
import { useNavigate } from 'react-router-dom';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const navigate = useNavigate();

    // Sorting states
    const [ascending, setAscending] = useState<boolean>(true);
    const [enableSorting, setEnableSorting] = useState<boolean>(true);

    useEffect(() => {
        const fetchBooks = async () => {
            const categoryParams = selectedCategories
                .map((cat) => `bookTypes=${encodeURIComponent(cat)}`)
                .join('&');

            const response = await fetch(`https://localhost:5000/finalexam/AllBooks?pageHowMany=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`, 
            {
                credentials: 'include',
            });
            const data = await response.json();
            setBooks(data.books);
            setTotalItems(data.totalNumBooks);
            setTotalPages(Math.ceil(totalItems / pageSize));
        };
        
        fetchBooks();
    }, [pageSize, pageNum, selectedCategories]);

    // Apply sorting only if sorting is enabled
    const sortedBooks = enableSorting 
        ? [...books].sort((a, b) => ascending ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title))
        : books;

    return (
        <>
            {sortedBooks.map((b) => {
                const colors = ["bg-primary", "bg-success", "bg-warning", "bg-info", "bg-secondary"];
                const randomColor = colors[Math.floor(Math.random() * colors.length)]; // Random color per book

                return (
                    <div id="projectCard" className={`card ${randomColor} rounded-pill`} key={b.bookID}>

                        <h3 className="card-title">{b.title}</h3>
                        <div className="card-body">
                            <ul className="list-unstyled">
                                <li><strong>Author:</strong> {b.author}</li>
                                <li><strong>Publisher:</strong> {b.publisher}</li>
                                <li><strong>ISBN:</strong> {b.isbn}</li>
                                <li><strong>Classification/Category:</strong> {b.classification}/{b.category}</li>
                                <li><strong>Number of Pages:</strong> {b.pageCount}</li>
                                <li><strong>Price:</strong> {b.price}</li>

                                <button className="btn btn-success" onClick={() => navigate(`/purchase/${b.title}/${b.price}/${b.bookID}`)} >Purchase</button>
                            </ul>    
                        </div>
                    </div>
                );
            })}

            {/* Pagination Controls */}
            <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>Previous</button>
            {[...Array(totalPages)].map((_, i) => (
                <button key={i + 1} onClick={() => setPageNum(i + 1)} disabled={pageNum === i + 1}>
                    {i + 1}
                </button>
            ))}
            <button disabled={pageNum === totalPages} onClick={() => setPageNum(pageNum + 1)}>Next</button>

            <br />
            <label>
                Results per page:
                <select 
                    value={pageSize} 
                    onChange={(b) => {
                        setPageSize(Number(b.target.value));
                        setPageNum(1);
                    }}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </label>

            {/* Sorting Controls */}
            <br />
            <label>
                Sorting:
                <button onClick={() => setEnableSorting(!enableSorting)}>
                    {enableSorting ? 'Disable Sorting' : 'Enable Sorting'}
                </button>
            </label>
            {enableSorting && (
                <button onClick={() => setAscending(!ascending)}>
                    {ascending ? 'Ascending' : 'Descending'}
                </button>
            )}
        </>
    );
}

export default BookList;
