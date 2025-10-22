export default function SearchBar({ query, setQuery }) {
  return (
    <input
      type="text"
      placeholder="Buscar filme…"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}
