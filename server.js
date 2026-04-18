import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

// Load .env explicitly from project root to avoid cwd issues
const projectRoot = path.dirname(new URL(import.meta.url).pathname).replace(/^\/+/, '');
const envPath = path.join(projectRoot, '.env');
try {
  const raw = fs.readFileSync(envPath, 'utf8');
  const lines = raw.split(/\r?\n/).slice(0, 10).filter(Boolean);
  console.log('.env contents (top lines):', lines);
} catch (err) {
  console.log('.env read error:', err.message);
}
console.log('process.cwd():', process.cwd());
console.log('resolved envPath:', envPath);

dotenv.config({ path: envPath });

// If dotenv didn't populate MONGO_URI (cwd/path mismatches), try parsing workspace .env as fallback
if (!process.env.MONGO_URI) {
  try {
    const fallbackPath = path.join(process.cwd(), '.env');
    const parsed = dotenv.parse(fs.readFileSync(fallbackPath, 'utf8'));
    if (parsed.MONGO_URI) {
      process.env.MONGO_URI = parsed.MONGO_URI;
      console.log('MONGO_URI injected from fallback .env');
    }
  } catch (err) {
    // ignore fallback errors; connectDB will handle missing value
  }
}

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
// Debug: confirm MONGO_URI presence before attempting connection
console.log('MONGO_URI present?', !!process.env.MONGO_URI);
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});