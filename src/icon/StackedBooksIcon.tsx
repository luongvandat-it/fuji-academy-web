export function StackedBooksIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="18" width="24" height="16" rx="2" fill="#A67C52" stroke="#8B6914" strokeWidth="1.5" />
      <line x1="4" y1="24" x2="28" y2="24" stroke="#8B6914" strokeWidth="1" opacity={0.8} />
      <rect x="8" y="8" width="24" height="16" rx="2" fill="#3D9B5C" stroke="#2D7D46" strokeWidth="1.5" />
      <line x1="8" y1="14" x2="32" y2="14" stroke="#2D7D46" strokeWidth="1" opacity={0.8} />
    </svg>
  );
}
