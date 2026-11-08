
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";

export const runtime = "nodejs";

type RequestType = "buddy_read" | "interest";

const ALLOWED_GENRES = [
  "Street Lit",
  "Thriller",
  "Fantasy",
  "Mystery",
  "Romance",
  "Spice",
  "Contemporary",
  "Horror",
  "Sci-Fi",
  "Historical Fiction",
  "Nonfiction",
  "Other",
];

const ALLOWED_ORIGINS = new Set([
  "https://slaylistsuite.netlify.app",
  "http://localhost:3000",
  "http://localhost:3001",
]);

function cleanText(value: unknown, maxLength = 500): string {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientHash(request: NextRequest): string | null {
  const ip =
    process.env.NODE_ENV === "production"
      ? request.headers.get("x-nf-client-connection-ip")
      : "local-development";

  if (!ip) {
    return null;
  }

  return createHash("sha256")
    .update(ip.trim())
    .digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    // Allow submissions from the live website and local development.
    const origin = request.headers.get("origin");

    if (!origin || !ALLOWED_ORIGINS.has(origin)) {
      return NextResponse.json(
        { error: "Invalid request origin." },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Hidden honeypot field for basic bot protection.
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const requestType = cleanText(
      body.requestType,
      30
    ) as RequestType;

    const bestieName = cleanText(body.bestieName, 100);
    const contactEmail = cleanText(body.contactEmail, 254);
    const contactPreference = cleanText(
      body.contactPreference,
      100
    );

    const bookTitle = cleanText(body.bookTitle, 200);
    const bookAuthor = cleanText(body.bookAuthor, 200);
    const preferredStart = cleanText(body.preferredStart, 100);
    const readingPace = cleanText(body.readingPace, 100);
    const message = cleanText(body.message, 2000);

    const favoriteGenres = Array.isArray(body.favoriteGenres)
      ? body.favoriteGenres
          .filter(
            (genre: unknown): genre is string =>
              typeof genre === "string" &&
              ALLOWED_GENRES.includes(genre)
          )
          .slice(0, 12)
      : [];

    // Validate required fields.
    if (
      !["buddy_read", "interest"].includes(requestType) ||
      !bestieName ||
      !validEmail(contactEmail) ||
      (requestType === "buddy_read" && !bookTitle)
    ) {
      return NextResponse.json(
        { error: "Please check the required fields." },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        "ReadSync server configuration is missing."
      );

      return NextResponse.json(
        { error: "ReadSync is temporarily unavailable." },
        { status: 503 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Enforce a 60-second cooldown before saving or emailing.
    const clientHash = getClientHash(request);

    if (!clientHash) {
      console.error(
        "ReadSync: trusted visitor IP header is missing."
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify request. Please try again.",
        },
        { status: 400 }
      );
    }

    const { data: allowed, error: limitError } =
      await supabase.rpc("check_readsync_rate_limit", {
        p_client_hash: clientHash,
      });

    if (limitError) {
      console.error(
        "ReadSync rate limit check failed:",
        limitError.message
      );

      return NextResponse.json(
        { error: "ReadSync is temporarily unavailable." },
        { status: 503 }
      );
    }

    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "Please wait about a minute before sending another request. 💗",
        },
        { status: 429 }
      );
    }

    // Save the submission privately in Supabase.
    const { error: insertError } = await supabase
      .from("readsync_requests")
      .insert({
        request_type: requestType,
        bestie_name: bestieName,
        contact_email: contactEmail,
        contact_preference:
          contactPreference || null,
        book_title:
          requestType === "buddy_read"
            ? bookTitle
            : null,
        book_author:
          requestType === "buddy_read"
            ? bookAuthor || null
            : null,
        favorite_genres: favoriteGenres,
        preferred_start: preferredStart || null,
        reading_pace: readingPace || null,
        message: message || null,
      });

    if (insertError) {
      console.error(
        "ReadSync database error:",
        insertError.message
      );

      return NextResponse.json(
        {
          error:
            "Unable to submit your request. Please try again.",
        },
        { status: 500 }
      );
    }

    // Send a private email notification through Resend.
    const resendKey = process.env.RESEND_API_KEY;

    const notificationEmail =
      process.env.READSYNC_NOTIFICATION_EMAIL;

    if (resendKey && notificationEmail) {
      const subject =
        requestType === "buddy_read"
          ? `💗 New Buddy Read Request: ${bookTitle}`
          : "💗 New Booked & Bestie'd Interest";

      const details = [
        `Request type: ${requestType}`,
        `Name: ${bestieName}`,
        `Email: ${contactEmail}`,
        `Contact preference: ${
          contactPreference || "Not provided"
        }`,
        `Book: ${bookTitle || "Not applicable"}`,
        `Author: ${bookAuthor || "Not provided"}`,
        `Genres: ${
          favoriteGenres.join(", ") || "Not provided"
        }`,
        `Preferred start: ${
          preferredStart || "Not provided"
        }`,
        `Reading pace: ${
          readingPace || "Not provided"
        }`,
        `Message: ${message || "None"}`,
      ].join("\n");

      try {
        const emailResponse = await fetch(
          "https://api.resend.com/emails",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "ReadSync <onboarding@resend.dev>",
              to: [notificationEmail],
              subject,
              text: details,
            }),
          }
        );

        if (!emailResponse.ok) {
          console.error(
            "ReadSync email delivery failed:",
            emailResponse.status,
            await emailResponse.text()
          );
        }
      } catch (emailError) {
        console.error(
          "ReadSync email error:",
          emailError
        );
      }
    } else {
      console.warn(
        "ReadSync notification settings are missing."
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Your request is officially in the books! I'll review it and reach out if we're a match. 💗",
    });
  } catch (error) {
    console.error(
      "ReadSync unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
