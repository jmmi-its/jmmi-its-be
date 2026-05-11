export interface ShortLink {
  short_link_id: string;
  short_code: string;
  short_path: string;
  url: string;
  click_count: number;
  timestamp: string;
}

export interface PaginatedShortLinks {
  data: ShortLink[];
  total: number;
  page: number;
  limit: number;
}

// Requests
export interface CreateShortLinkRequest {
  short_code?: string | null;
  url: string;
}

export type UpdateShortLinkRequest = Partial<CreateShortLinkRequest>;

// DB Models
export interface ShortLinkModel {
  id: string;
  shortCode: string;
  url: string;
  clickCount: number;
  createdAt: Date;
}
