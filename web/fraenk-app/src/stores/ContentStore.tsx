import { makeAutoObservable, runInAction, toJS } from 'mobx';
import type { TreeNode } from "../interfaces/TreeNode.tsx";

export class ContentStore {
  root: TreeNode | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadJson(url: string) {
    console.log("HALLO ContentStore loadJson()");

    this.loading = true;
    this.error = null;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as TreeNode;
      runInAction(() => {
        this.root = data;
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'Load error';
        this.loading = false;
      });
    }
  }

  updateNodeType(node: TreeNode, nextType: TreeNode['type']) {
    node.type = nextType;
  }

  toPlainJson() {
    return toJS(this.root);
  }
}
