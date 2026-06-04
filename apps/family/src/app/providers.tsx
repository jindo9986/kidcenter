"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentMember } from "@/lib/session";
import type { Member } from "@/data/db-types";

interface AuthState {
  member: Member | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  member: null,
  loading: true,
  refresh: async () => {},
});

export function useAuth(): AuthState {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setMember(await getCurrentMember());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load + subscription to auth changes; refresh() owns its own state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void refresh();
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ member, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
