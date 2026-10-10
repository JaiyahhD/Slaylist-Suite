
"use client";

import "./readsync.css";

import { FormEvent, useState } from "react";

type RequestType = "buddy_read" | "interest";

const genres = [
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

export default function ReadSyncPage() {
  const [requestType, setRequestType] =
    useState<RequestType>("buddy_read");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [selectedGenres, setSelectedGenres] =
    useState<string[]>([]);
  const [preferredStart, setPreferredStart] = useState("");
  const [readingPace, setReadingPace] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");

  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);

  function toggleGenre(genre: string) {
    setSelectedGenres((current) =>
      current.includes(genre)
        ? current.filter((item) => item !== genre)
        : [...current, genre]
    );
  }

  async function submitRequest(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (sending) return;

    setSending(true);
    setFeedback("");
    setSuccess(false);

    try {
      const response = await fetch("/api/readsync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestType,
          name,
          email,
          bookTitle,
          bookAuthor,
          genres: selectedGenres,
          preferredStart,
          readingPace,
          message,
          website,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Something went wrong."
        );
      }

      setSuccess(true);
      setFeedback(
        "Your request is officially in the books! I'll review it and reach out if we're a match. 💗"
      );

      setName("");
      setEmail("");
      setBookTitle("");
      setBookAuthor("");
      setSelectedGenres([]);
      setPreferredStart("");
      setReadingPace("");
      setMessage("");
      setWebsite("");
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Please try again."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="readsync-page">
      <div className="readsync-shell">
        <header className="readsync-hero">
          <span className="readsync-eyebrow">
            THE SLAYLIST SUITE // READING CONNECTIONS
          </span>

          <div className="readsync-symbol">♡</div>

          <h1>
            READ<span>SYNC</span>
          </h1>

          <p className="readsync-tagline">
            Same book. Shared obsession. Main character energy.
          </p>

          <p className="readsync-intro">
            Some stories are too good to experience alone.
            Whether you have a book in mind or just want
            to find your next reading bestie, this is where
            our chapters connect.
          </p>
        </header>

        <section className="readsync-panel">
          <div className="readsync-panel-heading">
            <span className="readsync-eyebrow">
              BOOKED & BESTIE&apos;D
            </span>
            <h2>Find your reading frequency.</h2>
            <p>
              Pick your vibe below and send your request.
              No account required.
            </p>
          </div>

          <div
            className="readsync-tabs"
            role="group"
            aria-label="Choose request type"
          >
            <button
              type="button"
              className={
                requestType === "buddy_read"
                  ? "readsync-tab active"
                  : "readsync-tab"
              }
              aria-pressed={requestType === "buddy_read"}
              onClick={() => {
                setRequestType("buddy_read");
                setFeedback("");
                setSuccess(false);
              }}
            >
              📖 REQUEST A BUDDY READ
            </button>

            <button
              type="button"
              className={
                requestType === "interest"
                  ? "readsync-tab active"
                  : "readsync-tab"
              }
              aria-pressed={requestType === "interest"}
              onClick={() => {
                setRequestType("interest");
                setFeedback("");
                setSuccess(false);
              }}
            >
              💌 BESTIE INTEREST FORM
            </button>
          </div>

          <div className="readsync-form-intro">
            <span className="readsync-eyebrow">
              {requestType === "buddy_read"
                ? "FREQUENCY 001 // BOOK REQUEST"
                : "FREQUENCY 002 // READING CONNECTION"}
            </span>

            <h3>
              {requestType === "buddy_read"
                ? "Got a book in mind?"
                : "Let's get Booked & Bestie'd."}
            </h3>

            <p>
              {requestType === "buddy_read"
                ? "Tell me what you want us to read together and when you're hoping to start."
                : "Tell me about your reading tastes, your pace, and the stories you love."}
            </p>
          </div>

          <form
            className="readsync-form"
            onSubmit={submitRequest}
          >
            <div className="readsync-grid">
              <label className="readsync-field">
                <span>YOUR NAME *</span>
                <input
                  required
                  minLength={2}
                  maxLength={100}
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="What should I call you?"
                />
              </label>

              <label className="readsync-field">
                <span>YOUR EMAIL *</span>
                <input
                  required
                  type="email"
                  maxLength={254}
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Where can I reach you?"
                />
              </label>
            </div>

            {requestType === "buddy_read" && (
              <div className="readsync-grid">
                <label className="readsync-field">
                  <span>BOOK TITLE *</span>
                  <input
                    required
                    maxLength={200}
                    value={bookTitle}
                    onChange={(event) =>
                      setBookTitle(event.target.value)
                    }
                    placeholder="What's our next read?"
                  />
                </label>

                <label className="readsync-field">
                  <span>AUTHOR</span>
                  <input
                    maxLength={150}
                    value={bookAuthor}
                    onChange={(event) =>
                      setBookAuthor(event.target.value)
                    }
                    placeholder="Who wrote it?"
                  />
                </label>
              </div>
            )}

            <fieldset className="readsync-genres">
              <legend>
                FAVORITE GENRES
                <small> Pick as many as you like.</small>
              </legend>

              <div className="readsync-genre-list">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    aria-pressed={selectedGenres.includes(
                      genre
                    )}
                    className={
                      selectedGenres.includes(genre)
                        ? "readsync-genre selected"
                        : "readsync-genre"
                    }
                    onClick={() => toggleGenre(genre)}
                  >
                    {selectedGenres.includes(genre)
                      ? "♥ "
                      : "+ "}
                    {genre}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="readsync-grid">
              <label className="readsync-field">
                <span>PREFERRED START</span>
                <select
                  value={preferredStart}
                  onChange={(event) =>
                    setPreferredStart(event.target.value)
                  }
                >
                  <option value="">I'm flexible!</option>
                  <option value="ASAP">ASAP</option>
                  <option value="Within 2 weeks">
                    Within 2 weeks
                  </option>
                  <option value="Next month">
                    Next month
                  </option>
                  <option value="Just exploring">
                    Just exploring
                  </option>
                </select>
              </label>

              <label className="readsync-field">
                <span>READING PACE</span>
                <select
                  value={readingPace}
                  onChange={(event) =>
                    setReadingPace(event.target.value)
                  }
                >
                  <option value="">Go with the flow</option>
                  <option value="A few chapters daily">
                    A few chapters daily
                  </option>
                  <option value="One week">
                    Finish in a week
                  </option>
                  <option value="Two weeks">
                    Finish in two weeks
                  </option>
                  <option value="One month">
                    Finish in a month
                  </option>
                  <option value="Flexible">
                    Whatever works for us
                  </option>
                </select>
              </label>
            </div>

            <label className="readsync-field">
              <span>
                {requestType === "buddy_read"
                  ? "ANYTHING ELSE ABOUT OUR READ?"
                  : "TELL ME ABOUT YOUR READING VIBE"}
              </span>

              <textarea
                rows={5}
                maxLength={1500}
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder={
                  requestType === "buddy_read"
                    ? "Reading goals, discussion style, schedule, or anything I should know..."
                    : "Favorite tropes, bookish obsessions, reading habits, or anything else..."
                }
              />
            </label>

            <div
              className="readsync-honeypot"
              aria-hidden="true"
            >
              <label>
                Website
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(event) =>
                    setWebsite(event.target.value)
                  }
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            <p className="readsync-privacy">
              🔒 Your details are used to review your
              request and contact you about buddy reading.
              They won&apos;t appear publicly on the site.
              Submitting doesn&apos;t guarantee a buddy-read
              match.
            </p>

            {feedback && (
              <div
                className={
                  success
                    ? "readsync-feedback success"
                    : "readsync-feedback error"
                }
                role="status"
              >
                {feedback}
              </div>
            )}

            <button
              type="submit"
              className="readsync-submit"
              disabled={sending}
            >
              {sending
                ? "SENDING YOUR SIGNAL..."
                : requestType === "buddy_read"
                  ? "SEND BUDDY READ REQUEST ♡"
                  : "SEND BESTIE INTEREST ♡"}
            </button>
          </form>
        </section>

        <footer className="readsync-footer">
          <span>♡ BOOKED. BESTIE&apos;D. IN SYNC. ♡</span>
          <p>
            Every great reading friendship starts
            with a chapter.
          </p>
        </footer>
      </div>
    </main>
  );
}
