import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  productId: string;
  productName: string;
  price: number;
  imageUrl?: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i.productId === item.productId);
          if (exists) return state;
          return { items: [...state.items, item] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      isInWishlist: (productId) =>
        get().items.some((i) => i.productId === productId),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: "wishlist-storage" }
  )
);
