"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main>
      <h1>Something went wrong</h1>
      <p className="error-text">{error.message}</p>
      <button onClick={reset}>Try again</button>
    </main>
  );
}
