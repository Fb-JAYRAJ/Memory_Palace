import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  async function fetchRooms() {
    setLoading(true);

    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) toast.error("Failed to load rooms");
    else setRooms(data || []);

    setLoading(false);
  }

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);

      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) toast.error("Failed to load rooms");
      else setRooms(data || []);

      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  async function createRoom(e) {
    e.preventDefault();

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle) return toast.error("Title is required");

    setCreating(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("rooms")
      .insert([
        { title: cleanTitle, description: cleanDescription, user_id: user.id },
      ]);

    setCreating(false);

    if (error) return toast.error("Could not create room");

    toast.success("Room created 🎉");
    setTitle("");
    setDescription("");
    fetchRooms();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    const { error } = await supabase
      .from("rooms")
      .delete()
      .eq("id", deleteTarget);

    if (error) return toast.error("Delete failed");

    toast.success("Room deleted");
    setRooms((prev) => prev.filter((r) => r.id !== deleteTarget));
    setDeleteTarget(null);
  }

  async function saveEdit(id) {
    const cleanTitle = editTitle.trim();
    const cleanDescription = editDescription.trim();

    if (!cleanTitle) return toast.error("Title cannot be empty");

    setSavingEdit(true);

    const { error } = await supabase
      .from("rooms")
      .update({
        title: cleanTitle,
        description: cleanDescription,
      })
      .eq("id", id);

    setSavingEdit(false);

    if (error) return toast.error("Update failed");

    toast.success("Room updated");
    setEditingId(null);
    fetchRooms();
  }

  return (
    <div className="page space-y-6 mt-4">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">Your Memory Rooms</h2>
        <p className="text-gray-600 text-sm mt-1">
          Group topics — then fill them with flashcards.
        </p>
      </div>

      {/* CREATE ROOM */}
      <form
        onSubmit={createRoom}
        className="p-5 rounded-2xl border bg-white shadow-sm space-y-3">
        <h3 className="font-semibold text-lg">Create a new room</h3>

        <div className="h-px bg-gray-200" />

        <input
          className="w-full border p-2 rounded-lg"
          placeholder="Room title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded-lg"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          disabled={creating}
          className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white w-full sm:w-auto disabled:opacity-60">
          {creating ? "Creating..." : "Create Room"}
        </button>
      </form>

      {/* ROOM LIST */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-20 rounded-2xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="p-6 text-center rounded-2xl border bg-white shadow-sm">
            <p className="font-semibold mb-1">No rooms yet</p>
            <p className="text-gray-500 text-sm">
              Create your first one above 👆
            </p>
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className="p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition flex justify-between gap-4">
              {editingId === room.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    className="border p-2 rounded-lg w-full"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />

                  <textarea
                    className="border p-2 rounded-lg w-full"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(room.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg">
                      {savingEdit ? "Saving..." : "Save"}
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 border rounded-lg">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <Link to={`/room/${room.id}`} className="flex-1 block">
                  <h3 className="font-semibold">{room.title}</h3>
                  <p className="text-sm opacity-70">{room.description}</p>
                </Link>
              )}

              {editingId !== room.id && (
                <div className="flex flex-col gap-2 text-sm">
                  <button
                    onClick={() => {
                      setEditingId(room.id);
                      setEditTitle(room.title);
                      setEditDescription(room.description || "");
                    }}
                    className="px-3 py-1 rounded border text-blue-700 bg-blue-50 hover:bg-blue-100">
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => setDeleteTarget(room.id)}
                    className="px-3 py-1 rounded border text-red-700 bg-red-50 hover:bg-red-100">
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white p-5 rounded-xl shadow-lg space-y-4 w-[340px]">
            <h3 className="font-semibold text-lg">Delete this room?</h3>

            <p className="text-sm text-gray-600">
              This will also delete every flashcard inside it.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-1 border rounded">
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-3 py-1 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
