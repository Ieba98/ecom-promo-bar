import { shopifyApp } from "@shopify/shopify-app-remix/server";
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";

const sessionStorage = new SQLiteSessionStorage(process.env.DATABASE_URL || 'file:./dev.db');

export const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_API_KEY || 'test-key',
    apiSecretKey: process.env.SHOPIFY_API_SECRET || 'test-secret',
    scopes: (process.env.SCOPES || 'read_products').split(',').map(s => s.trim()),
  },
  authPathPrefix: "/auth",
  sessionStorage,
});

export const authenticate = shopify.authenticate; 