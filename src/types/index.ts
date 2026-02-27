export interface Channel {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo: string;
  category: string;
  country: string;
  streamUrl: string;
  type: 'tv' | 'movie';
}

export interface FilterOptions {
  category: string;
  country: string;
  search: string;
}
