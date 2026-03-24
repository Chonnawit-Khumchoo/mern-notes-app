import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import NoteModal from "./NoteModal";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authentication token found. Please log in");
          setNotes([]);
          return;
        }

        const searchParams = new URLSearchParams(location.search);
        const search = searchParams.get("search") || "";

        const { data } = await axios.get("/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredNotes = search
          ? data.filter(
              (note) =>
                (note.title || "").toLowerCase().includes(search.toLowerCase()) ||
                (note.description || "")
                  .toLowerCase()
                  .includes(search.toLowerCase())
            )
          : data;

        setNotes(filteredNotes);
        setError("");
      } catch (err) {
        console.error("Failed to fetch notes:", err);
        setError("Failed to fetch notes");
      }
    };

    fetchNotes();
  }, [location.search]);

  const handleEdit = (note) => {
    setEditNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = (newNote) => {
    if (editNote) {
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === newNote._id ? newNote : note))
      );
    } else {
      setNotes((prevNotes) => [newNote, ...prevNotes]);
    }

    setEditNote(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please log in");
        return;
      }

      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Failed to delete note:", err);
      setError("Failed to delete note");
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 min-h-screen bg-gray-500">
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {isModalOpen && (
        <NoteModal
          key={editNote ? editNote._id : "new"}
          onClose={() => {
            setIsModalOpen(false);
            setEditNote(null);
          }}
          note={editNote}
          onSave={handleSaveNote}
        />
      )}

      <button
        onClick={() => {
          setEditNote(null);
          setIsModalOpen(true);
        }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 bg-gray-800 text-white text-3xl rounded-full shadow-lg hover:bg-gray-900 flex items-center justify-center"
      >
        <span className="flex items-center justify-center h-full w-full pb-1">
          +
        </span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div
            className="bg-gray-800 p-4 rounded-lg shadow-md warp-break-word"
            key={note._id}
          >
            <h3 className="text-lg font-medium text-white mb-2">{note.title}</h3>

            <p className="text-gray-300 mb-4 whitespace-pre-wrap wrap-break-word">
              {note.description}
            </p>

            <p className="text-sm text-gray-400 mb-4">
              {note.updatedAt
                ? new Date(note.updatedAt).toLocaleString()
                : "No update time"}
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => handleEdit(note)}
                className="bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700 w-full sm:w-auto"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(note._id)}
                className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 w-full sm:w-auto"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;