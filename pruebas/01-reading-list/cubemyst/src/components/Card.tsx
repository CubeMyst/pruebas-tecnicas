interface CardProps {
	cover: string,
	title?: string,
	synopsis?: string,
	genre?: string,
	pages?: number,
	handlerClick: () => void
}

export default function Card({ cover, title, synopsis, genre, pages, handlerClick }: CardProps) {
	return (
		<button id="btnModal" className={`dropdown dropdown-hover bg-transparent w-[9.5rem] h-full rounded-md transition-shadow delay-200 ease-in-out hover:shadow-xl`} onClick={() => handlerClick()}>
			<label>
				<img src={cover} alt={`${title} cover`} className={`${!title && 'hover:bg-red-600 hover:bg-opacity-50'} aspect-[2/3] w-full object-cover rounded-md`.trimStart()} />
			</label>

			{title && (
				<div tabIndex={0} className="dropdown-content rounded-sm flex flex-col justify-between -left-0 -top-0 z-[1] transition-all delay-300 ease-in-out bg-opacity-90 card w-full p-2 text-slate-100 shadow bg-base-200 h-full">
					<h2 className="text-left text-lg font-bold pb-2">{title}</h2>
					<p className="text-left text-sm">{synopsis}</p>
					<div className="flex mt-2 justify-between items-center gap-2">
						<div className="badge badge-outline text-sm">{pages}</div>
						<div className={`badge badge-outline ${genre?.toLowerCase() === "terror" && "badge-error"} ${genre?.toLowerCase() === "fantasía" && "badge-primary"} ${genre?.toLowerCase() === "ciencia ficción" && "badge-secondary py-5 text-sm"} ${genre?.toLowerCase() === "zombies" && "badge-accent"}`}>{genre}</div>
					</div>
				</div>
			)}
		</button>
	);
}
