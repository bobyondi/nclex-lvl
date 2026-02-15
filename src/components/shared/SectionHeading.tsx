interface SectionHeadingProps {
  children: React.ReactNode;
  sub?: React.ReactNode;
  center?: boolean;
}

export default function SectionHeading({ children, sub, center }: SectionHeadingProps) {
  return (
    <div style={{ textAlign: center ? "center" : undefined, marginBottom: 40 }}>
      <h2 className="font-extrabold tracking-tight" style={{ fontSize: "clamp(24px, 3.5vw, 32px)", letterSpacing: "-0.03em", marginBottom: 8 }}>{children}</h2>
      {sub && <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)", maxWidth: center ? 500 : undefined, margin: center ? "0 auto" : undefined }}>{sub}</p>}
    </div>
  );
}
