
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const allowedGenres = [
  "Romance",
  "Dark Romance",
  "Fantasy",
  "Thriller",
  "Mystery",
  "Street Lit",
  "Contemporary Fiction",
  "Horror",
  "Young Adult",
  "Historical Fiction",
  "Other",
];

function clean(value: unknown, max = 500): string {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");

    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json(
        { error: "Request origin not allowed." },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Honeypot: ordinary visitors never fill this field.
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const requestType = clean(body.requestType, 30);
    const name = clean(body.name, 100);
    const email = clean(body.email, 254);
    const bookTitle = clean(body.bookTitle, 200);
    const bookAuthor = clean(body.bookAuthor, 150);
    const preferredStart = clean(body.preferredStart, 100);
    const readingPace = clean(body.readingPace, 100);
    const message = clean(body.message, 1500);

    const genres = Array.isArray(body.genres)
      ? body.genres
          .filter(
            (genre: unknown): genre is string =>
              typeof genre === "string" &&
              allowedGenres.includes(genre)
          )
          .slice(0, 10)
      : [];

    if (
      !["buddy_read", "interest"].includes(requestType) ||
      name.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Please provide your name and a valid email." },
        { status: 400 }
      );
    }

    if (requestType === "buddy_read" && !bookTitle) {
      return NextResponse.json(
        { error: "Please enter the book you want to read." },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      console.error("ReadSync Supabase configuration missing.");
      return NextResponse.json(
        { error: "ReadSync is temporarily unavailable." },
        { status: 503 }
      );
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { error: databaseError } = await admin
      .from("readsync_requests")
      .insert({
        request_type: requestType,
        bestie_name: name,
        contact_email: email,
        contact_preference: "Email",
        book_title: bookTitle || null,
        book_author: bookAuthor || null,
        favorite_genres: genres,
        preferred_start: preferredStart || null,
        reading_pace: readingPace || null,
        message: message || null,
      });

    if (databaseError) {
      console.error("ReadSync save failed:", databaseError.message);

      return NextResponse.json(
        { error: "We couldn't save your request. Please retry." },
        { status: 500 }
      );
    }

    const resendKey = process.env.RESEND_API_KEY;
    const notificationEmail =
      process.env.READSYNC_NOTIFICATION_EMAIL;

    if (resendKey && notificationEmail) {
      try {
        const notification = await fetch(
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
              subject:
                requestType === "buddy_read"
                  ? "New ReadSync Buddy Read Request"
                  : "New Booked & Bestie'd Interest Form",
              text: [
                `Type: ${requestType}`,
                `Bestie: ${name}`,
                `Email: ${email}`,
                `Book: ${bookTitle || "Not specified"}`,
                `Author: ${bookAuthor || "Not specified"}`,
                `Genres: ${genres.join(", ") || "Not specified"}`,
                `Preferred start: ${preferredStart || "Flexible"}`,
                `Reading pace: ${readingPace || "Flexible"}`,
                "",
                "Message:",
                message || "No additional message.",
              ].join("\n"),
            }),
          }
        );

        if (!notification.ok) {
          console.error(
            "ReadSync email delivery failed:",
            notification.status
          );
        }
      } catch (emailError) {
        console.error(
          "ReadSync email notification error:",
          emailError
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Your request has been received!",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process your request." },
      { status: 400 }
    );
  }
}
