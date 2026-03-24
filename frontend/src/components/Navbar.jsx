import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const delay = setTimeout(() => {
      navigate(search.trim() ? `/?search=${encodeURIComponent(search)}` : "/");
    }, 500);

    return () => clearTimeout(delay);
  }, [search, navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setSearch("");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 p-4 text-white shadow-lg">
      <div className="container mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="text-lg font-semibold">
          Notes App
        </Link>

        {user && (
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 w-full md:w-auto">
            <div className="w-full md:w-72">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between md:justify-normal gap-3">
              <span className="text-gray-300 font-medium text-sm md:text-base">
                {user.username}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;