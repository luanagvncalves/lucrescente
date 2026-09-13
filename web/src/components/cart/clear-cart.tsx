"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

/** Empties the local cart once an order is confirmed. */
export function ClearCartOnMount() {
  const { clear, hydrated } = useCart();
  useEffect(() => {
    if (hydrated) clear();
  }, [hydrated, clear]);
  return null;
}
