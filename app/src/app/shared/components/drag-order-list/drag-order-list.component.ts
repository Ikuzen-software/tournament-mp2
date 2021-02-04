import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-drag-order-list',
  templateUrl: './drag-order-list.component.html',
  styleUrls: ['./drag-order-list.component.scss'] 
})
export class DragOrderListComponent implements OnInit {
  @Input() list: any[];
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  shuffle(){
      let currentIndex = this.list.length, temporaryValue, randomIndex;
    
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = this.list[currentIndex];
        this.list[currentIndex] = this.list[randomIndex];
        this.list[randomIndex] = temporaryValue;
      }
      this.cd.detectChanges();
  }

}
