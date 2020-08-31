import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { UtilService } from 'src/app/shared/services/util.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  constructor(private userService: UserService, public utilService: UtilService) { }
  userList: User[]
  ngOnInit(): void {
    this.userService.getAll().subscribe((users)=>{
      this.userList = users;
    })
  }
  getAge(date: string){
    return this.utilService.calculateAge(date);
  }
}
