import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PLANS } from "@/data/pricing";
import SectionHeading from "@/components/shared/SectionHeading";

export default function Pricing() {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="border-t border-b" style={{ padding: "56px 0", background: "hsl(var(--background-alt))", borderColor: "hsl(var(--border))" }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <SectionHeading center sub="Start free. Upgrade when you're ready to go all-in.">
          Invest in your license, not your <span className="text-primary">anxiety.</span>
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px] max-w-[880px] mx-auto">
          {PLANS.map((p, i) => (
            <div key={i} className={`price-card${p.pop ? " pop" : ""}`}>
              {p.pop && <div className="absolute top-[14px] right-[14px] text-[11px] font-bold text-primary" style={{ background: "var(--accent-s)", padding: "4px 10px", borderRadius: 100 }}>Most popular</div>}
              <div className="text-[13px] font-bold uppercase mb-3" style={{ color: "var(--text-secondary)", letterSpacing: "0.06em" }}>{p.name}</div>
              <div className="mb-5">
                <span className="text-[40px] font-extrabold" style={{ letterSpacing: "-0.03em" }}>{p.price}</span>
                {p.period && <span className="text-[14px] ml-[3px]" style={{ color: "var(--text-tertiary)" }}>{p.period}</span>}
              </div>
              <div className="flex flex-col gap-[9px] mb-[22px]">
                {p.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-[7px] text-[13px]" style={{ color: "var(--text-secondary)" }}>
                    <Check size={13} className="flex-shrink-0" style={{ color: "var(--teal)" }} />{f}
                  </div>
                ))}
              </div>
              <button className={p.pop ? "btn btn-p" : "btn btn-o"} onClick={() => navigate("/onboarding")} style={{ width: "100%", padding: 13, borderRadius: 11, fontSize: 14 }}>{p.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
