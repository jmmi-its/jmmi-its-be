import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const candidatePaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env'),
];

const envPath = candidatePaths.find((filePath) => fs.existsSync(filePath));

if (envPath) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}
