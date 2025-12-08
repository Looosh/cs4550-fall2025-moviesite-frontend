"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
}

interface User {
  username: string;
  role: string;
}

export default function PublicProfile() {
  const { id } = useParams(); // user ID from URL
  const [profile, setProfile] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    if (!id) return;

    // Fetch user public info
    fetch(`http://localhost:4000/users/${id}`)
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(console.error);

    // Fetch their reviews
    fetch(`http://localhost:4000/reviews/user/${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(console.error);

    // Fetch their favorites
    fetch(`http://localhost:4000/favorites/user/${id}`)
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch(console.error);

  }, [id]);

  if (!profile)
    return <p className="text-center mt-10 text-gray-300">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-10">
      {/* Profile Header */}
      <div className="bg-[--color-card] p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[--color-primary]">{profile.username}</h1>
        <p className="text-gray-400">Role: {profile.role}</p>
      </div>

      {/* Their Reviews */}
      <section>
        <h2 className="text-2xl font-bold mb-3">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-400">{profile.username} hasn’t reviewed anything yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews
                .filter((rev) => rev.movie)
                .map((rev) => (
                <div key={rev._id} className="bg-[--color-card] p-4 rounded-lg">
                    <Link href={`/movies/${rev.movie._id}`}>
                    <p className="text-lg font-semibold hover:text-[--color-primary] cursor-pointer">
                        {rev.movie.title}
                    </p>
                    </Link>
                    <p className="text-yellow-400">⭐ {rev.rating}</p>
                    <p className="text-gray-300">{rev.comment}</p>
                </div>
                ))}
            </div>
        )}
      </section>

      {/* Their Favorites */}
        <section>
        <h2 className="text-2xl font-bold mb-3">Favorite Movies</h2>
        {favorites.length === 0 ? (
            <p className="text-gray-400">{profile.username} has no favorites yet.</p>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {favorites
                .filter((fav) => fav && fav._id) // 🛡 Prevent runtime errors
                .map((fav) => (
                <Link key={fav._id} href={`/movies/${fav._id}`}>
                    <img
                    src={fav.posterUrl}
                    alt={fav.title}
                    className="rounded-lg hover:scale-105 transition"
                    />
                </Link>
                ))}
            </div>
        )}
        </section>
    </div>
  );
}
