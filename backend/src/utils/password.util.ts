import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (plain: string, hashed: string) => {
  return bcrypt.compare(plain, hashed);
};

export const generateRandomPassword = (): string => {
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const specialCharacters = "!@#$%^&*()_+-=[]{};':\"\\|,.<>/?";
  const alphanumericCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

  const getRandomChar = (chars: string) =>
    chars[Math.floor(Math.random() * chars.length)];

  let password = "";
  password += getRandomChar(uppercaseLetters);
  password += getRandomChar(specialCharacters);

  for (let i = 0; i < 6; i++) {
    password += getRandomChar(alphanumericCharacters);
  }
  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  while (password.length < 6) {
    password += getRandomChar(
      alphanumericCharacters + uppercaseLetters + specialCharacters
    );
  }

  return password;
};
