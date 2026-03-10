"use client";

import { Twitter, Link2, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener"
        className="btn-ghost justify-start text-sm"
      >
        <Twitter size={14} />
        Share on Twitter
      </a>
      <button onClick={handleCopy} className="btn-ghost justify-start text-sm">
        {copied ? <Check size={14} className="text-green-500" /> : <Link2 size={14} />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
