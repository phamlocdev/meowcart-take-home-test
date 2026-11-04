const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2026-10/graphql.json`;

async function shopifyFetch<T>(query: string): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN!, // chỉ được đọc ở server-side => không bị lộ ở browser
    },
    body: JSON.stringify({ query }),
    cache: "no-store", // luôn fetch dữ liệu mới nhất
  });
  if (!res.ok) throw new Error(`Shopify HTTP ${res.status}`);
  const body = await res.json();
  if (body.errors) throw new Error(JSON.stringify(body.errors));
  return body.data as T;
}

export async function getProductCounts() {
  const data = await shopifyFetch<{
    total: { count: number };
    active: { count: number };
    draft: { count: number };
  }>(`{
    total: productsCount { count }
    active: productsCount(query: "status:active") { count }
    draft: productsCount(query: "status:draft") { count }
  }`); // sử dụng alias để giảm số lần fetch dữ liệu từ NextJS Server sang Shopify Server
  return {
    total: data.total.count,
    active: data.active.count,
    draft: data.draft.count,
  };
}
