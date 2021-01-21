import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Tree } from 'primeng/tree/tree';
import { TreeNode } from 'primeng/api/treenode';
import { Round, TournamentNode } from '../tree';
import { MatchService } from '@tn/src/app/pages/matches/match.service';
import { Match } from '@tn/src/app/pages/matches/match';
import { Tournament } from '@tn/src/app/pages/tournaments/tournament';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { debounceTime, filter, take } from 'rxjs/operators';
import { STATUS as TnStatus } from '../../../../../../back/src/models/tournaments/tournament-status.enum';

@Component({
  selector: 'app-bracket-tree',
  templateUrl: './bracket-tree.component.html',
  styleUrls: ['./bracket-tree.component.scss']
})
export class BracketTreeComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() tournament: Tournament;
  @Input() allMatches: Match[];
  filesTree: TreeNode[] = [];
  showScoreDialog$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentMatchDisplayed: Match;

  constructor(private matchService: MatchService) {
  }

  ngOnInit(): void {
    this.updateBracket();
  }

  ngOnChanges():void{
    this.updateBracket();
    console.log("some change")
  }

  ngAfterViewInit() {
    this.enableDragScroll();
  };

  updateBracket() {
    this.matchService.getTreeArraybyId(this.tournament._id).subscribe((tree) => {
      this.filesTree = tree;
    });
  }

  showMatch(event){
    // checks if tournament is on, and has children (not players at the leftmost bracket)
    console.log(this.tournament)
    if(this.tournament.status === TnStatus.ongoing && event.node.children !== null){
      this.showScoreDialog$.next(true);
      this.currentMatchDisplayed = this.allMatches[event.node?.identifier - 1];
    }
  }

  onScoreDialogClose(bool) {
    this.showScoreDialog$.next(bool);
    this.currentMatchDisplayed = null;
  }

  onScoreDialogSubmit(match) {
    this.matchService.reportMatch(match).pipe(
      take(1)
    ).subscribe(() => {
      this.updateBracket();
    });
  }

  enableDragScroll() {
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    let ele = Array.from(document.getElementsByClassName('p-tree-horizontal'))[0] as HTMLElement;
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
