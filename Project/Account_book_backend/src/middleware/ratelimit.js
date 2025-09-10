const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const MIN = 60 * 1000;

// Allowlist (optional): comma-separated IPs in .env: RL_ALLOWLIST=127.0.0.1,::1
const isAllowlisted = (ip) =>
  (process.env.RL_ALLOWLIST || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .includes(ip);

// Global API limiter (per IP)
const apiLimiter = rateLimit({
  windowMs: (Number(process.env.RL_WINDOW_MIN) || 15) * MIN, // default 15 min
  max: Number(process.env.RL_MAX) || 100, // default 100 req
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isAllowlisted(req.ip),
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});

// Slowdown/throttling (soft pressure after N requests)
const apiSpeedLimiter = slowDown({
  windowMs: (Number(process.env.SD_WINDOW_MIN) || 15) * MIN,
  delayAfter: Number(process.env.SD_AFTER) || 80,
  delayMs: (used, req) => {
    const delayAfter = req.slowDown.limit;
    return (used - delayAfter) * (Number(process.env.SD_DELAY_MS) || 500);
  },
  skip: (req) => isAllowlisted(req.ip),
});

// Login/OTP ke liye strict limiter (brute-force rokne ke liye)
const authLimiter = rateLimit({
  windowMs: (Number(process.env.RL_AUTH_WINDOW_MIN) || 15) * MIN,
  max: Number(process.env.RL_AUTH_MAX) || 10, // default 10 attempts / 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 429, message: "Too many attempts. Try again later." },
  // Optional: sirf failed attempts count karna ho:
  // skipSuccessfulRequests: true,
});

module.exports = { apiLimiter, apiSpeedLimiter, authLimiter };
