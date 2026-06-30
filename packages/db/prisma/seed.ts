/**
 * Prisma seed script for @planviry/db.
 *
 * Part VI §6.8 — Seed Data. Full reference + demo data is authored in Part VI;
 * this script seeds the minimal baseline needed to prove the DB boundary works.
 */
import { db } from "../index";

async function main() {
  console.log("🌱 Seeding Planviry baseline (Part 0–3 scaffold)…");

  const demoUser = await db.user.upsert({
    where: { email: "demo@planviry.local" },
    update: {},
    create: {
      email: "demo@planviry.local",
      name: "Planviry Demo User",
    },
  });

  console.log(`  ✓ User upserted: ${demoUser.email} (${demoUser.id})`);
  console.log("🌱 Seed complete.");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
