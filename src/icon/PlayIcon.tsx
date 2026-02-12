export function PlayIcon({
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
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
