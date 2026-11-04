import { getShopName } from "@/lib/shopify";

// Server Component: chỉ chạy ở server-side, không chạy ở client-side (browser)
export default async function Home() {
  const name = await getShopName();
  return <main>{name}</main>;
}
