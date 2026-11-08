
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  bookId: string;
  ownerId: string;
  currentCover?: string;
  onUploaded: (url: string) => void;
};

export default function BookCoverUploader({
  bookId,
  ownerId,
  currentCover,
  onUploaded,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  async function uploadCover(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(
        file.type
      )
    ) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Your cover must be smaller than 5 MB.");
      return;
    }

    setUploading(true);

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const { data: auth, error: authError } =
        await supabase.auth.getUser();

      if (
        authError ||
        !auth.user ||
        auth.user.id !== ownerId
      ) {
        throw new Error("Owner login required.");
      }

      const extension =
        file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
          ? "webp"
          : "jpg";

      const safeBookId = bookId.replace(
        /[^a-zA-Z0-9_-]/g,
        "_"
      );

      const path =
        `${ownerId}/${safeBookId}/` +
        `${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("slaybase-covers")
        .upload(path, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("slaybase-covers")
        .getPublicUrl(path);

      onUploaded(data.publicUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Cover upload failed."
      );
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localPreview);
      setPreview(null);
      event.target.value = "";
    }
  }

  return (
    <div className="slay-cover-uploader">
      <label htmlFor="slay-cover-file">
        Upload Cover From Computer
      </label>

      <input
        id="slay-cover-file"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={uploadCover}
        disabled={uploading}
      />

      <small className="muted">
        JPG, PNG, or WebP · Maximum 5 MB
      </small>

      {uploading && (
        <p className="muted">Uploading your new cover… 💗</p>
      )}

      {preview && (
        <img
          src={preview}
          alt="Cover preview"
          style={{
            width: 110,
            borderRadius: 10,
          }}
        />
      )}

      {!preview && currentCover && (
        <img
          src={currentCover}
          alt="Current book cover"
          style={{
            width: 110,
            borderRadius: 10,
          }}
        />
      )}

      {error && (
        <p role="alert" style={{ color: "#ff92bb" }}>
          {error}
        </p>
      )}
    </div>
  );
}
