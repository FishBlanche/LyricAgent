import { useState } from "react";
import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const themeOptions = [
  "Summer heartbreak",
  "Friends to lovers",
  "Late-night city romance",
  "Unspoken crush",
  "Growing apart",
  "Second chance love",
  "Jealousy and regret",
  "Youth and nostalgia",
  "Road trip memories",
  "After the breakup",
  "Long-distance love",
  "Revenge glow-up",
];

const emotionOptions = [
  "Bittersweet",
  "Hopeful",
  "Heartbroken",
  "Nostalgic",
  "Confident",
  "Jealous",
  "Regretful",
  "Dreamy",
  "Angry",
  "Playful",
  "Lonely",
  "Triumphant",
];

const perspectiveOptions = [
  "First person",
  "Second person",
  "Third person",
  "Dual perspective",
  "Past self looking back",
  "Letter to an ex",
  "Diary entry",
  "Late-night confession",
];

const initialForm = {
  theme: themeOptions[0],
  emotion: emotionOptions[0],
  perspective: perspectiveOptions[0],
  keywords: "",
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        let message = `Request failed with status ${response.status}.`;

        try {
          const errorData = await response.json();

          if (typeof errorData?.detail === "string") {
            message = errorData.detail;
          } else if (Array.isArray(errorData?.detail)) {
            message = errorData.detail
              .map((item) => `${item.loc?.join(".")}: ${item.msg}`)
              .join(" | ");
          }
        } catch {
          const fallbackText = await response.text();

          if (fallbackText) {
            message = fallbackText;
          }
        }

        throw new Error(message);
      }

      const data = await response.json();
      setResult(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong while generating lyrics.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell">
      <main className="layout">
        <section className="hero-panel">
          <p className="eyebrow">LyricAgent</p>
          <h1>Turn a song idea into a polished lyric draft.</h1>
          <p className="hero-copy">
            Build a concept, hook lines, and full lyrics from a few creative
            prompts. The backend uses a pop storytelling voice with vivid
            imagery and sing-along phrasing.
          </p>

          <div className="feature-grid">
            <article className="feature-card">
              <span>01</span>
              <h2>Define the mood</h2>
              <p>Choose the theme, emotion, and perspective of the song.</p>
            </article>
            <article className="feature-card">
              <span>02</span>
              <h2>Add keywords</h2>
              <p>Give the model specific images or memory fragments to use.</p>
            </article>
            <article className="feature-card">
              <span>03</span>
              <h2>Generate instantly</h2>
              <p>Get a concept summary, hooks, and structured lyrics.</p>
            </article>
          </div>
        </section>

        <section className="workspace-panel">
          <form className="generator-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <p>Create Lyrics</p>
              <span></span>
            </div>

            <label>
              Theme
              <select
                name="theme"
                value={form.theme}
                onChange={handleChange}
                required
              >
                {themeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Emotion
              <select
                name="emotion"
                value={form.emotion}
                onChange={handleChange}
                required
              >
                {emotionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Perspective
              <select
                name="perspective"
                value={form.perspective}
                onChange={handleChange}
                required
              >
                {perspectiveOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Keywords
              <input
                name="keywords"
                placeholder="boardwalk, polaroid, midnight drive"
                value={form.keywords}
                onChange={handleChange}
                required
              />
            </label>

            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate lyrics"}
            </button>

            {error ? <p className="status-message error">{error}</p> : null}
          </form>

          <section className="results-panel">
            <div className="results-header">
              <p>Generated Output</p>
              <span></span>
            </div>

            {result ? (
              <div className="result-content">
                <div className="result-block">
                  <h3>Concept</h3>
                  <p>{result.concept}</p>
                </div>

                <div className="result-block">
                  <h3>Hooks</h3>
                  <ul>
                    {result.hooks.map((hook) => (
                      <li key={hook}>{hook}</li>
                    ))}
                  </ul>
                </div>

                <div className="result-block">
                  <h3>Lyrics</h3>
                  <pre>{result.lyrics}</pre>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Your generated song draft will appear here.</p>
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;
