"use client";
import { useAuth } from "../components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Movie {
  movie: any;
  _id: string;
  title: string;
  posterUrl: string;
}

interface Review {
  _id: string;
  movie: Movie;
  rating: number;
  comment: string;
}

export default function ProfilePage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
      return;
    }

    // Fetch favorites
    fetch("http://localhost:4000/favorites/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch((err) => console.error(err));

    // Fetch reviews by user
    fetch(`http://localhost:4000/reviews/user/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error(err));

  }, [user, token, router]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-[--color-primary]">
        {user.username}'s Profile
      </h1>

      <p className="text-gray-400">Role: {user.role}</p>

      {/* Favorites Section */}
      <section>
        <h2 className="text-2xl font-bold mb-3">Favorite Movies</h2>
        {favorites.length === 0 ? (
          <p>No favorites yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {favorites.map((fav) => (
              <div key={fav._id} className="bg-[--color-card] p-3 rounded-lg shadow">
                <img
                  src={fav.movie?.posterUrl}
                  alt={fav.movie?.title}
                  className="rounded-lg w-full"
                />
                <p className="mt-2 text-center">{fav.movie?.title}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reviews Section */}
      <section>
        <h2 className="text-2xl font-bold mb-3">My Reviews</h2>
        {reviews.length === 0 ? (
          <p>You haven't written any reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="bg-[--color-card] p-4 rounded-lg">
                <p className="text-lg font-semibold">{rev.movie?.title}</p>
                <p className="text-yellow-400">⭐ {rev.rating}</p>
                <p className="text-gray-300">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
