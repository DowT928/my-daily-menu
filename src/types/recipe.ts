export type Category = 'meat' | 'vegetable' | 'soup' | 'staple' | 'other';

export interface Recipe {
  id: string;
  name: string;
  category: Category;
  description: string;
  ingredients: string;
  steps: string;
  prepTime: string;
  notes: string;
  image?: string;
  createdAt: string;
}

export interface HistoryEntry {
  date: string;
  items: { id: string; name: string }[];
}

export const CATEGORIES: { key: Category; label: string; emoji: string }[] = [
  { key: 'meat', label: '荤菜', emoji: '🥩' },
  { key: 'vegetable', label: '素菜', emoji: '🥬' },
  { key: 'soup', label: '汤类', emoji: '🍲' },
  { key: 'staple', label: '主食', emoji: '🍚' },
  { key: 'other', label: '其他', emoji: '🥗' },
];

export const CATEGORY_MAP: Record<Category, { label: string; emoji: string }> = {
  meat: { label: '荤菜', emoji: '🥩' },
  vegetable: { label: '素菜', emoji: '🥬' },
  soup: { label: '汤类', emoji: '🍲' },
  staple: { label: '主食', emoji: '🍚' },
  other: { label: '其他', emoji: '🥗' },
};
