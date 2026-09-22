import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  if (!secret) {
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  if (!signature) {
    return res.status(400).json({ error: "Missing Razorpay signature" });
  }

  const rawBody = await getRawBody(req);

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  console.log("Razorpay webhook verified");

  return res.status(200).json({
    success: true,
    message: "Webhook verified successfully",
  });
}

async function getRawBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}
