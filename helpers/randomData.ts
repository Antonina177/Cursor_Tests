const FIRST_NAMES = [
  'Emma', 'Olivia', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper',
  'James', 'Michael', 'Alexander', 'William', 'Daniel', 'Matthew', 'David', 'Joseph',
  'Maria', 'Anna', 'Elena', 'Victoria', 'Natalie', 'Emily', 'Jessica', 'Sarah',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson',
  'Wilson', 'Clark', 'Lewis', 'Walker', 'Hall', 'Young', 'King', 'Wright',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generates a random first name from a list of real names
 */
export function randomFirstName(): string {
  return pickRandom(FIRST_NAMES);
}

/**
 * Generates a random last name from a list of real names
 */
export function randomLastName(): string {
  return pickRandom(LAST_NAMES);
}

/**
 * Generates a random email ending with @yopmail.com
 */
export function randomEmail(): string {
  const localPart = randomString(8) + Date.now().toString(36);
  return `${localPart}@yopmail.com`;
}

/**
 * Generates a random date of birth with year between 1990 and 2005
 * Returns in YYYY-MM-DD format (required for HTML input type="date")
 */
export function randomDateOfBirth(): string {
  const year = Math.floor(Math.random() * (2005 - 1990 + 1)) + 1990;
  const month = Math.floor(Math.random() * 12) + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const day = Math.floor(Math.random() * daysInMonth) + 1;
  const mm = month.toString().padStart(2, '0');
  const dd = day.toString().padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

/**
 * Generates a full set of random user data
 */
export function randomUserData(): { firstName: string; lastName: string; email: string; dateOfBirth: string } {
  return {
    firstName: randomFirstName(),
    lastName: randomLastName(),
    email: randomEmail(),
    dateOfBirth: randomDateOfBirth(),
  };
}

/**
 * Generates a unique corporation name for use in E2E tests.
 * Format: Automation_<timestamp><random2digits>
 * Example: Automation_174312345612_42
 */
export function generateCorporationName(): string {
  const randomSuffix = Math.floor(Math.random() * 90 + 10); // 10–99
  return `Automation_${Date.now()}_${randomSuffix}`;
}

/**
 * Generates a RFC 4122 UUID v4 for use as an external order ID.
 * Uses Node.js built-in crypto module (available in Node 15+).
 */
export function generateExternalId(): string {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { randomUUID } = require('crypto') as { randomUUID: () => string };
  return randomUUID();
}
