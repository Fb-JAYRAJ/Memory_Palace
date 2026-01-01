// Global flashcard state (Zustand)
// Currently very lightweight — can grow later if needed.

import { create } from "zustand";

export const useMemories = create((set) => ({
  memories: [],

  // Add a new memory item
  addMemory: (memory) =>
    set((state) => ({
      memories: [...state.memories, memory],
    })),
}));
