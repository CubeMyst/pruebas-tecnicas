import { useState } from 'react';
import books from './api/books.json';
import Card from './components/Card';
import Navbar from './components/Navbar';
import type { Book } from './types/types.d';
import MultiRangeSlider, { type ChangeResult } from 'multi-range-slider-react';

export default function App() {
	const [bookList, setBookList] = useState<Array<Book>>([]);
	const [isSelect, setIsSelect] = useState<boolean>(false);
	const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
	const [minPages, setMinPages] = useState<number>(0);
	const [maxPages, setMaxPages] = useState<number>(0);

	const uniqueGenres = Array.from(new Set(books.library.map(({ book }) => book.genre)));

	const filteredBooks = selectedGenre ? books.library.filter(({ book }) => book.genre === selectedGenre) : books.library;

	const handlePagesChange = (event: ChangeResult) => {
		setMinPages(event.minValue);
		setMaxPages(event.maxValue);
	}

	const handlerGenreFilter = (genre: string | null) => {
		setSelectedGenre(genre);
	};

	const handlerAddToList = (book: Book) => {
		if (!bookList.some((b) => b.ISBN === book.ISBN)) {
			setBookList(prevList => [...prevList, book]);
			setIsSelect(!isSelect);
		}
	};

	const handlerRemovetoList = (book: Book) => {
		const updateList = bookList.filter(b => b.ISBN !== book.ISBN);
		setBookList(updateList);
	};

	const filteredBooksByPages = filteredBooks.filter(({ book }) => {
		if (minPages && maxPages) {
			return book.pages >= minPages && book.pages <= maxPages;
		} else if (minPages) {
			return book.pages >= minPages;
		} else if (maxPages) {
			return book.pages <= maxPages;
		}
		return true;
	})

	const min = Math.min(...filteredBooks.map(({ book }) => book.pages));
	const max = Math.max(...filteredBooks.map(({ book }) => book.pages));

	return (
		<main className='min-h-screen max-w-screen bg-slate-950 overflow-hidden pb-3'>
			<header>
				<Navbar />
			</header>
			<section className='flex flex-1 gap-8 px-12'>
				<div className='w-full flex flex-col gap-2'>
					<h1 className='flex gap-3 text-4xl'>
						Books <span className='flex justify-center items-center h-5 w-5 p-5 rounded-full text-lg bg-slate-900'>{filteredBooksByPages.length}</span>
					</h1>

					<section className='flex'>
						<div className='w-1/2 flex gap-2 py-21'>
							<button
								className={selectedGenre === null ? 'bg-blue-500 text-white btn btn-sm' : 'btn btn-sm btn-ghost'}
								onClick={() => handlerGenreFilter(null)}
							>
								All
							</button>
							{uniqueGenres.map((genre) => (
								<button
									key={genre}
									className={selectedGenre === genre ? 'bg-blue-500 text-white btn btn-sm' : 'btn btn-sm btn-ghost'}
									onClick={() => handlerGenreFilter(genre)}
								>
									{genre}
								</button>
							))}
						</div>
					</section>

					{
						max !== min && (
							<div className='w-full flex justify-center items-center py-2 gap-3'>
								<label>
									Pages
								</label>
								<MultiRangeSlider
									min={min}
									max={max}
									minValue={min}
									maxValue={max}
									label={false}
									ruler={false}
									onInput={(e) => handlePagesChange(e)}
									barLeftColor='#0F172A'
									barRightColor='#0F172A'
									barInnerColor='#3B82F6'
									thumbLeftColor='#ffffff'
									thumbRightColor='#ffffff'
									className='rounded-full'
									style={
										{
											boxShadow: 'none',
											padding: '15px 10px',
											border: 'none',
											width: '100%',
										}
									}
								/>
							</div>
						)
					}

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
					 xl:grid-cols-5 gap-8'>
						{
							filteredBooksByPages.map(({ book }: { book: Book }) => {
								const { ISBN, title, cover, synopsis, genre, pages } = book;
								return (
									<Card
										key={ISBN}
										cover={cover}
										title={title}
										synopsis={synopsis}
										pages={pages}
										genre={genre}
										handlerClick={() => handlerAddToList(book)}
									/>
								);
							})
						}
					</div>
				</div>

				<div className='w-[50em] h-full rounded p-2 bg-slate-900 mt-2 transition-opacity delay-300'>
					{
						bookList.length !== 0 && (
							<h1 className='flex gap-3 text-2xl mb-2 justify-start items-center'>
								Your List
								<span className='flex justify-center items-center h-4 w-4 p-4 rounded-full text-lg bg-slate-800'>
									{bookList.length}
								</span>
							</h1>
						)
					}
					<div className={`grid w-full ${bookList.length !== 0 && 'sm:grid-cols-2 lg:grid-cols-3'} gap-2 place-items-center`.trim()}>
						{
							bookList.length !== 0 ? bookList.map((book) => (
								<Card
									key={book.ISBN}
									cover={book.cover}
									handlerClick={() => handlerRemovetoList(book)}
								/>
							)) : (
								<div className='w-full h-full flex justify-center'>
									<h1 className='font-bold'>Nothing Here!!!</h1>
								</div>
							)
						}
					</div>
				</div>
			</section>
		</main>
	);
}
