"use client";

import { useState } from "react";
import Link from "next/link";

interface Movie {
  _id: string;
  title: string;
  posterUrl: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);

    const res = await fetch(
      `http://localhost:4000/movies?search=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    setResults(data);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[--color-primary] mb-6">
        Search Movies
      </h1>

      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Search by movie title..."
          className="w-full bg-black text-white border border-gray-600 rounded px-4 py-3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-[--color-primary] px-6 rounded hover:bg-purple-600"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-400">Searching...</p>}

      {!loading && results.length === 0 && (
        <p className="text-gray-400">No movies found</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {results.map((movie) => (
          <Link key={movie._id} href={`/movies/${movie._id}`}>
            <div className="bg-[--color-card] rounded-lg shadow hover:scale-105 transition cursor-pointer">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="rounded-t-lg w-full"
              />
              <p className="p-2 text-center">{movie.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
