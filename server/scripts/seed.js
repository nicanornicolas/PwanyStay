require('dotenv').config();
const db = require('../src/config/postgres');
const bcrypt = require('bcryptjs');

const stays = [
  {
    title: "Beachfront Villa in Diani",
    location: "Diani",
    price: 4500,
    tags: ["Beachfront", "Ferry-free"],
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Cozy Cottage in Watamu",
    location: "Watamu",
    price: 2800,
    tags: ["Walkable"],
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Mombasa Old Town Apartment",
    location: "Mombasa",
    price: 2200,
    tags: ["Ferry-free", "Walkable"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Kilifi Waterfront House",
    location: "Kilifi",
    price: 3500,
    tags: ["Beachfront"],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
  }
];

const users = [
  { email: 'user1@example.com', password: 'password123' },
  { email: 'user2@example.com', password: 'password123' },
];

async function seed() {
  try {
    for (const stay of stays) {
      const tagsJson = JSON.stringify(stay.tags);
      const imagesJson = JSON.stringify([stay.image]);
      await db.query(
        'INSERT INTO resources (name, location, price, tags, images) VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)',
        [stay.title, stay.location, stay.price, tagsJson, imagesJson]
      );
      console.log(`Inserted: ${stay.title}`);
    }

    // Seed users
    for (const user of users) {
      const hashed = await bcrypt.hash(user.password, 10);
      await db.query('INSERT INTO users (email, password) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING', [user.email, hashed]);
      console.log(`Inserted user: ${user.email}`);
    }

    // Seed admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@pwanystay.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await db.query(`
      INSERT INTO admins (email, password) VALUES ($1, $2)
      ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password
    `, [adminEmail, hashedPassword]);
    console.log(`Admin seeded/updated: ${adminEmail}`);

    console.log('Seeding completed');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    db.pool.end();
  }
}

seed();