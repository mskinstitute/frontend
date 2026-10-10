export type SoftwareCategory = 
  | 'development' 
  | 'office' 
  | 'os' 
  | 'design' 
  | 'accounting' 
  | 'browser';

export type ShortcutDifficulty = 'basic' | 'intermediate' | 'pro' | 'advanced';

export interface ShortcutItem {
  id: string;
  keys: string[];
  macKeys?: string[];
  title: string;
  description: string;
  category: string;
  isPopular?: boolean;
  difficulty?: ShortcutDifficulty;
  isCustom?: boolean;
  isCustomized?: boolean;
  originalKeys?: string[];
  vscodeCommand?: string;
  isStudentPro?: boolean;
}

export interface ShortcutCategoryGroup {
  id: string;
  name: string;
  icon?: string;
  shortcuts: ShortcutItem[];
}

export interface SoftwareTool {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  category: SoftwareCategory;
  categoryLabel: string;
  description: string;
  accentColor: string;
  lightBgColor: string;
  borderColor: string;
  tags: string[];
  featuredShortcuts: {
    keys: string[];
    action: string;
  }[];
  categories: ShortcutCategoryGroup[];
}
