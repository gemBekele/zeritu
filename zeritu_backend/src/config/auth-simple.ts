// Simplified auth setup for testing
// We'll use BetterAuth properly later, but for now this will work

import prisma from "./database";
import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createUser(email: string, password: string, name?: string, role: 'USER' | 'ADMIN' = 'USER') {
  const hashedPassword = await hashPassword(password);
  
  // Store password in Account table (BetterAuth structure)
  const user = await prisma.user.create({
    data: {
      email,
      name,
      role,
      accounts: {
        create: {
          providerId: "credential",
          accountId: email,
          password: hashedPassword,
        },
      },
    },
  });
  
  return user;
}

export async function verifyUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { accounts: true },
  });

  if (!user) return null;

  const account = user.accounts.find((acc) => acc.providerId === "credential");
  if (!account || !account.password) return null;

  const isValid = await verifyPassword(password, account.password);
  if (!isValid) return null;

  return user;
}








