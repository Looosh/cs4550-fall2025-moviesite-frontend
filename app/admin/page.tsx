"use client";
import { useAuth } from "../components/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    fetch("http://localhost:4000/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(console.error);
  }, [user, token, router]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-[--color-primary]">Admin Dashboard</h1>

      <div className="bg-[--color-card] p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">All Users</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400">
              <th className="py-2">Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-gray-700">
                <td className="py-2">{u.username}</td>
                <td>{u.email}</td>
                <td>
                    <select
                        value={u.role}
                        onChange={async (e) => {
                        const newRole = e.target.value;

                        await fetch(`http://localhost:4000/users/${u._id}/role`, {
                            method: "PUT",
                            headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ role: newRole }),
                        })
                            .then((res) => res.json())
                            .then(() => {
                            // Immediately update UI state
                            setUsers((prev) =>
                                prev.map((userObj) =>
                                userObj._id === u._id ? { ...userObj, role: newRole } : userObj
                                )
                            );
                            });
                        }}
                        className="bg-black border border-gray-600 rounded text-white p-1"
                    >
                        <option value="viewer">Viewer</option>
                        <option value="critic">Critic</option>
                        <option value="admin">Admin</option>
                    </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
