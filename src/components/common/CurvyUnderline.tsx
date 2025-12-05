export default function CurvyUnderline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 20"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
    >
      <path
        d="M 0 10 Q 50 15, 100 10 T 200 10"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
