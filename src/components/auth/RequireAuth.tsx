import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSession } from "@/lib/auth";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const session = await getSession();
      if (mounted) {
        setAuthed(!!session);
        setChecked(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (!checked) return <div className="min-h-screen" />;
  if (!authed) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <>{children}</>;
}
