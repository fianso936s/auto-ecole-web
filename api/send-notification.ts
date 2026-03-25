import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { clientName, email, phone, service, date, time, artisan, amount } = req.body;

    // Get notification email from settings
    const { data: setting } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "notification_email")
      .single();

    const notificationEmail = setting?.value;
    if (!notificationEmail) {
      return res.status(200).json({ message: "No notification email configured" });
    }

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: "bayaNail <onboarding@resend.dev>",
      to: notificationEmail,
      subject: `Nouvelle réservation - ${clientName}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #faf9f8; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1a1a2e, #0f3460); padding: 24px; text-align: center;">
            <h1 style="color: #d4a0a0; margin: 0; font-size: 22px;">bayaNail</h1>
            <p style="color: #ccc; margin: 4px 0 0; font-size: 13px;">Nouvelle réservation en ligne</p>
          </div>
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Cliente</td><td style="padding: 8px 0; font-weight: 600;">${clientName}</td></tr>
              <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Email</td><td style="padding: 8px 0;">${email}</td></tr>
              <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Téléphone</td><td style="padding: 8px 0;">${phone}</td></tr>
              <tr style="border-top: 1px solid #eee;"><td style="padding: 8px 0; color: #888; font-size: 13px;">Prestation</td><td style="padding: 8px 0; font-weight: 600;">${service}</td></tr>
              <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Date</td><td style="padding: 8px 0;">${date}</td></tr>
              <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Heure</td><td style="padding: 8px 0;">${time}</td></tr>
              <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Artisan</td><td style="padding: 8px 0;">${artisan || "Non spécifié"}</td></tr>
              <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Montant</td><td style="padding: 8px 0; font-weight: 600; color: #d4a0a0;">${amount}€</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 12px; background: #fff3cd; border-radius: 8px; font-size: 13px; color: #856404;">
              En attente de confirmation dans le CRM bayaNail.
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ message: "Notification sent" });
  } catch (err) {
    console.error("Notification error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
