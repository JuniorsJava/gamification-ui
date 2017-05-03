import {Component, HostListener, OnInit} from '@angular/core';
import { GamificationService}            from '../../service/gamification.service';
import {UserActivity}                    from '../../model/userActivity';

export enum KEY_CODE {
    UP_ARROW = 38,
    DOWN_ARROW = 40
}

@Component({
    selector: 'gamification-table',
    templateUrl: 'app/components/table/table.component.html',
    styleUrls: ['app/components/table/table.component.css'],
})

export class TableComponent implements OnInit{
    title = 'Table';
    users: UserActivity[];
    key = '';
    counter = 0;
    selectedUser: UserActivity;
    selectedIndex: number;

    constructor(private gamificationService: GamificationService){}

    ngOnInit(): void {
        this.getPointSumForAllUsers();
    }

    private getPointSumForAllUsers() {
        this.gamificationService.getPointSumForAllUsers().subscribe(data => {
            this.users = data;
        });
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        if (event.keyCode === KEY_CODE.UP_ARROW){
            this.selectedUser = this.users[--this.selectedIndex];
        } else
        if (event.keyCode === KEY_CODE.DOWN_ARROW) {
            this.selectedUser = this.users[++this.selectedIndex];
        }
    }

    onSelect(user: UserActivity, i: number): void {
        this.selectedUser = user;
        this.selectedIndex = i
    }

    setKey = (th: string) => {
        this.counter === 2 ? this.counter = 0 : this.counter++;
        th === 'to' ? this.key = 'to' : this.key = 'point';
    };
}

