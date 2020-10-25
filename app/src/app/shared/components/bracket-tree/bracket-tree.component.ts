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
  @Input() treeArray: any;
  expandingTree: Tree;
  filesTree: TreeNode[] = [];
  selectedFile: TreeNode;
  indexIncremator = 0;
  constructor() {
  }

  ngOnInit(): void {
    this.filesTree = this.treeArray
  }

}
