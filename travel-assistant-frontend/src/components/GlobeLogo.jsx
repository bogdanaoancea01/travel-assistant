export default function GlobeLogo({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="4 4 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Meridian"
    >
      <defs>
        <clipPath id="globe-mark-clip">
          <circle cx="32" cy="32" r="28" />
        </clipPath>
      </defs>
        <circle cx="32" cy="32" r="28" stroke="#1a1a1a" strokeWidth="1.4" clipPath="url(#globe-mark-clip)" />
        <ellipse cx="32" cy="32" rx="9" ry="28" stroke="#1a1a1a" strokeWidth="1.1" clipPath="url(#globe-mark-clip)" />
        <ellipse cx="32" cy="32" rx="18" ry="28" stroke="#1a1a1a" strokeWidth="0.7" opacity="0.6" clipPath="url(#globe-mark-clip)" />
        <ellipse cx="32" cy="32" rx="26" ry="28" stroke="#1a1a1a" strokeWidth="0.4" opacity="0.3" clipPath="url(#globe-mark-clip)" />
        <line x1="4" y1="32" x2="60" y2="32" stroke="#1a1a1a" strokeWidth="0.8" clipPath="url(#globe-mark-clip)" />
        <path d="M8 18 Q32 14 56 18" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.5" clipPath="url(#globe-mark-clip)" />
        <path d="M8 46 Q32 50 56 46" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.5" clipPath="url(#globe-mark-clip)" />
        <circle cx="47" cy="20" r="6" fill="#1a1a1a" />
        <circle cx="47" cy="20" r="3" fill="white" />
        <line x1="47" y1="26" x2="47" y2="32" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}