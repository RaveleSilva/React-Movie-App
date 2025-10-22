export default function MovieCard({ movie, isFavorite, toggleFavorite }) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : "https://placehold.co/300x450?text=Sem+Imagem"

  return (
    <div className="card">
      <img src={imageUrl} alt={movie.title} />
      <h3>{movie.title}</h3>
      <span className="year">{movie.release_date?.slice(0, 4) || "—"}</span>
      <button className="btn" onClick={() => toggleFavorite(movie)}>
        {isFavorite ? "Remover" : "Favoritar"}
      </button>
    </div>
  )
}
