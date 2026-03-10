"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  exiting?: boolean;
}

interface ToastContextValue {
  toast: (opts: Omit<ToastItem, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

// Safe default — no-ops so calling outside Provider never crashes during SSR
const noop = () => {};
const defaultContext: ToastContextValue = {
  toast: noop,
  success: noop,
  error: noop,
  warning: noop,
  info: noop,
};

const ToastContext = createContext<ToastContextValue>(defaultContext);

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={17} className="text-green-600 flex-shrink-0 mt-0.5" />,
  error:   <XCircle      size={17} className="text-red-600   flex-shrink-0 mt-0.5" />,
  warning: <AlertTriangle size={17} className="text-amber-600 flex-shrink-0 mt-0.5" />,
  info:    <Info          size={17} className="text-blue-600  flex-shrink-0 mt-0.5" />,
};

function Toast({ toast, onRemove }: { toast: ToastItem; onRemove: () => void }) {
  return (
    <div
      className={cn("toast", `toast-${toast.type}`, toast.exiting && "toast-exit")}
      role="alert"
      aria-live="assertive"
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-tight">{toast.title}</p>
        {toast.description && (
          <p className="text-xs mt-0.5 opacity-75">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onRemove}
        className="p-1 rounded opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <X size={13} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 280);
  }, []);

  const addToast = useCallback(
    (opts: Omit<ToastItem, "id">) => {
      const id = `t-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const duration = opts.duration ?? 4000;
      setToasts((prev) => [...prev.slice(-4), { ...opts, id }]);
      timers.current[id] = setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  const value: ToastContextValue = {
    toast: addToast,
    success: (title, description) => addToast({ type: "success", title, description }),
    error:   (title, description) => addToast({ type: "error",   title, description }),
    warning: (title, description) => addToast({ type: "warning", title, description }),
    info:    (title, description) => addToast({ type: "info",    title, description }),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Portal — rendered outside normal flow, always on top */}
      <div
        aria-label="Notifications"
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast toast={t} onRemove={() => removeToast(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Safe hook — returns no-op functions when called outside of ToastProvider
 * (e.g. during SSR/static pre-render), preventing crashes during build.
 */
export function useToast(): ToastContextValue {
  return useContext(ToastContext);
}
