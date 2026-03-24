import React, { useState } from "react";
import axios from "axios";

const NoteModal = ({ onClose, note, onSave }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [description, setDescription] = useState(note?.description || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please log in");
        return;
      }

      const payload = { title, description };
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (note) {
        const { data } = await axios.put(
          `/api/notes/${note._id}`,
          payload,
          config
        );
        onSave(data);
      } else {
        const { data } = await axios.post("/api/notes", payload, config);
        onSave(data);
      }
    } catch (err) {
      console.error("Note save error:", err);
      setError("Failed to save note");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">
          {note ? "Edit Note" : "Create Note"}
        </h2>

        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Note Description"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full sm:w-auto"
            >
              {note ? "Update" : "Create"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;