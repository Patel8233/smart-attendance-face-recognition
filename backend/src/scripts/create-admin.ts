import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dns from 'node:dns';
import 'dotenv/config';

dns.setServers([
  '8.8.8.8',
  '8.8.4.4',
]);

async function createAdmin() {
  const mongoUri =
    process.env.MONGODB_URI;

  const adminName =
    process.env.ADMIN_NAME;

  const adminEmail =
    process.env.ADMIN_EMAIL;

  const adminPassword =
    process.env.ADMIN_PASSWORD;

  if (
    !mongoUri ||
    !adminName ||
    !adminEmail ||
    !adminPassword
  ) {
    throw new Error(
      'Required environment variables are missing',
    );
  }

  const connection =
    await mongoose
      .createConnection(
        mongoUri,
        {
          dbName: 'smart_attendance',
        },
      )
      .asPromise();

  try {
    const users =
      connection.collection('users');

    const email =
      adminEmail
        .trim()
        .toLowerCase();

    const existingUser =
      await users.findOne({
        email,
      });

    if (existingUser) {
      console.log(
        'User with this email already exists',
      );

      return;
    }

    const hashedPassword =
      await bcrypt.hash(
        adminPassword,
        10,
      );

    await users.insertOne({
      name: adminName,
      email,
      password: hashedPassword,
      role: 'admin',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(
      'Admin created successfully',
    );
  } finally {
    await connection.close();
  }
}

createAdmin().catch((error) => {
  console.error(
    'Admin creation failed:',
    error.message,
  );

  process.exit(1);
});