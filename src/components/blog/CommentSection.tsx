"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { MessageSquare, Reply } from "lucide-react";
import type { CommentWithAuthor } from "@/types";

interface Props {
  postId: string;
  comments: CommentWithAuthor[];
  requireApproval: boolean;
}

function CommentItem({ comment, depth = 0 }: { comment: CommentWithAuthor; depth?: number }) {
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyName, setReplyName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: comment.postId,
        content: replyContent,
        guestName: replyName,
        parentId: comment.id,
      }),
    });
    if (res.ok) {
      setSubmitted(true);
      setReplying(false);
    }
  };

  return (
    <div className={`${depth > 0 ? "ml-8 border-l-2 border-[var(--border)] pl-6" : ""}`}>
      <div className="flex gap-3 mb-4">
        <div className="flex-shrink-0">
          {comment.author?.image ? (
            <Image src={comment.author.image} alt={comment.author.name || ""} width={36} height={36} className="rounded-full" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-paper-warm flex items-center justify-center text-xs font-bold text-ink-muted">
              {(comment.author?.name || comment.guestName || "G").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-medium text-sm">{comment.author?.name || comment.guestName || "Guest"}</span>
            <span className="text-xs text-ink-subtle">{formatDate(comment.createdAt, { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
          <p className="text-sm text-ink-muted leading-relaxed">{comment.content}</p>
          {depth === 0 && (
            <button
              onClick={() => setReplying(!replying)}
              className="flex items-center gap-1.5 text-xs text-ink-subtle hover:text-accent mt-2 transition-colors"
            >
              <Reply size={12} />
              Reply
            </button>
          )}
          {replying && !submitted && (
            <form onSubmit={handleReply} className="mt-3 space-y-2">
              <input value={replyName} onChange={(e) => setReplyName(e.target.value)} placeholder="Your name" className="input text-sm" required />
              <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder="Your reply..." className="input text-sm resize-none" rows={3} required />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary text-xs">Post Reply</button>
                <button type="button" onClick={() => setReplying(false)} className="btn-ghost text-xs">Cancel</button>
              </div>
            </form>
          )}
          {submitted && <p className="text-xs text-accent mt-2">Reply submitted for review!</p>}
        </div>
      </div>

      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );
}

export function CommentSection({ postId, comments, requireApproval }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content, guestName: name, guestEmail: email }),
    });
    setStatus(res.ok ? "success" : "error");
  };

  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare size={18} className="text-ink-muted" />
        <h2 className="font-serif font-bold text-2xl">Comments ({comments.length})</h2>
      </div>

      <div className="space-y-6 mb-12">
        {comments.length === 0 && (
          <p className="text-ink-subtle text-sm">Be the first to comment.</p>
        )}
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} />
        ))}
      </div>

      <div className="card p-6">
        <h3 className="font-serif font-bold text-xl mb-6">Leave a Comment</h3>
        {status === "success" ? (
          <div className="text-accent font-medium">
            {requireApproval ? "Your comment is awaiting approval. Thank you!" : "Comment posted!"}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input" required />
              </div>
              <div>
                <label className="label">Email (optional)</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
              </div>
            </div>
            <div>
              <label className="label">Comment *</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} className="input resize-none" rows={4} required />
            </div>
            {status === "error" && <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>}
            <button type="submit" disabled={status === "loading"} className="btn-primary">
              {status === "loading" ? "Posting..." : "Post Comment"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
