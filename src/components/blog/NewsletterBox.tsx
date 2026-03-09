"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("success");
  };

  return (
    <div className="bg-ink text-paper p-7 rounded-sm">
      <div className="flex items-center gap-2 mb-4">
        <Mail size={16} className="text-accent" />
        <h3 className="text-xs font-medium uppercase tracking-widest text-paper/50">Newsletter</h3>
      </div>
      <p className="font-serif font-bold text-xl mb-2">Stay in the loop</p>
      <p className="text-sm text-paper/60 mb-5 leading-relaxed">
        Get the latest posts delivered straight to your inbox.
      </p>

      {status === "success" ? (
        <div className="text-sm text-accent font-medium">
          ✓ You're subscribed! Thank you.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-paper/10 border border-paper/20 rounded-sm text-sm text-paper placeholder:text-paper/30 focus:outline-none focus:border-accent transition-colors"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary w-full justify-center text-sm"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
}
