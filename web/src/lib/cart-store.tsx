"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";

export type CartLine = {
  sku: string;
  productSlug: string;
  productName: string;
  variantLabel: string | null;
  unitPriceCents: number;
  quantity: number;
  maxStock: number;
  image: { path: string; alt: string } | null;
  isCandle: boolean;
};

type State = { lines: CartLine[]; hydrated: boolean };

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: CartLine }
  | { type: "set-qty"; sku: string; quantity: number }
  | { type: "remove"; sku: string }
  | { type: "clear" }
  | { type: "reconcile"; adjustments: { sku: string; available: number }[] };

const STORAGE_KEY = "lucrescente.cart.v1";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines, hydrated: true };
    case "add": {
      const existing = state.lines.find((l) => l.sku === action.line.sku);
      if (!existing) return { ...state, lines: [...state.lines, action.line] };
      const quantity = Math.min(existing.quantity + action.line.quantity, action.line.maxStock);
      return {
        ...state,
        lines: state.lines.map((l) => (l.sku === action.line.sku ? { ...l, ...action.line, quantity } : l)),
      };
    }
    case "set-qty":
      return {
        ...state,
        lines: state.lines
          .map((l) => (l.sku === action.sku ? { ...l, quantity: Math.max(0, Math.min(action.quantity, l.maxStock)) } : l))
          .filter((l) => l.quantity > 0),
      };
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.sku !== action.sku) };
    case "clear":
      return { ...state, lines: [] };
    case "reconcile":
      return {
        ...state,
        lines: state.lines
          .map((l) => {
            const adj = action.adjustments.find((a) => a.sku === l.sku);
            if (!adj) return l;
            return { ...l, maxStock: adj.available, quantity: Math.min(l.quantity, adj.available) };
          })
          .filter((l) => l.quantity > 0),
      };
  }
}

type Toast = { id: number; message: string; tone: "calm" | "warn" };

type CartContextValue = {
  lines: CartLine[];
  hydrated: boolean;
  count: number;
  subtotalCents: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (line: CartLine) => void;
  setQuantity: (sku: string, quantity: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
  reconcile: (adjustments: { sku: string; available: number }[]) => void;
  toasts: Toast[];
  notify: (message: string, tone?: Toast["tone"]) => void;
  dismissToast: (id: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], hydrated: false });
  const [isOpen, setOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as CartLine[]) : [];
      dispatch({ type: "hydrate", lines: Array.isArray(parsed) ? parsed : [] });
    } catch {
      dispatch({ type: "hydrate", lines: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      /* storage unavailable: cart lives in memory only */
    }
  }, [state.lines, state.hydrated]);

  const notify = useCallback((message: string, tone: Toast["tone"] = "calm") => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      hydrated: state.hydrated,
      count: state.lines.reduce((a, l) => a + l.quantity, 0),
      subtotalCents: state.lines.reduce((a, l) => a + l.quantity * l.unitPriceCents, 0),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add: (line) => dispatch({ type: "add", line }),
      setQuantity: (sku, quantity) => dispatch({ type: "set-qty", sku, quantity }),
      remove: (sku) => dispatch({ type: "remove", sku }),
      clear: () => dispatch({ type: "clear" }),
      reconcile: (adjustments) => dispatch({ type: "reconcile", adjustments }),
      toasts,
      notify,
      dismissToast: (id) => setToasts((t) => t.filter((x) => x.id !== id)),
    }),
    [state, isOpen, toasts, notify],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
