// This file prevents Next.js from using its default _error page
// which incorrectly imports <Html> outside of _document in some 14.x versions.
// The actual 404 handling is done by src/app/not-found.tsx (App Router).
export { default } from "next/error";
