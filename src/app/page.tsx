import { getProductCounts } from "@/lib/shopify";

export default async function Home() {
  const counts = await getProductCounts();
  return (
    <main>
      <h1>Meowcart Store Snapshot</h1>
      <section className="cards">
        <div className="card">
          <span className="card-label">Tổng sản phẩm</span>
          <span className="card-value">{counts.total}</span>
        </div>
        <div className="card">
          <span className="card-label">Active</span>
          <span className="card-value">{counts.active}</span>
        </div>
        <div className="card">
          <span className="card-label">Draft</span>
          <span className="card-value">{counts.draft}</span>
        </div>
      </section>
    </main>
  );
}
