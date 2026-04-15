/**
 * 树形结构工具函数
 */

export interface TreeNode {
  id: string
  children?: TreeNode[]
  [key: string]: any
}

/**
 * 在树形结构中查找节点
 */
export function findNode<T extends TreeNode>(
  nodeId: string,
  nodes: T[] = []
): T | null {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node
    }
    if (node.children) {
      const found = findNode(nodeId, node.children as T[])
      if (found) return found
    }
  }
  return null
}

/**
 * 查找节点的父节点
 */
export function findParentNode<T extends TreeNode>(
  nodeId: string,
  nodes: T[] = [],
  parent: T | null = null
): T | null {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return parent
    }
    if (node.children) {
      const found = findParentNode(nodeId, node.children as T[], node)
      if (found) return found
    }
  }
  return null
}

/**
 * 获取节点路径（从根到当前节点）
 */
export function getNodePath<T extends TreeNode>(
  nodeId: string,
  nodes: T[] = [],
  path: T[] = []
): T[] {
  for (const node of nodes) {
    const currentPath = [...path, node]
    if (node.id === nodeId) {
      return currentPath
    }
    if (node.children) {
      const found = getNodePath(nodeId, node.children as T[], currentPath)
      if (found.length > 0) return found
    }
  }
  return []
}

