export default function WavyDivider() {
  return (
    <div className="my-6 flex justify-center opacity-30">
      <svg width="200" height="12" viewBox="0 0 200 12">
        <path
          d="M0 6 Q10 0 20 6 T40 6 T60 6 T80 6 T100 6 T120 6 T140 6 T160 6 T180 6 T200 6"
          fill="none"
          stroke="var(--color-nails-magenta)"
          strokeWidth="1.5"
        />
        <path
          d="M0 8 Q10 2 20 8 T40 8 T60 8 T80 8 T100 8 T120 8 T140 8 T160 8 T180 8 T200 8"
          fill="none"
          stroke="var(--color-nails-green)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
