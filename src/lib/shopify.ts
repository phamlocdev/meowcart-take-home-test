const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2026-10/graphql.json`;

async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN!, // chỉ được đọc ở server-side => không bị lộ ở browser
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store", // luôn fetch dữ liệu mới nhất
  });
  if (!res.ok) {
    console.log(await res.text());
    throw new Error(`Shopify HTTP Error ${res.status}`);
  }
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

type Order = {
  createdAt: string;
  currentTotalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
};

export async function getOrders30Days(): Promise<Order[]> {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const orders: Order[] = [];
  let cursor: string | null = null;
  let hasNext = true;
  while (hasNext) {
    const data: {
      orders: {
        edges: { node: Order }[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    } = await shopifyFetch(
      `query ($cursor: String, $q: String) {
        orders(first: 250, after: $cursor, query: $q) {
          edges { node { createdAt currentTotalPriceSet { shopMoney { amount currencyCode } } } }
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { cursor, q: `created_at:>='${since}'` },
    );
    orders.push(...data.orders.edges.map((e) => e.node));
    hasNext = data.orders.pageInfo.hasNextPage;
    cursor = data.orders.pageInfo.endCursor;
  }
  return orders;
}

export async function getLowStock(cursor: string | null) {
  const data: {
    products: {
      edges: { node: { id: string; title: string; totalInventory: number } }[];
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  } = await shopifyFetch(
    `query ($cursor: String) {
      products(first: 1, after: $cursor, query: "inventory_total:<5") {
        edges { node { id title totalInventory } }
        pageInfo { hasNextPage endCursor }
      }
    }`,
    { cursor },
  );
  return {
    items: data.products.edges.map((e) => e.node),
    nextCursor: data.products.pageInfo.hasNextPage
      ? data.products.pageInfo.endCursor
      : null,
  };
}
