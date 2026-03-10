"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        success("Post deleted", "The post has been permanently removed.");
        router.refresh();
      } else {
        throw new Error();
      }
    } catch {
      toastError("Delete failed", "Could not delete the post. Try again.");
    }
    setDeleting(false);
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-md px-2 py-1 animate-scale-in">
        <AlertTriangle size={12} className="text-red-500 flex-shrink-0" />
        <span className="text-xs text-red-700 font-medium">Delete?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs font-bold text-red-600 hover:text-red-800 px-1.5 py-0.5 rounded hover:bg-red-100 transition-colors"
        >
          {deleting ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-ink-faint hover:text-ink p-0.5 rounded transition-colors"
        >
          <X size={11} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-1.5 rounded-md text-ink-subtle hover:text-red-500 hover:bg-red-50 transition-all"
      title="Delete post"
      aria-label="Delete post"
    >
      <Trash2 size={13} />
    </button>
  );
}
