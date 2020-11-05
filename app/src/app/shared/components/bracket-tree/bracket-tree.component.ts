import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Tree } from 'primeng/tree/tree';
import { TreeNode } from 'primeng/api/treenode';
import { Round, TournamentNode } from '../tree';
import { cpuUsage } from 'process';
import { MatchService } from '@tn/src/app/pages/matches/match.service';

@Component({
  selector: 'app-bracket-tree',
  templateUrl: './bracket-tree.component.html',
  styleUrls: ['./bracket-tree.component.scss']
})
export class BracketTreeComponent implements OnInit {
  @Input() tournament_id: string;
  expandingTree: Tree;
  filesTree: TreeNode[] = [];
  selectedFile: TreeNode;
  indexIncremator = 0;
  constructor(private matchService:MatchService) {
  }

  ngOnInit(): void {
    this.matchService.getTreeArraybyId(this.tournament_id).subscribe((tree) => {
      this.filesTree = tree;
  })
  }

}
