import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Match, MatchState } from '@tn/src/app/pages/matches/match';
import { UserService } from '@tn/src/app/pages/users/user.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-score-dialog',
  templateUrl: './score-dialog.component.html',
  styleUrls: ['./score-dialog.component.scss']
})
export class ScoreDialogComponent implements OnInit {
  @Input() match: Match;
  @Input() visible: boolean;
  @Output() onCloseDialog = new EventEmitter();
  @Output() submitEvent = new EventEmitter();
  player1: string;
  player2: string;
  isReportable: boolean;
  scoreForm = new FormGroup({
    player1: new FormControl(),
    player2: new FormControl()
  })

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if (this.match.player1_id && this.match.player2_id) {
      combineLatest([
        this.userService.getById(this.match.player1_id),
        this.userService.getById(this.match.player2_id)
      ]).subscribe(([p1, p2]) => {
        this.player1 = p1.username;
        this.player2 = p2.username;
        const arrayScore = this.match.score.split('-');
        this.match.matchState === MatchState.readyToStart ? this.isReportable = true : this.isReportable = false;
        this.scoreForm.setValue({player1: parseInt(arrayScore[0]), player2: parseInt(arrayScore[1])})
      });
    }
  }

  cancel(){
    this.onCloseDialog.emit(false);
  }


  onSubmit() {
    ///TODO replace the checks with reactive forms validators
    if(this.scoreForm.value.player1 === this.scoreForm.value.player2){
      console.log("score must be different")
    }else{
      this.match.score = this.scoreForm.value.player1+"-"+this.scoreForm.value.player2
      if(this.scoreForm.value.player1 > this.scoreForm.value.player2){
        this.match.winner_id = this.match.player1_id;
        this.match.loser_id = this.match.player2_id;
      }else{
        this.match.winner_id = this.match.player1_id;
        this.match.loser_id = this.match.player2_id;
      }
      this.submitEvent.emit(this.match);
      this.cancel();
    }
  }

}
