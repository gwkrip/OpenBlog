"use client";

import { useRouter } from "next/navigation";
import { Check, X, Trash2 } from "lucide-react";

interface Props {
  id: string;
  approved: boolean;
}

export function CommentActions({ id, approved }: Props) {
  const router = useRouter();

  const update = async (action: string) => {
    await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    router.refresh();
  };

  const remove = async () => {
    if (!confirm("Delete this comment?")) return;
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      {!approved && (
        <button onClick={() => update("approve")} className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="Approve">
          <Check size={15} />
        </button>
      )}
      {approved && (
        <button onClick={() => update("unapprove")} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors" title="Unapprove">
          <X size={15} />
        </button>
      )}
      <button onClick={remove} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete">
        <Trash2 size={15} />
      </button>
    </div>
  );
}
