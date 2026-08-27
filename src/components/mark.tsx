export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M16 2.5v5.5M16 24v5.5M2.5 16h5.5M24 16h5.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M16 16l7-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="1.6" fill="currentColor" />
    </svg>
  );
}
