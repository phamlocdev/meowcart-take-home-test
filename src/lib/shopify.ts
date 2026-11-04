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

// 1. Test thử hàm getShopName()
export async function getShopName(): Promise<string> {
  const data = await shopifyFetch<{ shop: { name: string } }>(
    `{ shop { name } }`,
  );
  return data.shop.name;
}
