class ListNode{
  constructor(val){
    this.val = val
    this.next = null
  }
}
class Linklist{
  head = null
  tail = null
  _size = 0
  append(val){
    let node = new ListNode(val)
    if(head==null){
      this.head = this.tail = node
    }else{
      this.tail.next = node
      this.tail = this.tail.next
    }
    this._size++
  }
  prepend(val){
    let node = new Linklist(val)
    if(head==null){
      this.head = this.tail = node
    }else{
      node.next = this.head
      this.head = node
    }
    this._size++
  }
}

class TreeNode{
  constructor(val){
    this.val = val
    this.left = null
    this.right = null
 }
}
class BinarySearchTree{
  constructor(root){
    this.root = root
  }
  insert(val,root){
    if(this.root.val<val&&root.right==null){
      let node = new TreeNode(val)
      root.right = node
      return 
    }
    if(this.root.val>val&&root.left==null){
      let node = new TreeNode(val)
      root.left = node
      return
    }
    if(root.val<val) return this.insert(val,root.right)
    if(root.val>val) return this.insert(val,root.left)
  }
  traverse(root,action){
    if(root == null) return 
    this.traverse(root.left,action)
    action(root.val)
    this.traverse(root.right,action)
  }
}