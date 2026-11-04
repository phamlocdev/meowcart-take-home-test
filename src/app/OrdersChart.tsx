import { Order } from "@/lib/shopify";

type OrdersChartProps = {
  orders: Order[];
};

export default function OrdersChart({ orders }: OrdersChartProps) {
  const now = new Date().getTime();
  const days = Array.from({ length: 14 }, (_, i) =>
    new Date(now - (13 - i) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  );
  const ordersPerDay = days.map(
    (day) => orders.filter((o) => o.createdAt.slice(0, 10) === day).length,
  );
  const maxPerDay = Math.max(1, ...ordersPerDay);

  return (
    <>
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
    </>
  );
}
