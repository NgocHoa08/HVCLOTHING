import 'dotenv/config';
import Database from 'better-sqlite3';
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { existsSync } from 'node:fs';
import path from 'node:path';
import type { Product } from '../src/types/product';

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
if (!projectId) {
  throw new Error('Set FIREBASE_PROJECT_ID in .env before running the migration.');
}

const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (credentialPath && !existsSync(path.resolve(credentialPath))) {
  throw new Error('GOOGLE_APPLICATION_CREDENTIALS must point to an existing service-account JSON file.');
}

if (getApps().length === 0) {
  initializeApp({ projectId, credential: applicationDefault() });
}

const databasePath = path.resolve(process.env.DATABASE_PATH ?? '.data/store.sqlite');
if (!existsSync(databasePath)) {
  throw new Error(`SQLite database not found at ${databasePath}. Nothing was migrated.`);
}

const sqlite = new Database(databasePath, { readonly: true, fileMustExist: true });
let products: Product[];
try {
  const table = sqlite.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'products'").get();
  if (!table) throw new Error('The SQLite database has no products table.');
  products = (sqlite.prepare('SELECT data FROM products ORDER BY rowid').all() as { data: string }[])
    .map(({ data }) => JSON.parse(data) as Product);
} finally {
  sqlite.close();
}

const firestore = getFirestore();
let migratedCount = 0;
let skippedCount = 0;

for (let offset = 0; offset < products.length; offset += 400) {
  const page = products.slice(offset, offset + 400);
  const references = page.map((product) => firestore.collection('products').doc(product.id));
  const existingDocuments = await firestore.getAll(...references);
  const batch = firestore.batch();
  let batchCount = 0;

  for (const [index, product] of page.entries()) {
    if (existingDocuments[index].exists) {
      skippedCount += 1;
      continue;
    }
    const data = Object.fromEntries(
      Object.entries(product).filter(([, value]) => value !== undefined),
    );
    batch.create(references[index], data);
    migratedCount += 1;
    batchCount += 1;
  }

  if (batchCount > 0) await batch.commit();
}

console.log(`Migration complete for ${projectId}: ${migratedCount} imported, ${skippedCount} already existed.`);