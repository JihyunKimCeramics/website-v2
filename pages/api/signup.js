import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getPostHogClient } from "../../lib/posthog-server";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    // Validate email
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // ✅ OpenNext way to access bindings
    let env;
    try {
      ({ env } = getCloudflareContext());
    } catch {
      env = undefined;
    }
    const SIGNUPS = env?.SIGNUPS;

    // Local dev or missing binding
    if (!SIGNUPS) {
      console.log("DEV MODE: Would have saved email:", email);
      return res.status(200).json({
        success: true,
        message: "Successfully signed up! (dev mode)",
      });
    }

    // Insert into D1
    const result = await SIGNUPS.prepare(
      "INSERT INTO signups (email) VALUES (?)"
    )
      .bind(email)
      .run();

    if (!result.success) {
      // Check if it's a duplicate email error
      if (result.error && result.error.includes("UNIQUE constraint")) {
        return res.status(409).json({ error: "Email already registered" });
      }
      throw new Error("Database insert failed");
    }

    const distinctId = req.headers["x-posthog-distinct-id"] || "anonymous";
    const phClient = getPostHogClient();
    phClient.capture({
      distinctId,
      event: "newsletter_signup",
      properties: {
        $set: { email },
      },
    });
    await phClient.shutdown();

    return res.status(200).json({
      success: true,
      message: "Successfully signed up!",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ error: "An error occurred. Please try again." });
  }
}
