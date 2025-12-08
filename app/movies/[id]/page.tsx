"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import Link from "next/link";

interface Movie {
  _id: string;
  title: string;
  posterUrl: string;
  releaseDate: string;
  genres: string[];
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user?: {
    _id: string;
    username: string;
  };
}

export default function MovieDetailsPage() {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:4000/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));

    fetch(`http://localhost:4000/reviews/movie/${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data));

    if (token) {
      fetch(`http://localhost:4000/favorites/${id}/exists`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setIsFavorite(data.isFavorite));
    }
  }, [id, token]);

  const toggleFavorite = async () => {
    if (!token) return alert("Login required");

    const method = isFavorite ? "DELETE" : "POST";
    await fetch(`http://localhost:4000/favorites/${id}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    });

    setIsFavorite(!isFavorite);
  };

  const submitReview = async () => {
    if (!token) return alert("Login required");

    await fetch(`http://localhost:4000/reviews/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment }),
    });

    window.location.reload();
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Movie Header */}
      <div className="flex gap-6">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="rounded-lg w-48"
        />
        <div>
          <h1 className="text-3xl font-bold text-[--color-primary]">
            {movie.title}
          </h1>
          <p className="text-gray-400">{movie.releaseDate}</p>
          <p className="text-gray-400">
            {movie.genres?.join(", ")}
          </p>

          <button
            onClick={toggleFavorite}
            className={`mt-4 px-4 py-2 rounded ${
              isFavorite
                ? "bg-red-500 hover:bg-red-600"
                : "bg-[--color-primary] hover:bg-purple-600"
            }`}
          >
            {isFavorite ? "❤️ Remove Favorite" : "🤍 Add to Favorites"}
          </button>
        </div>
      </div>

      {/* Review List */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev._id} className="bg-[--color-card] p-3 rounded">

                <Link
                href={`/profile/${rev.user?._id}`}
                    className="font-semibold hover:text-[--color-primary] cursor-pointer"
                    >
                    {rev.user?.username || "Unknown User"}
                </Link>

                <p className="text-yellow-400">⭐ {rev.rating}</p>
                <p className="text-gray-300">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Review Form */}
      {user ? (
        <div className="bg-[--color-card] p-4 rounded-lg">
          <h3 className="font-bold mb-3">Add a Review</h3>

          <div className="flex gap-2 mb-2">
            <select
              className="bg-black text-white border border-gray-600 p-2 rounded"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[1,2,3,4,5].map((r) => (
                <option key={r} value={r}>{r} ⭐</option>
              ))}
            </select>
          </div>

          <textarea
            className="w-full bg-black text-white border border-gray-600 p-2 rounded mb-2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a review..."
          />

          <button
            onClick={submitReview}
            className="bg-[--color-primary] px-4 py-2 rounded hover:bg-purple-600"
          >
            Submit Review
          </button>
        </div>
      ) : (
        <p className="text-gray-400">
          <Link href="/login" className="text-[--color-primary] underline">
            Login to write a review
          </Link>
        </p>
      )}
    </div>
  );
}
