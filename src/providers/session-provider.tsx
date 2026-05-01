"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { loadSession, saveSession } from "@/lib/storage";
import type { RoleCode, Session } from "@/lib/types";

interface SessionContextValue {
  session: Session | null;
  hydrated: boolean;
  signIn: (email: string) => Session;
  signOut: () => void;
  switchRole: (role: RoleCode) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

const STATE_ADMIN: Omit<Session, "loggedInAt"> = {
  role: "state_admin",
  name: "Dr. Anju Sharma",
  designation: "Director, Higher Education",
  department: "Directorate of Higher Education, Himachal Pradesh",
  email: "director.dhe@hp.gov.in"
};

const COLLEGE_ADMIN: Omit<Session, "loggedInAt"> = {
  role: "college_admin",
  name: "Dr. Priya Negi",
  designation: "Principal",
  department: "Government College Sanjauli, Shimla",
  email: "principal.gcsanjauli@hp.gov.in",
  collegeId: "gc-sanjauli",
  collegeName: "Government College Sanjauli"
};

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setHydrated(true);
  }, []);

  const signIn = useCallback((email: string): Session => {
    const next: Session = {
      ...STATE_ADMIN,
      email: email || STATE_ADMIN.email,
      loggedInAt: new Date().toISOString()
    };
    setSession(next);
    saveSession(next);
    return next;
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    saveSession(null);
  }, []);

  const switchRole = useCallback((role: RoleCode) => {
    const prev = loadSession();
    const base = role === "state_admin" ? STATE_ADMIN : COLLEGE_ADMIN;
    const next: Session = {
      ...base,
      loggedInAt: prev?.loggedInAt ?? new Date().toISOString()
    };
    saveSession(next);
    setSession(next);
    if (typeof window !== "undefined") {
      // College Admin lands on /college; State Admin lands on /.
      const target = role === "college_admin" ? "/college" : "/";
      window.location.assign(target);
    }
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({ session, hydrated, signIn, signOut, switchRole }),
    [session, hydrated, signIn, signOut, switchRole]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
