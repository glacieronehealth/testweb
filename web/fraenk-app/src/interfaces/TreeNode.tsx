
export interface TreeNode {
  id: string;
  type: 'section' | 'text' | 'list';
  props?: Record<string, unknown>;
  children?: TreeNode[];
}

