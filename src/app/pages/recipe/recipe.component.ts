import { Component } from '@angular/core';
import { UserService } from '../user/user.service';
import { SharedService } from '../shared/shared.service';
import { ActivatedRoute } from '@angular/router';
import { faClock, faUpRightFromSquare, faBookmark, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
  providers: [DatePipe]
})
export class RecipeComponent {

  recipeInfo: any;
  recipeFood!: string;
  isStrikedThrough: boolean[][] = [];

  userInfo: any;
  isBookmarked: boolean = false;

  faClock = faClock;
  faUpRightFromSquare = faUpRightFromSquare;
  faBookmark = faBookmark;
  faCircleXmark = faCircleXmark;

  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.getRecipeInfo();
    this.getUserInfo();
  }

  getRecipeInfo() {
    this.route.queryParams.subscribe(params => {
      this.recipeFood = params['food'] || null;

      this.sharedService.getRecipeInfo(this.recipeFood).subscribe(res => {
        this.recipeInfo = res;
        this.isStrikedThrough = this.recipeInfo[1].map(() => []);
      })
    });
  }

  getFoodName() {
    return this.recipeFood.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  AddStrikeThrough(sectionIndex: number, ingredientIndex: number) {
    this.isStrikedThrough[sectionIndex][ingredientIndex] = !this.isStrikedThrough[sectionIndex][ingredientIndex];
  }

  directSource() {
    window.open(this.recipeInfo?.[0]?.source, "_blank");
  }

  getUserInfo() {
    const token = sessionStorage.getItem("token");

    this.userService.fetchUserInfo(token).subscribe(res => {
      this.userInfo = res;
      const filteredBookmarks = this.userInfo.bookmark
        .map((item: any) => JSON.parse(item)) // Parse the strings into objects
        .filter((item: any) => item.food === this.recipeFood);
      if (filteredBookmarks.length > 0) {
        this.isBookmarked = true;
      } else {
        this.isBookmarked = false;
      }
    })
  }

  addToBookmark() {
    const token = sessionStorage.getItem("token")!;
    const food = this.recipeFood;
    const last_added = this.getFormattedDate();
    const formattedValue = `{"food": "${food}", "last_added": "${last_added}"}`;

    this.userService.updateBookmark(token, formattedValue, "add").then(res => {
      if (res == "Added Food to Bookmark!") {
        this.getUserInfo();
        this.sharedService.showSnackbar(`Successfully added ${this.getFoodName()} to your bookmark! ✅`, "ok");
      } else {
        this.getUserInfo();
        this.sharedService.showSnackbar("Something went wrong, please try again later. ⚠️", "ok");
      }
    })
  }

  getFormattedDate(): string {
    const date = new Date();
    return this.datePipe.transform(date, 'dd/MM/yyyy')!;
  }

  removeFromBookmark() {
    const token = sessionStorage.getItem("token")!;

    this.userService.updateBookmark(token, this.recipeFood, "remove").then(res => {

      if (res == "Removed Food from Bookmark!") {
        this.getUserInfo();
        this.sharedService.showSnackbar(`Successfully removed ${this.getFoodName()} from your bookmark! ✅`, "ok");
      } else {
        this.getUserInfo();
        this.sharedService.showSnackbar("Something went wrong, please try again later. ⚠️", "ok");
      }
    })
  }
}
