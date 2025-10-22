import { useEffect, useState } from "react"
import MovieCard from "./components/MovieCard"
import SearchBar from "./components/SearchBar"
import "./styles.css"

export default function App() {
  const [query, setQuery] = useState("")
  const [movies, setMovies] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // carregar favoritos 
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || []
    setFavorites(saved)
  }, [])

  // salvar favoritos
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (movie) => {
    setFavorites((prev) =>
      prev.find((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    )
  }

  // buscar filmes
  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      setLoading(true)
      setError("")
      try {
        const key = import.meta.env.VITE_TMDB_API_KEY
        let url = ""

        if (query) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=pt-BR&query=${encodeURIComponent(
            query
          )}`
        } else {
          url = `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=pt-BR&page=1`
        }

        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error("Erro ao buscar filmes")
        const data = await res.json()
        setMovies(data.results || [])
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Erro inesperado")
      } finally {
        setLoading(false)
      }
    }

    const t = setTimeout(load, 500)
    return () => {
      clearTimeout(t)
      controller.abort()
    }
  }, [query])

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <div className="brand">
            <span className="brand-dot" />
            Movie Finder
          </div>
        </div>
      </header>

      <main className="container">
        <div className="search">
          <SearchBar query={query} setQuery={setQuery} />
        </div>

        {error && <p className="status error">❌ {error}</p>}
        {loading && <p className="status">Carregando…</p>}

        {!loading && !query && (
          <p className="status" style={{ marginTop: "10px" }}>
            Filmes populares 🔥
          </p>
        )}

        <div className="grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favorites.some((f) => f.id === movie.id)}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </main>
    </>
  )
}
