"use client";

import { useState } from "react";

type LowStock = {
  items: { id: string; title: string; totalInventory: number }[];
  nextCursor: string | null;
};

export default function LowStockTable({ initial }: { initial: LowStock }) {
  const [items, setItems] = useState(initial.items);
  const [cursor, setCursor] = useState(initial.nextCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadMore() {
    setLoading(true);
    setError("");
    try {
      // fetch api từ browser đến nextjs server (http://localhost:3000/api/low-stock?cursor=xxx)
      // nextjs server sẽ gọi graphql api của shopify
      const res = await fetch(
        `/api/low-stock?cursor=${encodeURIComponent(cursor!)}`,
      );
      if (!res.ok) throw new Error();
      const data: LowStock = await res.json();
      setItems((prev) => [...prev, ...data.items]);
      setCursor(data.nextCursor);
    } catch {
      setError("Failed to load next page");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <table className="low-stock">
        <thead>
          <tr>
            <th>Title</th>
            <th>Inventory</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.totalInventory}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={loadMore} disabled={!cursor || loading}>
        {loading ? "Loading..." : "View More"}
      </button>
      {error && <p className="error-text">{error}</p>}
    </>
  );
}
