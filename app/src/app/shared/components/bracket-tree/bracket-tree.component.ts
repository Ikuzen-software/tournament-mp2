import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Tree } from 'primeng/tree/tree';
import { TreeNode } from 'primeng/api/treenode';
import { Round, TournamentNode } from '../tree';
import { cpuUsage } from 'process';

@Component({
  selector: 'app-bracket-tree',
  templateUrl: './bracket-tree.component.html',
  styleUrls: ['./bracket-tree.component.scss']
})
export class BracketTreeComponent implements OnInit {
  @Input() tree: Round[];
  expandingTree: Tree;
  filesTree: TreeNode[] = [];
  selectedFile: TreeNode;

  constructor() {
  }

  ngOnInit(): void {
    this.fillNodes();
  }

  fillNodes() {
    for (let i = 0; i <= this.tree.length - 1; i++) {
      for (let j = this.tree[i].length - 1; j >= 0; j--) {
        this.fillNode(this.tree[i][j], i, j);
      }
    }
    this.filesTree.push({label: 'waiting opponent', children: [this.filesTree[this.filesTree.length-1], this.filesTree[this.filesTree.length-2]], expanded: true });
    console.log(this.filesTree)
    this.filesTree = this.filesTree.reverse();
  }

  fillNode(node: TournamentNode, i: number, j: number) {
    if (node.a && node.b && (typeof node.a !== 'string' && !node.a.b)) { // case bye
      this.filesTree.push(
        { label: this.getNodeLabel(node.b), children: this.getNodeChildren(node.b, i*j, i), expanded: true });
      this.filesTree.push(
        { label: this.getNodeLabel(node.a.a), children: this.getNodeChildren(node.a, i*j + 2, i), expanded: true });
    } else if (node.a && !node.b) { // case nested bye
      this.filesTree.push(
        { label: this.getNodeLabel(null), expanded: true });
      this.filesTree.push(
        { label: this.getNodeLabel(node.a), children: this.getNodeChildren(node.a, i*j, i), expanded: true });
    } else { // normal case
      this.filesTree.push(
        { label: this.getNodeLabel(node.b), children: this.getNodeChildren(node.b, i*j, i), expanded: true });
      this.filesTree.push(
        { label: this.getNodeLabel(node.a), children: this.getNodeChildren(node.a, i*j + 2, i), expanded: true });
    }
  }
  getNodeLabel(node: TournamentNode | string): string {
    if (typeof node === 'string' || typeof node === 'undefined') {
      return node?.toString() || 'waiting opponent';
    }else if(typeof node !== 'string' && node?.a && node?.b){
      return 'waiting opponent';
    }
    else {
      return 'bye';

    }
  }

  getNodeChildren(node: TournamentNode | string, index: number, round:number) {
    if (round !== 0) {
      return [this.filesTree[index + 1], this.filesTree[index]]
    }
    else { return null }
  }
}
