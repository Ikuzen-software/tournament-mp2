import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
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
export class BracketTreeComponent implements OnInit, AfterViewInit {
  @Input() tournament_id: string;
  expandingTree: Tree;
  filesTree: TreeNode[] = [];
  selectedFile: TreeNode;
  indexIncremator = 0;
  constructor(private matchService: MatchService) {
  }

  ngOnInit(): void {
    this.matchService.getTreeArraybyId(this.tournament_id).subscribe((tree) => {
      this.filesTree = tree;
    })
  }

  ngAfterViewInit() {
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    let ele = Array.from(document.getElementsByClassName('ui-tree-horizontal'))[0] as HTMLElement;
    const mouseMoveHandler = function (e) {
      // How far the mouse has been moved
      const dx = pos.x - e.clientX;
      const dy =  pos.y - e.clientY;

      // Scroll the element
      ele.scrollTop = pos.top - dy;
      ele.scrollLeft = pos.left - dx;
    };
    const mouseUpHandler = function () {
      ele.onmousemove = null
      ele.style.cursor = 'grab';
    };
    const mouseDownHandler = function (e) {
      ele.onmousemove = mouseMoveHandler
      ele.style.cursor = 'grabbing';
      ele.style.userSelect = 'none';
      pos = {
        // The current scroll 
        left: ele.scrollLeft,
        top: ele.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
      };
    }
    ele.onmousedown = mouseDownHandler
    window.onmouseup = mouseUpHandler

  }

}
