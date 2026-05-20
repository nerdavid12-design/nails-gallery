"use client";

// 4-pointed sparkle stars matching the exhibit poster
const accents = [
  { top: "8%",  left: "5%",   size: 18, color: "var(--color-nails-magenta)", delay: 0 },
  { top: "12%", right: "7%",  size: 12, color: "var(--color-nails-green)",   delay: 0.6 },
  { top: "28%", left: "3%",   size: 10, color: "var(--color-nails-green)",   delay: 1.1 },
  { top: "35%", right: "4%",  size: 16, color: "var(--color-nails-magenta)", delay: 0.3 },
  { top: "55%", left: "6%",   size: 8,  color: "var(--color-nails-cyan)",    delay: 1.8 },
  { top: "62%", right: "6%",  size: 14, color: "var(--color-nails-magenta)", delay: 0.9 },
  { top: "75%", left: "9%",   size: 10, color: "var(--color-nails-green)",   delay: 1.4 },
  { top: "82%", right: "10%", size: 8,  color: "var(--color-nails-cyan)",    delay: 0.5 },
  { top: "48%", left: "2%",   size: 6,  color: "var(--color-nails-magenta)", delay: 2.0 },
  { top: "20%", right: "14%", size: 6,  color: "var(--color-nails-green)",   delay: 1.6 },
];

// 4-pointed star path (the ✦ sparkle from the poster)
function Sparkle({ size, color, delay }: { size: number; color: string; delay: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ animationDelay: `${delay}s` }}
      className="animate-float"
    >
      <path
        d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
        fill={color}
        opacity="0.8"
      />
    </svg>
  );
}

export default function CrossAccents() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {accents.map((a, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: a.top,
            left: "left" in a ? a.left : undefined,
            right: "right" in a ? a.right : undefined,
          }}
        >
          <Sparkle size={a.size} color={a.color} delay={a.delay} />
        </div>
      ))}
    </div>
  );
}
