import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Tree } from 'primeng/tree/tree';
import { TreeNode } from 'primeng/api/treenode';
import { Round, TournamentNode } from '../tree';
import { MatchService } from '@tn/src/app/pages/matches/match.service';
import { Match } from '@tn/src/app/pages/matches/match';
import { Tournament } from '@tn/src/app/pages/tournaments/tournament';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { STATUS } from '@tn/../back/src/models/tournaments/tournament-status.enum';

@Component({
  selector: 'app-bracket-tree',
  templateUrl: './bracket-tree.component.html',
  styleUrls: ['./bracket-tree.component.scss']
})
export class BracketTreeComponent implements OnInit, AfterViewInit {
  @Input() tournament: Tournament;
  filesTree: TreeNode[] = [];
  allMatches: Match[];
  constructor(private matchService: MatchService) {
  }

  ngOnInit(): void {
    this.updateBracket();
  }

  ngAfterViewInit() {
    this.enableDragScroll();
  };

  updateBracket() {
    this.matchService.getTreeArraybyId(this.tournament._id).subscribe((tree) => {
      this.filesTree = tree;
    });
  }

  onMatchClick(i) {
    console.log(i)
  }

  addMatchClickEvents() {
    if (this.allMatches.length > 0) {
      for (let i = 1; i < this.allMatches.length; i++) {
        // Selecting the specific matches elements
        const ele = Array.from(document.getElementsByClassName(`match${i}`))[0].children[0].children[0].children[1].children[0];
        ele?.addEventListener('click', () => { this.onMatchClick(i) })
      }
      // last match is the mother node
      const lastEle = Array.from(document.getElementsByClassName(`match${this.allMatches.length}`))[0].children[0].children[0].children[0].children[0];
      lastEle?.addEventListener('click', () => { this.onMatchClick(this.allMatches.length) })
    }
  }
  enableDragScroll() {
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    let ele = Array.from(document.getElementsByClassName('ui-tree-horizontal'))[0] as HTMLElement;
    const mouseMoveHandler = (e) => {
      // How far the mouse has been moved
      const dx = pos.x - e.clientX;
      const dy = pos.y - e.clientY;

      // Scroll the element
      ele.scrollTop = pos.top - dy;
      ele.scrollLeft = pos.left - dx;
    };
    const mouseUpHandler = () => {
      ele.onmousemove = null;
      ele.style.cursor = 'grab';
    };
    const mouseDownHandler = (e) => {
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
    ele.onmousedown = mouseDownHandler;
    window.onmouseup = mouseUpHandler;
  }

}
