import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid hsl(var(--border))", padding: "20px 0" }}>
      <div className="max-w-[1100px] mx-auto px-6 flex justify-between items-center flex-wrap gap-[10px]">
        <div className="flex items-center gap-[7px]">
          <BookOpen size={13} className="text-primary" />
          <span className="font-extrabold text-[13px]">NCLEX<span className="text-primary">Prep</span></span>
        </div>
        <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>© 2026 NCLEXExamPrep · Not affiliated with NCSBN</span>
      </div>
    </footer>
  );
}
