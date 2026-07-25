import { AttractorBackground } from "strange-background";
import { useState } from "react";

const SYSTEMS = [
  { id: "lorenz", name: "Lorenz" },
  { id: "roessler", name: "Rossl er" },
  { id: "chen", name: "Chen" },
  { id: "thomas", name: "Thomas" },
  { id: "newton_leipnik", name: "Newton-Leipnik" },
  { id: "shimizu_morioka", name: "Shimizu-Morioka" },
  { id: "rabinovich_fabrikant", name: "Rabinovich-Fabrikant" },
  { id: "finance", name: "Finance" },
];

export default function App() {
  const [systemId, setSystemId] = useState("lorenz");
  const [backgroundBlur, setBackgroundBlur] = useState(12);

  return (
    <AttractorBackground
      system={systemId}
      speed={0.8}
      colorSpeed={0.3}
      pointCount={600_000}
      pointSize={2}
      autoRotate
      backgroundBlur={backgroundBlur}
    >
      <div style={{ minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
        {/* Hero section */}
        <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1rem", color: "white", textShadow: "0 2px 30px rgba(0,0,0,0.8)" }}>
              Strange Background
            </h1>
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)", opacity: 0.9, maxWidth: "600px", textAlign: "center", lineHeight: 1.6, color: "white", textShadow: "0 1px 15px rgba(0,0,0,0.8)" }}>
              Strange attractors as a fullscreen animated background.
              Pick a system below.
            </p>
          </div>
        </section>

        {/* System selector */}
        <section style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
          <div style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "2rem",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem", color: "white" }}>
              Attractor Systems
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem" }}>
              {SYSTEMS.map((sys) => (
                <button
                  key={sys.id}
                  onClick={() => setSystemId(sys.id)}
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: systemId === sys.id ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                    color: "white",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.2s",
                    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                  }}
                >
                  {sys.name}
                </button>
              ))}
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <label style={{ color: "white", fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}>
                Background Blur: {backgroundBlur}px
              </label>
              <input
                type="range"
                min={0}
                max={30}
                value={backgroundBlur}
                onChange={(e) => setBackgroundBlur(Number(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: "rgba(165, 243, 252)",
                }}
              />
            </div>
          </div>
        </section>

        {/* Info section */}
        <section style={{ padding: "4rem 2rem", maxWidth: "700px", margin: "0 auto" }}>
          <div style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "2rem",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", color: "white" }}>
              How it works
            </h2>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "rgba(255,255,255,0.85)" }}>
              A <code style={{ background: "rgba(255,255,255,0.15)", padding: "0.15rem 0.4rem", borderRadius: "4px", color: "#a5f3fc" }}>
                AttractorBackground
              </code>{" "}
              component renders a Three.js WebGL canvas as a fixed-position fullscreen background layer.
              Your React children overlay on top with normal document flow.
            </p>
            <pre style={{
              marginTop: "1.5rem",
              padding: "1.25rem",
              borderRadius: "10px",
              background: "rgba(0,0,0,0.5)",
              overflow: "auto",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              color: "#a5f3fc",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
{`import { AttractorBackground } from "strange-background";

<AttractorBackground system="lorenz">
  <h1>Your Content Here</h1>
</AttractorBackground>`}
            </pre>
          </div>
        </section>
      </div>
    </AttractorBackground>
  );
}
