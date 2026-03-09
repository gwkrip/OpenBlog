export type UserRole = "user" | "author" | "admin";

export interface PostWithRelations {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
  featured: boolean;
  views: number;
  readingTime: number;
  metaTitle: string | null;
  metaDesc: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
  };
  categories: { id: string; name: string; slug: string; color: string }[];
  tags: { id: string; name: string; slug: string }[];
  _count?: { comments: number };
}

export interface CommentWithAuthor {
  id: string;
  content: string;
  approved: boolean;
  createdAt: Date;
  postId: string;
  authorId: string | null;
  guestName: string | null;
  guestEmail: string | null;
  parentId: string | null;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  replies?: CommentWithAuthor[];
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDesc: string;
  siteUrl: string;
  logo: string | null;
  favicon: string | null;
  accentColor: string;
  allowComments: boolean;
  requireCommentApproval: boolean;
  postsPerPage: number;
  footerText: string | null;
  socialTwitter: string | null;
  socialGithub: string | null;
  socialLinkedin: string | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PostsResponse {
  posts: PostWithRelations[];
  meta: PaginationMeta;
}
