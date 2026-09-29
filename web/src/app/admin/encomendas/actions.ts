"use server";

import { revalidatePath } from "next/cache";
import { markOrderFulfilled } from "@/lib/orders";

/** Bound to an order's id and used as a plain form action on the packing list. */
export async function markShipped(orderId: string): Promise<void> {
  await markOrderFulfilled(orderId);
  revalidatePath("/admin/encomendas");
}
