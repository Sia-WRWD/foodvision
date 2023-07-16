import { Component, ElementRef } from '@angular/core';
import { UserService } from '../user.service';
import { FormControl, Validators } from '@angular/forms';
import { nameValidator, usernameValidator } from '../../shared/validators/input-validator';
import { SlicePipe } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [SlicePipe]
})
export class ProfileComponent {

  userInfo: any;
  isEdit: boolean = false;
  selectedAllergens: any;

  email = new FormControl('', [Validators.required, Validators.email]);
  name = new FormControl('', [Validators.required, nameValidator]);
  username = new FormControl('', [Validators.required, usernameValidator]);

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    const token = sessionStorage.getItem('token')
    this.userService.fetchUserInfo(token).subscribe(res => {
      this.userInfo = res;
      this.setInitialInputsValues();
    });
  }

  setInitialInputsValues() {
    this.email.setValue(this.userInfo?.email);
    this.name.setValue(this.userInfo?.name);
    this.username.setValue(this.userInfo?.username);
  }

  resetInfo() {
    this.getUserInfo();
    this.isEdit = false;
    this.selectedAllergens = null;
  }

  updateInfo() {
    const email = this.email.value;
    const name = this.name.value;
    const username = this.username.value;
    const allergens = this.selectedAllergens;

    this.isEdit = false;
    this.selectedAllergens = null;
  }

  getErrorMessage() {
    if (this.email.hasError('required') || this.name.hasError('required') ||
      this.username.hasError('required')) {
      return 'Field cannot be empty!';
    }

    if (this.email.hasError('email')) {
      return 'Not a valid email!';
    }

    if (this.name.hasError('invalidName')) {
      return 'Not a valid name! (A-Z only)';
    }

    if (this.username.hasError('invalidUsername')) {
      return 'Not a valid username! (A-Z, 0-9 only)';
    }

    return '';
  }

  onAllergensSelectionChange(event: any) {
    this.selectedAllergens = event.value;
    this.userInfo.allergens = this.selectedAllergens;
  }

  parseItem(item: string) {
    return JSON.parse(item);
  }

  scrollTo(tag: string) {
    const historyElement = this.elementRef.nativeElement.querySelector(`#${tag}`);
    if (historyElement) {
      setTimeout(() => {
        historyElement.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
}

//Table Code
// bookmarkDataSource!: MatTableDataSource<any>;
// historyDataSource!: MatTableDataSource<any>;
// sortDirection: string = 'asc';

//Set Bookmark Table Data Source
// const parsedBookmarkData = this.userInfo.bookmark.map((item: any) => JSON.parse(item));
// this.bookmarkDataSource = new MatTableDataSource(parsedBookmarkData);
//Set History Table Data Source
// const parsedHistoryData = this.userInfo.history.map((item: any) => JSON.parse(item));
// this.historyDataSource = new MatTableDataSource(parsedHistoryData);

// toggleSortDirection() {
//   this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
//   this.bookmarkDataSource.data = this.bookmarkDataSource.data.sort((a, b) => {
//     const dateA = new Date(a['last_added']);
//     const dateB = new Date(b['last_added']);

//     if (this.sortDirection === 'asc') {
//       return dateA.getTime() - dateB.getTime();
//     } else {
//       return dateB.getTime() - dateA.getTime();
//     }
//   });
// }