import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop") || "";
  const template = url.searchParams.get("template") || "index";
  const preview = url.searchParams.get("preview") === "true";

  // HMAC/Signature Verification for App Proxy
  const secret = process.env.SHOPIFY_API_SECRET || '';
  if (!preview) {
    const { verifyAppProxyRequest } = await import('~/utils/hmac.server');
    const ok = secret ? verifyAppProxyRequest(request.url, secret) : false;
    if (!ok) {
      return new Response('Invalid signature', { status: 401 });
    }
  }

  const where: any = { shop, active: true };
  if (template.includes("product")) where.showOnProduct = true;
  else if (template.includes("collection")) where.showOnCollection = true;
  else where.showOnHome = true;

  const bars = await prisma.promoBar.findMany({ where, orderBy: { id: "asc" } });

  const headers = new Headers();
  headers.set("Cache-Control", preview ? "no-store" : "public, max-age=60, s-maxage=300");
  return json({ bars }, { headers });
} 