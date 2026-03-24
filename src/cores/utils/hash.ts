import bcrypt from "bcrypt";

const saltRounds = 10;

export async function hashPassword(password: string): Promise<string> {
  const hash = await bcrypt.hash(password, saltRounds);

  return hash;
}

export async function verifyPassword(
  password: string,
  hashed: string,
): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hashed);

  return isValid;
}
