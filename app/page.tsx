"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./components/AuthProvider";
import Link from "next/link";

interface Movie {
  _id: string;
  title: string;
  posterUrl: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  movie: Movie;
  user?: { username: string };
}

export default function HomePage() {
  const { user } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Fetch recent movies
    fetch("http://localhost:4000/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data.slice(0, 4)));

    // Fetch recent reviews
    fetch("http://localhost:4000/reviews/recent")
      .then((res) => res.json())
      .then((data) => setRecentReviews(data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-10">
      {/* Hero Section */}
      <section className="text-center py-10">
        <h1 className="text-4xl font-bold text-[--color-primary]">
          🎬 Movie Review Hub
        </h1>
        <p className="text-gray-300 mt-2">
          Discover movies, share thoughts, explore reviews
        </p>

        {!user && (
          <Link
            href="/login"
            className="mt-6 inline-block bg-[--color-primary] px-6 py-3 rounded-md text-white hover:bg-purple-600"
          >
            Sign In to Get Started
          </Link>
        )}

        {user && (
          <p className="mt-4 text-gray-400">
            Welcome back, <span className="text-white font-bold">{user.username}</span>!
          </p>
        )}
      </section>

      {/* Recent Movies */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-white">Recent Movies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Link key={movie._id} href={`/movies/${movie._id}`}>
              <div className="bg-[--color-card] p-3 rounded-lg hover:scale-105 transition cursor-pointer">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="rounded-lg w-full"
                />
                <p className="mt-2 text-center">{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

{/* Recent Reviews */}
<section>
  <h2 className="text-2xl font-bold mb-4 text-white">Recent Reviews</h2>

  {recentReviews.length === 0 ? (
    <p className="text-gray-400">No reviews yet.</p>
  ) : (
    <div className="space-y-4">
      {recentReviews
        .filter((rev) => rev.movie)
        .map((rev) => (
          <div
            key={rev._id}
            className="bg-[--color-card] p-4 rounded-lg border-l-4 border-[--color-primary]"
          >
            <Link href={`/movies/${rev.movie._id}`}>
              <p className="text-lg font-semibold hover:text-[--color-primary] cursor-pointer">
                {rev.movie.title}
              </p>
            </Link>

            <p className="text-yellow-400">⭐ {rev.rating}</p>
            <p className="italic text-gray-300">"{rev.comment}"</p>

            {rev.user && (
              <p className="mt-2 text-sm text-gray-400">
                — {rev.user.username}
              </p>
            )}
          </div>
        ))}
    </div>
  )}
</section>

    </div>
  );
}
