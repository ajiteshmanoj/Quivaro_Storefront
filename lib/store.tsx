"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  BETA_TOKENS,
  NOTES,
  QUESTIONS,
  questionById,
  type FlagReason,
  type Level,
  type TemplateId,
  type Topic,
} from "./data";

export interface BuildItem {
  key: string;
  kind: "question" | "note";
  id: string;
  replacing?: boolean;
}

export type MemberRole = "IB certified teacher" | "Teacher" | "Tutor" | "Student";

export interface User {
  name: string;
  initials: string;
  role: MemberRole;
  tags: string[];
}

interface RejectedEntry {
  id: string;
  kind: "question" | "note";
  reason: string;
}

interface StoreState {
  items: BuildItem[];
  title: string;
  level: Level;
  template: TemplateId;
  showAnswers: boolean;
  rejectedLog: RejectedEntry[];
  /** community deltas, local mock state */
  extraApprovals: Record<string, number>;
  localFlags: Record<string, FlagReason>;
  hydrated: boolean;
  user: User | null;
  myVotes: Record<string, boolean>;
  betaToken: string | null;

  setTitle: (t: string) => void;
  setLevel: (l: Level) => void;
  setTemplate: (t: TemplateId) => void;
  setShowAnswers: (v: boolean) => void;

  addQuestion: (qid: string) => void;
  removeItem: (key: string) => void;
  moveItem: (key: string, dir: -1 | 1) => void;
  rejectQuestion: (key: string) => void;
  insertNote: (index: number, noteId: string) => void;
  rejectNote: (key: string) => void;
  autoBuild: (topics: Topic[], count: number) => void;
  clearWorksheet: () => void;

  approve: (qid: string) => void;
  flag: (qid: string, reason: FlagReason) => void;
  login: (name: string, role: MemberRole, extraTags?: string[]) => void;
  logout: () => void;
  redeemToken: (code: string) => boolean;
  toggleVote: (qid: string) => void;

  usedQuestionIds: () => Set<string>;
}

const StoreContext = createContext<StoreState | null>(null);

const LS_KEY = "quivaro-builder-v1";

