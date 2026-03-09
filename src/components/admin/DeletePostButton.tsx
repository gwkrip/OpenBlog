"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 text-ink-subtle hover:text-red-500 transition-colors rounded"
    >
      <Trash2 size={14} />
    </button>
  );
}
