export default function RadiatingLines() {
  const lineCount = 72;
  const lines = Array.from({ length: lineCount }, (_, i) => {
    const angle = (360 / lineCount) * i;
    const isMajor = i % 4 === 0;
    return (
      <line
        key={i}
        x1="100"
        y1="100"
        x2="100"
        y2={isMajor ? "2" : "8"}
        stroke={i % 3 === 0 ? "var(--color-nails-green)" : "var(--color-nails-magenta)"}
        strokeWidth={isMajor ? "0.8" : "0.4"}
        opacity={isMajor ? "0.6" : "0.3"}
        transform={`rotate(${angle} 100 100)`}
      />
    );
  });

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Outer slow spin */}
      <svg
        className="absolute h-[700px] w-[700px] animate-spin-slow"
        viewBox="0 0 200 200"
      >
        {lines}
      </svg>

      {/* Green neon orb — the glowing circle from the poster */}
      <div
        className="absolute h-56 w-56 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(57,255,20,0.35) 0%, rgba(57,255,20,0.15) 40%, transparent 70%)",
          filter: "blur(18px)",
        }}
      />
      {/* Tighter hot-spot */}
      <div
        className="absolute h-24 w-24 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(57,255,20,0.5) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </div>
  );
}