let keyCounter = 0;
function nextKey() {
  keyCounter += 1;
  return `item-${keyCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BuildItem[]>([]);
  const [title, setTitle] = useState("Untitled worksheet");
  const [level, setLevel] = useState<Level>("AA HL");
  const [template, setTemplate] = useState<TemplateId>("examination");
  const [showAnswers, setShowAnswers] = useState(false);
  const [rejectedLog, setRejectedLog] = useState<RejectedEntry[]>([]);
  const [extraApprovals, setExtraApprovals] = useState<Record<string, number>>({});
  const [localFlags, setLocalFlags] = useState<Record<string, FlagReason>>({});
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [myVotes, setMyVotes] = useState<Record<string, boolean>>({});
  const [betaToken, setBetaToken] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (Array.isArray(s.items)) setItems(s.items);
        if (typeof s.title === "string") setTitle(s.title);
        if (typeof s.level === "string") setLevel(s.level);
        if (typeof s.template === "string") setTemplate(s.template);
        if (typeof s.showAnswers === "boolean") setShowAnswers(s.showAnswers);
        if (Array.isArray(s.rejectedLog)) setRejectedLog(s.rejectedLog);
        if (s.extraApprovals) setExtraApprovals(s.extraApprovals);
        if (s.localFlags) setLocalFlags(s.localFlags);
        if (s.user) setUser(s.user);
        if (s.myVotes) setMyVotes(s.myVotes);
        if (typeof s.betaToken === "string") setBetaToken(s.betaToken);
      }
    } catch {
      // ignore corrupted state
    }
    setHydrated(true);
  }, []);

  // persist
  useEffect(() => {
    if (!hydrated) return;
    const state = {
      items: items.map(({ replacing: _replacing, ...rest }) => rest),
      title,
      level,
      template,
      showAnswers,
      rejectedLog,
      extraApprovals,
      localFlags,
      user,
      myVotes,
      betaToken,
    };
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [items, title, level, template, showAnswers, rejectedLog, extraApprovals, localFlags, user, myVotes, betaToken, hydrated]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const usedQuestionIds = useCallback(() => {
    return new Set(items.filter((i) => i.kind === "question").map((i) => i.id));
  }, [items]);

  const addQuestion = useCallback((qid: string) => {
    setItems((prev) => {
      if (prev.some((i) => i.kind === "question" && i.id === qid)) return prev;
      return [...prev, { key: nextKey(), kind: "question", id: qid }];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const moveItem = useCallback((key: string, dir: -1 | 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.key === key);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }, []);

  /** Reject → the storefront retrieves a replacement from the same topic. */
  const rejectQuestion = useCallback((key: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.key === key);
      if (!item || item.kind !== "question") return prev;
      const rejected = questionById(item.id);
      if (rejected) {
        setRejectedLog((log) => [
          ...log,
          { id: rejected.id, kind: "question", reason: "Rejected in preview — returned to factory" },
        ]);
      }
      return prev.map((i) => (i.key === key ? { ...i, replacing: true } : i));
    });

    const t = setTimeout(() => {
      setItems((prev) => {
        const item = prev.find((i) => i.key === key);
        if (!item) return prev;
        const rejected = questionById(item.id);
        const used = new Set(prev.filter((i) => i.kind === "question").map((i) => i.id));
        const replacement = QUESTIONS.find(
          (q) =>
            q.topic === rejected?.topic &&
            !used.has(q.id) &&
            q.status !== "flagged"
        );
        if (!replacement) {
          // nothing left in this topic — remove the slot
          return prev.filter((i) => i.key !== key);
        }
        return prev.map((i) =>
          i.key === key ? { ...i, id: replacement.id, replacing: false } : i
        );
      });
    }, 950);
    timers.current.push(t);
  }, []);

  const insertNote = useCallback((index: number, noteId: string) => {
    setItems((prev) => {
      const next = [...prev];
      next.splice(index, 0, { key: nextKey(), kind: "note", id: noteId });
      return next;
    });
  }, []);

  /** Reject a notes chunk → regenerate (swap for another chunk, same topic first). */
  const rejectNote = useCallback((key: string) => {
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, replacing: true } : i))
    );
    const t = setTimeout(() => {
      setItems((prev) => {
        const item = prev.find((i) => i.key === key);
        if (!item) return prev;
        const current = NOTES.find((n) => n.id === item.id);
        const usedNotes = new Set(prev.filter((i) => i.kind === "note").map((i) => i.id));
        const replacement =
          NOTES.find((n) => n.topic === current?.topic && !usedNotes.has(n.id)) ??
          NOTES.find((n) => !usedNotes.has(n.id));
        if (!replacement) return prev.filter((i) => i.key !== key);
        return prev.map((i) =>
          i.key === key ? { ...i, id: replacement.id, replacing: false } : i
        );
      });
    }, 950);
    timers.current.push(t);
  }, []);

  /** Simulated retrieval: fill the worksheet from the requested topics. */
  const autoBuild = useCallback((topics: Topic[], count: number) => {
    setItems((prev) => {
      const used = new Set(prev.filter((i) => i.kind === "question").map((i) => i.id));
      const pool = QUESTIONS.filter(
        (q) =>
          (topics.length === 0 || topics.includes(q.topic)) &&
          !used.has(q.id) &&
          q.status !== "flagged"
      );
      const picked = pool.slice(0, count);
      return [
        ...prev,
        ...picked.map((q) => ({ key: nextKey(), kind: "question" as const, id: q.id })),
      ];
    });
  }, []);

  const clearWorksheet = useCallback(() => setItems([]), []);

  const approve = useCallback((qid: string) => {
    setExtraApprovals((prev) => ({ ...prev, [qid]: (prev[qid] ?? 0) + 1 }));
  }, []);

  const flag = useCallback((qid: string, reason: FlagReason) => {
    setLocalFlags((prev) => ({ ...prev, [qid]: reason }));
    setRejectedLog((log) => [
      ...log,
      { id: qid, kind: "question", reason: `Flagged — ${reason}` },
    ]);
  }, []);

  const login = useCallback((name: string, role: MemberRole, extraTags: string[] = []) => {
    const parts = name.trim().split(/\s+/);
    const initials = parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join(" ");
    const base =
      role === "IB certified teacher" ? "IB Teacher" : role;
    const tags = [base, ...extraTags, "Founding member"];
    setUser({ name: name.trim(), initials, role, tags });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  /** Token entry — no accounts, no passwords. The token is the door. */
  const redeemToken = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    const hit = BETA_TOKENS.find((t) => t.code === normalized);
    if (!hit) return false;
    setBetaToken(hit.code);
    return true;
  }, []);

  /** Reddit-style vote toggle — a vote is an approval with ownership. */
  const toggleVote = useCallback((qid: string) => {
    setMyVotes((prev) => {
      const voted = !!prev[qid];
      setExtraApprovals((ea) => ({
        ...ea,
        [qid]: (ea[qid] ?? 0) + (voted ? -1 : 1),
      }));
      const next = { ...prev };
      if (voted) delete next[qid];
      else next[qid] = true;
      return next;
    });
  }, []);

  const value: StoreState = {
    items,
    title,
    level,
    template,
    showAnswers,
    rejectedLog,
    extraApprovals,
    localFlags,
    hydrated,
    setTitle,
    setLevel,
    setTemplate,
    setShowAnswers,
    addQuestion,
    removeItem,
    moveItem,
    rejectQuestion,
    insertNote,
    rejectNote,
    autoBuild,
    clearWorksheet,
    approve,
    flag,
    usedQuestionIds,
    user,
    myVotes,
    betaToken,
    login,
    logout,
    redeemToken,
    toggleVote,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
