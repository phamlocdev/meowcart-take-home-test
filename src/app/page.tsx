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
  const days = Array.from({ length: 14 }, (_, i) =>
    new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
  );
  const ordersPerDay = days.map(
    (day) => orders.filter((o) => o.createdAt.slice(0, 10) === day).length,
  );
  const maxPerDay = Math.max(1, ...ordersPerDay);
  return (
    <main>
      <h1>Meowcart Store Snapshot - Take-Home Test - Loc Pham</h1>
      <p className="as-of">Data as of {new Date().toLocaleString("en-US")}</p>
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
      <h2>Orders per day (last 14 days)</h2>
      <section className="chart">
        {days.map((day, i) => (
          <div key={day} className="chart-col">
            <div
              className="chart-bar"
              style={{ height: `${(ordersPerDay[i] / maxPerDay) * 100}%` }}
            />
            <span className="chart-count">{ordersPerDay[i]}</span>
            <span className="chart-day">{day.slice(5)}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
