export function MessageIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="11" r="7" />
      <path d="M6.5 16.5L4 20l3.5-2.5z" />
      <circle cx="9" cy="11" r="1.25" fill="currentColor" />
      <circle cx="12" cy="11" r="1.25" fill="currentColor" />
      <circle cx="15" cy="11" r="1.25" fill="currentColor" />
    </svg>
  );
}
