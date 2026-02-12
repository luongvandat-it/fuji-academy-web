export function MaterialsIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4L4 20 12 20 12 4z" />
      <path d="M12 4L12 20 20 20 20 4z" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );
}
