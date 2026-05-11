"use client";

const positions = [
  { top: "10%", left: "5%", size: 12, color: "var(--color-nails-cyan)" },
  { top: "20%", right: "8%", size: 8, color: "var(--color-nails-cyan)" },
  { top: "45%", left: "3%", size: 10, color: "var(--color-nails-green)" },
  { top: "60%", right: "5%", size: 14, color: "var(--color-nails-cyan)" },
  { top: "80%", left: "10%", size: 8, color: "var(--color-nails-green)" },
  { top: "30%", right: "12%", size: 6, color: "var(--color-nails-cyan)" },
];

export default function CrossAccents() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-40">
      {positions.map((pos, i) => (
        <svg
          key={i}
          className="absolute animate-float"
          style={{
            top: pos.top,
            left: "left" in pos ? pos.left : undefined,
            right: "right" in pos ? pos.right : undefined,
            width: pos.size,
            height: pos.size,
            animationDelay: `${i * 0.5}s`,
          }}
          viewBox="0 0 12 12"
        >
          <line x1="6" y1="0" x2="6" y2="12" stroke={pos.color} strokeWidth="1.5" />
          <line x1="0" y1="6" x2="12" y2="6" stroke={pos.color} strokeWidth="1.5" />
        </svg>
      ))}
    </div>
  );
}
