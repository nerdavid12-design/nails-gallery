export default function RadiatingLines() {
  const lineCount = 36;
  const lines = Array.from({ length: lineCount }, (_, i) => {
    const angle = (360 / lineCount) * i;
    return (
      <line
        key={i}
        x1="100"
        y1="100"
        x2="100"
        y2="0"
        stroke={i % 2 === 0 ? "var(--color-nails-magenta)" : "var(--color-nails-green)"}
        strokeWidth="0.5"
        opacity="0.3"
        transform={`rotate(${angle} 100 100)`}
      />
    );
  });

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-20">
      <svg
        className="h-[600px] w-[600px] animate-spin-slow"
        viewBox="0 0 200 200"
      >
        {lines}
      </svg>
    </div>
  );
}
