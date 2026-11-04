import {
  getProductCounts,
  getOrders30Days,
  getLowStock,
} from "@/lib/shopify";
import LowStockTable from "./LowStockTable";

export default async function Home() {
  const [counts, orders, lowStock] = await Promise.all([
    getProductCounts(),
    getOrders30Days(),
    getLowStock(null),
  ]);
  const orderCount = orders.length;
  // Revenue = tổng currentTotalPriceSet.shopMoney của mọi đơn trong 30 ngày.
  const revenue = orders.reduce(
    (sum, o) => sum + Number(o.currentTotalPriceSet.shopMoney.amount),
    0,
  );
  const currency =
    orders[0]?.currentTotalPriceSet.shopMoney.currencyCode ?? "USD";
  const revenueText = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(revenue);
  return (
    <main>
      <h1>Meowcart Store Snapshot - Take-Home Test - Loc Pham</h1>
      <section className="cards">
        <div className="card">
          <span className="card-label">Total Products</span>
          <span className="card-value">{counts.total}</span>
        </div>
        <div className="card">
          <span className="card-label">Active Products</span>
          <span className="card-value">{counts.active}</span>
        </div>
        <div className="card">
          <span className="card-label">Draft Products</span>
          <span className="card-value">{counts.draft}</span>
        </div>
        <div className="card">
          <span className="card-label">Total Orders in the last 30 days</span>
          <span className="card-value">{orderCount}</span>
        </div>
        <div className="card">
          <span className="card-label">Revenue in the last 30 days</span>
          <span className="card-value">{revenueText}</span>
        </div>
      </section>
      <h2>Low stock products (inventory &lt; 5)</h2>
      <LowStockTable initial={lowStock} />
    </main>
  );
}
