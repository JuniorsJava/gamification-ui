import {Component, HostListener, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import * as _ from 'lodash';

import { GamificationService} from '../../service/gamification.service';
import { UserActivity } from '../../model/userActivity';
import { UserService } from '../../service/user.service';
import { User } from '../../model/user';
import { AllUsers } from '../../model/allUsers';

export enum KEY_CODE {
    UP_ARROW = 38,
    DOWN_ARROW = 40
}

@Component({
    selector: 'app-all-users-table',
    templateUrl: './all-users-table.component.html',
    styleUrls: ['./all-users-table.component.css'],
})

export class AllUsersTableComponent implements OnInit {
    title = 'All Users Table';
    userActivity: UserActivity[] = [];
    users: User[]= [];
    allUsers: AllUsers[] = [];
    key = '';
    counter = 0;
    selectedUser: UserActivity;
    selectedIndex: number;
    viewTable = false;

    constructor(
        private gamificationService: GamificationService,
        private userService: UserService,
        private router: Router
    ) {}


    ngOnInit(): void {
        this.getData();
    }

    private getData() {
        Observable.forkJoin(
            this.gamificationService.getPointSumForAllUsers(),
            this.userService.getAllUsers()
        ).subscribe(
            (data: Array<any>) => {
                this.userActivity = data[0];
                this.users = data[1];
                this.compoundData();
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    compoundData() {
        const merged: Array<any> = _(this.users) // start sequence
            .keyBy('uuid') // create a dictionary of the 1st array
            .merge(_.keyBy(this.userActivity, 'to')) // create a dictionary of the 2nd array, and merge it to the 1st
            .values() // turn the combined dictionary to array
            .value();

        merged.forEach(element => {
            if (element.hasOwnProperty('name') && element.hasOwnProperty('point')) {
                this.allUsers.push(element);
            } else if (element.hasOwnProperty('name') && !element.hasOwnProperty('point')) {
                element.point = 0;
                element.to = '';
                this.allUsers.push(element);
            }
        });
        this.viewTable = true;
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);
        if (event.keyCode === KEY_CODE.UP_ARROW) {
            this.selectedUser = this.allUsers[--this.selectedIndex];
        } else
        if (event.keyCode === KEY_CODE.DOWN_ARROW) {
            this.selectedUser = this.allUsers[++this.selectedIndex];
        }
    }

    onSelect(user: AllUsers, i: number): void {
        this.selectedUser = user;
        this.selectedIndex = i;
    }

    setKey = (th: string) => {
        this.counter === 2 ? this.counter = 0 : this.counter++;
        th === 'name' ? this.key = 'name' : this.key = 'point';
    }

    gotoDetail(uuid: string): void {
        this.router.navigate(['/user-details-table', uuid]);
    }
}