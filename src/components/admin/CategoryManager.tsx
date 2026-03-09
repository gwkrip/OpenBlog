"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit, Check, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  _count: { posts: number };
}

interface Props {
  categories: Category[];
}

export function CategoryManager({ categories: initial }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: "", description: "", color: "" });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: desc, color }),
    });
    setName("");
    setDesc("");
    setColor("#6366f1");
    router.refresh();
  };

  const startEdit = (cat: Category) => {
    setEditing(cat.id);
    setEditData({ name: cat.name, description: cat.description || "", color: cat.color });
  };

  const handleUpdate = async (id: string) => {
    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setEditing(null);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card bg-white p-6">
        <h2 className="font-medium text-sm mb-5 border-b border-[var(--border)] pb-3">New Category</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="input resize-none" rows={2} />
          </div>
          <div>
            <label className="label">Color</label>
            <div className="flex gap-3 items-center">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-16 cursor-pointer rounded border border-[var(--border)]" />
              <input value={color} onChange={(e) => setColor(e.target.value)} className="input flex-1" />
            </div>
          </div>
          <button type="submit" className="btn-primary text-sm">
            <Plus size={14} />
            Create Category
          </button>
        </form>
      </div>

      <div className="card bg-white overflow-hidden">
        <div className="divide-y divide-[var(--border)]">
          {initial.map((cat) => (
            <div key={cat.id} className="p-4">
              {editing === cat.id ? (
                <div className="space-y-2">
                  <input value={editData.name} onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))} className="input text-sm" />
                  <input value={editData.description} onChange={(e) => setEditData((d) => ({ ...d, description: e.target.value }))} className="input text-sm" placeholder="Description" />
                  <div className="flex gap-2 items-center">
                    <input type="color" value={editData.color} onChange={(e) => setEditData((d) => ({ ...d, color: e.target.value }))} className="h-8 w-12 cursor-pointer rounded border border-[var(--border)]" />
                    <input value={editData.color} onChange={(e) => setEditData((d) => ({ ...d, color: e.target.value }))} className="input flex-1 text-sm" />
                    <button onClick={() => handleUpdate(cat.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Check size={14} /></button>
                    <button onClick={() => setEditing(null)} className="p-1.5 text-ink-subtle hover:bg-paper-warm rounded"><X size={14} /></button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                    <div>
                      <p className="font-medium text-sm">{cat.name}</p>
                      <p className="text-xs text-ink-subtle">{cat._count.posts} posts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => startEdit(cat)} className="p-1.5 text-ink-subtle hover:text-accent rounded transition-colors"><Edit size={13} /></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-ink-subtle hover:text-red-500 rounded transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {initial.length === 0 && (
            <p className="text-center py-12 text-ink-subtle text-sm">No categories yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
