import { Heart, MessageCircle, ArrowRight } from "lucide-react";
import { TESTIMONIALS } from "@/data/testimonials";
import SectionHeading from "@/components/shared/SectionHeading";

const TikTokIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z" fill="currentColor"/></svg>;
const RedditIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="currentColor"/><circle cx="8.5" cy="11.5" r="1.5" fill="white"/><circle cx="15.5" cy="11.5" r="1.5" fill="white"/><path d="M9 15c.9.6 1.9 1 3 1s2.1-.4 3-1" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/><circle cx="18" cy="5" r="2" fill="currentColor"/><path d="M15.5 4.5l2 .5" stroke="currentColor" strokeWidth="1.5"/></svg>;
const InstaIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>;

const Avatar = ({ name, colors }: { name: string; colors: [string, string] }) => (
  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}>
    {name.split(" ").map(w => w[0]).join("")}
  </div>
);

export default function Testimonials() {
  return (
    <section style={{ padding: "56px 0" }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <SectionHeading center sub="Real posts from nursing students on TikTok, Reddit, and Instagram.">
          What students are <span className="text-primary">actually saying.</span>
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
          {TESTIMONIALS.map((r, i) => {
            if (r.platform === "tiktok") return (
              <div key={i} className="rounded-2xl overflow-hidden flex flex-col" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div className="p-[18px] pb-[14px]">
                  <div className="flex items-center gap-[10px] mb-[14px]">
                    <Avatar name={r.user} colors={r.avatar} />
                    <div className="flex-1">
                      <div className="text-[13px] font-bold">{r.user}</div>
                      <div className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{r.handle}</div>
                    </div>
                    <div style={{ color: "#FE2C55" }}><TikTokIcon /></div>
                  </div>
                  <p className="text-[13px] leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>{r.text}</p>
                </div>
                <div className="flex items-center justify-between" style={{ borderTop: "1px solid hsl(var(--border))", padding: "10px 18px" }}>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[12px]" style={{ color: "var(--text-tertiary)" }}><Heart size={13} color="#FE2C55" fill="#FE2C55" />{r.likes}</span>
                    <span className="flex items-center gap-1 text-[12px]" style={{ color: "var(--text-tertiary)" }}><MessageCircle size={12} />Reply</span>
                  </div>
                  {r.badge && <span className="text-[10px] font-bold text-primary" style={{ background: "var(--accent-s)", padding: "3px 8px", borderRadius: 100 }}>{r.badge}</span>}
                </div>
              </div>
            );
            if (r.platform === "reddit") return (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div className="flex gap-3" style={{ padding: "16px 18px 12px" }}>
                  <div className="flex flex-col items-center gap-[2px] pt-[2px]">
                    <svg width="14" height="10" viewBox="0 0 14 10"><path d="M7 0l7 10H0z" fill="#FF4500"/></svg>
                    <span className="text-[12px] font-bold" style={{ color: "#FF4500" }}>{r.upvotes}</span>
                    <svg width="14" height="10" viewBox="0 0 14 10"><path d="M7 10L0 0h14z" fill="var(--text-tertiary)"/></svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-[6px] mb-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#FF4500" }}><RedditIcon /></div>
                      <span className="text-[11px] font-bold" style={{ color: "#FF4500" }}>{r.handle}</span>
                      <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>· u/{r.user}</span>
                    </div>
                    <p className="text-[13px] leading-relaxed mb-[10px]" style={{ color: "var(--text-secondary)" }}>{r.text}</p>
                    <div className="flex items-center gap-[14px] text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                      <span className="flex items-center gap-1"><MessageCircle size={12} />{r.comments} comments</span>
                      <span>Share</span>
                      <span>Award</span>
                    </div>
                  </div>
                </div>
              </div>
            );
            // Instagram
            return (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div className="p-[16px_18px]">
                  <div className="flex items-center gap-[10px] mb-[14px]">
                    <div className="p-[2px] rounded-full" style={{ background: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)" }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${r.avatar[0]}, ${r.avatar[1]})`, border: "2px solid hsl(var(--card))" }}>
                        {r.user.split(" ").map(w => w[0]).join("")}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[13px] font-bold">{r.handle.replace("@","")}</span>
                        {r.badge && <svg width="13" height="13" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#3897F0"/><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                      </div>
                      <div className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{r.user}</div>
                    </div>
                    <div style={{ color: "#E4405F" }}><InstaIcon /></div>
                  </div>
                  <p className="text-[13px] leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>{r.text}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[14px]">
                      <Heart size={18} color="#E4405F" fill="#E4405F" className="cursor-pointer" />
                      <MessageCircle size={17} style={{ color: "var(--text-secondary)" }} />
                      <ArrowRight size={17} style={{ color: "var(--text-secondary)", transform: "rotate(-45deg)" }} />
                    </div>
                    <span className="text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>{r.likes} likes</span>
                  </div>
                  {r.badge && <div className="mt-2 inline-block text-[10px] font-bold text-primary" style={{ background: "var(--accent-s)", padding: "3px 8px", borderRadius: 100 }}>{r.badge}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
