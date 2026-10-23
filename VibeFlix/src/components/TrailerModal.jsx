
import { useEffect, useState } from "react";
import { getMovieTrailer } from "../../server/tmdb.js";

export default function TrailerModal({ movie, onClose }) {
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const movieTitle = movie?.title || movie?.name || "";

  useEffect(() => {
    if (!movieTitle) {
      setError("This movie has no title to search for.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadTrailer() {
      setLoading(true);
      setError("");
      setTrailer(null);

      try {
        const result = await getMovieTrailer(movieTitle);

        if (!cancelled) {
          setTrailer(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load the trailer.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTrailer();

    return () => {
      cancelled = true;
    };
  }, [movieTitle]);

  if (!movie) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(7, 3, 18, 0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "900px",
          background: "#130B25",
          border: "1px solid rgba(168, 85, 247, 0.5)",
          borderRadius: "18px",
          padding: "20px",
          color: "#FFFFFF",
          boxShadow: "0 20px 80px rgba(168, 85, 247, 0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "22px" }}>
              {movieTitle}
            </h2>
            <p style={{ margin: "6px 0 0", color: "#D8B4FE" }}>
              Official trailer / teaser
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close trailer"
            style={{
              background: "#3B1D59",
              color: "white",
              border: 0,
              borderRadius: "10px",
              padding: "10px 14px",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            background: "#070312",
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <p>Finding your trailer...</p>
          ) : error ? (
            <p style={{ textAlign: "center", padding: "20px" }}>
              {error}
            </p>
          ) : trailer ? (
            <iframe
              key={trailer.key}
              src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0`}
              title={`${movieTitle} trailer`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : null}
        </div>

        {trailer && (
          <p style={{ color: "#C4B5FD", fontSize: "13px" }}>
            Now playing: {trailer.name}
          </p>
        )}
      </div>
    </div>
  );
}
