const fs = require('fs');
const path = require('path');

const STORE_DIR = path.join(__dirname, '../../data');
const STORE_FILE = path.join(STORE_DIR, 'fallback_resources.json');

function ensureStore() {
  if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });
  if (!fs.existsSync(STORE_FILE)) fs.writeFileSync(STORE_FILE, JSON.stringify({ resources: [] }, null, 2));
}

function readStore() {
  try {
    ensureStore();
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { resources: [] };
  }
}

function writeStore(obj) {
  ensureStore();
  fs.writeFileSync(STORE_FILE, JSON.stringify(obj, null, 2));
}

async function listResources() {
  const store = readStore();
  return store.resources.slice().reverse();
}

async function getResource(id) {
  const store = readStore();
  return store.resources.find((r) => r.id === id) || null;
}

async function createResource({ name, description, price, image, location, tags, images }) {
  const store = readStore();
  const nextId = (store.resources.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
  const item = {
    id: nextId,
    name,
    description: description || null,
    price: typeof price === 'number' ? price : (price ? Number(price) : null),
    image: image || null,
    location: location || null,
    tags: Array.isArray(tags) ? tags : (typeof tags === 'string' && tags.trim() ? tags.split(',').map((t) => t.trim()).filter(Boolean) : []),
    images: Array.isArray(images) ? images : (images ? [images] : []),
    created_at: new Date().toISOString(),
  };
  store.resources.push(item);
  writeStore(store);
  return item;
}

module.exports = { listResources, getResource, createResource };
