
import { storage } from "./storage";
import { hashPassword } from "./auth";

async function seedAdminUser() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error("Error: ADMIN_PASSWORD environment variable is required");
    process.exit(1);
  }

  try {
    // Check if admin already exists
    const existingAdmin = await storage.getAdminUserByUsername(username);
    if (existingAdmin) {
      console.log(`Admin user '${username}' already exists`);
      return;
    }

    // Create new admin user
    const passwordHash = await hashPassword(password);
    const adminUser = await storage.createAdminUser({
      username,
      passwordHash,
      email: process.env.ADMIN_EMAIL,
      role: "admin",
      isActive: true,
    });

    console.log(`Admin user '${adminUser.username}' created successfully`);
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  }
}

seedAdminUser();
