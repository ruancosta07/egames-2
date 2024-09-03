import { create } from "zustand";

const useUserStore = create((set) => ({
  userActive: {
    name: "",
    email: "",
    role: "",
    id: "",
  },
  setUserActive: (user) => set({ userActive: user }),
  signed: false,
  setSigned: (value) =>
    set(() => ({
      signed: value,
    })),
  cart: [],
  setCart: (cart) => set({ cart }),
  favorites: [],
  setFavorites: (favorites) => set({ favorites }),
  orders: [],
  setOrders: (orders) => set({ orders }),
  preferences: {},
  setPreferences: (value)=> set(()=> ({preferences: value})),
  loadingData: null,
  setLoadingData: (value) => set(() => ({ loadingData: value })),
  theme:
    localStorage.getItem("theme") ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
  switchTheme: () =>
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),
}));

export default useUserStore;
