export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("Razorpay webhook received");

  return res.status(200).json({
    success: true,
    message: "Webhook received"
  });
}
