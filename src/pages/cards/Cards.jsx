import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";

export default function Cards() {
  const { id } = useParams();

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [clickState, setClickState] = useState({});

  // create inputs
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [hint, setHint] = useState("");
  const [creating, setCreating] = useState(false);

  // flip + hint
  const [flipped, setFlipped] = useState({});
  const [showHint, setShowHint] = useState({});

  // editing
  const [editingCard, setEditingCard] = useState(null);
  const [editFront, setEditFront] = useState("");
  const [editBack, setEditBack] = useState("");
  const [editHint, setEditHint] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function fetchCards() {
    setLoading(true);

    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("room_id", id)
      .order("created_at", { ascending: false });

    if (error) toast.error("Failed to load cards");
    else setCards(data || []);

    setLoading(false);
  }

  useEffect(() => {
    let active = true; // safeguard in case component unmounts

    async function load() {
      setLoading(true);

      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("room_id", id)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) toast.error("Failed to load cards");
      else setCards(data || []);

      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, [id]);

  async function addCard(e) {
    e.preventDefault();

    const cleanFront = front.trim();
    const cleanBack = back.trim();
    const cleanHint = hint.trim();

    if (!cleanFront || !cleanBack)
      return toast.error("Question AND Answer are required.");

    setCreating(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCreating(false);
      return toast.error("Please log in again");
    }

    const { error } = await supabase.from("cards").insert([
      {
        room_id: id,
        front: cleanFront,
        back: cleanBack,
        hint: cleanHint,
        user_id: user.id,
      },
    ]);

    setCreating(false);

    if (error) return toast.error("Could not create card");

    toast.success("Card added");
    setFront("");
    setBack("");
    setHint("");
    fetchCards();
  }

  async function deleteCard() {
    if (!deleteTarget) return;

    const { error } = await supabase
      .from("cards")
      .delete()
      .eq("id", deleteTarget);

    if (error) return toast.error("Delete failed");

    toast.success("Card deleted");
    setCards((prev) => prev.filter((c) => c.id !== deleteTarget));
    setDeleteTarget(null);
  }

  async function saveEdit(cardId) {
    const cleanFront = editFront.trim();
    const cleanBack = editBack.trim();
    const cleanHint = editHint.trim();

    if (!cleanFront || !cleanBack)
      return toast.error("Question and Answer cannot be empty");

    setSavingEdit(true);

    const { error } = await supabase
      .from("cards")
      .update({
        front: cleanFront,
        back: cleanBack,
        hint: cleanHint,
      })
      .eq("id", cardId);

    setSavingEdit(false);

    if (error) return toast.error("Update failed");

    toast.success("Card updated");
    setEditingCard(null);
    fetchCards();
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="space-y-6">
          <div>
            <Link to="/" className="text-blue-600 text-sm">
              ← Back to Rooms
            </Link>

            <h2 className="text-2xl font-bold mt-1">Flashcards</h2>
            <p className="text-gray-600 text-sm mt-1">
              Create cards on the left — review on the right.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={addCard}
            className="border bg-white p-4 rounded-2xl shadow space-y-3">
            <h3 className="font-semibold text-lg">Add a new card</h3>

            <div className="h-px bg-gray-200" />

            <input
              className="border p-2 w-full rounded-lg"
              placeholder="Front (question)"
              value={front}
              onChange={(e) => setFront(e.target.value)}
            />

            <input
              className="border p-2 w-full rounded-lg"
              placeholder="Back (answer)"
              value={back}
              onChange={(e) => setBack(e.target.value)}
            />

            <input
              className="border p-2 w-full rounded-lg"
              placeholder="Hint (optional)"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
            />

            <button
              disabled={creating}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white px-3 py-2 rounded-lg w-full disabled:opacity-60">
              {creating ? "Adding..." : "Add Card"}
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className="h-44 rounded-xl bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center p-10 border rounded-2xl bg-white shadow-sm">
              <p className="text-lg font-semibold mb-2">No flashcards yet 🙈</p>
              <p className="text-gray-500">
                Create your first one from the left panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cards.map((card) => (
                <div key={card.id} className="space-y-1">
                  <div
                    className="relative h-48 cursor-pointer transition hover:-translate-y-1 hover:shadow-lg"
                    onClick={() => {
                      if (editingCard) return;

                      const current = clickState[card.id] || 0;

                      // 0 → show hint
                      if (current === 0 && card.hint) {
                        setShowHint((prev) => ({
                          ...prev,
                          [card.id]: true,
                        }));
                        setFlipped((prev) => ({
                          ...prev,
                          [card.id]: false,
                        }));
                        setClickState((prev) => ({
                          ...prev,
                          [card.id]: 1,
                        }));
                        return;
                      }

                      // 1 → flip to answer
                      if (current === 1) {
                        setShowHint((prev) => ({
                          ...prev,
                          [card.id]: false,
                        }));
                        setFlipped((prev) => ({
                          ...prev,
                          [card.id]: true,
                        }));
                        setClickState((prev) => ({
                          ...prev,
                          [card.id]: 2,
                        }));
                        return;
                      }

                      // 2 → reset
                      if (current === 2) {
                        setShowHint((prev) => ({
                          ...prev,
                          [card.id]: false,
                        }));
                        setFlipped((prev) => ({
                          ...prev,
                          [card.id]: false,
                        }));
                        setClickState((prev) => ({
                          ...prev,
                          [card.id]: 0,
                        }));
                      }
                    }}>
                    {/* EDIT MODE */}
                    {editingCard === card.id && (
                      <div className="absolute inset-0 bg-white p-3 rounded-xl border shadow-sm flex flex-col gap-2 z-10">
                        <input
                          className="border p-1 rounded"
                          value={editFront}
                          onChange={(e) => setEditFront(e.target.value)}
                        />
                        <input
                          className="border p-1 rounded"
                          value={editBack}
                          onChange={(e) => setEditBack(e.target.value)}
                        />
                        <input
                          className="border p-1 rounded"
                          value={editHint}
                          onChange={(e) => setEditHint(e.target.value)}
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveEdit(card.id);
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded">
                            {savingEdit ? "Saving..." : "Save"}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCard(null);
                            }}
                            className="px-3 py-1 border rounded">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CARD */}
                    <div className="w-full h-full [perspective:1200px]">
                      <div
                        className={`w-full h-full rounded-2xl border bg-white shadow-md p-5 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 [transform-style:preserve-3d] ${
                          flipped[card.id] ? "[transform:rotateY(180deg)]" : ""
                        }`}>
                        {/* FRONT */}
                        <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col gap-3 p-4">
                          <p className="font-semibold text-lg leading-snug">
                            {card.front}
                          </p>

                          {card.hint && !showHint[card.id] && (
                            <p className="text-sm text-gray-500 italic">
                              Hint available — tap to reveal
                            </p>
                          )}

                          {card.hint && showHint[card.id] && (
                            <div className="text-sm px-3 py-2 rounded-lg bg-blue-50 text-blue-700">
                              Hint: {card.hint}
                            </div>
                          )}
                        </div>

                        {/* BACK */}
                        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col gap-3 p-4">
                          <p className="font-bold text-lg leading-snug">
                            {card.back}
                          </p>

                          {card.hint && (
                            <p className="text-sm opacity-80">
                              Hint: {card.hint}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FOOTER BUTTONS */}
                  <div className="flex justify-between text-sm px-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCard(card.id);
                        setEditFront(card.front);
                        setEditBack(card.back);
                        setEditHint(card.hint || "");
                      }}
                      className="px-3 py-1 rounded border text-blue-700 bg-blue-50 hover:bg-blue-100">
                      ✏️ Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(card.id);
                      }}
                      className="px-3 py-1 rounded border text-red-700 bg-red-50 hover:bg-red-100">
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white p-5 rounded-xl shadow-lg space-y-4 w-[320px]">
            <h3 className="font-semibold text-lg">Delete this card?</h3>
            <p className="text-sm text-gray-500">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-1 border rounded">
                Cancel
              </button>

              <button
                onClick={deleteCard}
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
