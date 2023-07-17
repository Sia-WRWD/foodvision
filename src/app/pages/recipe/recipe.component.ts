import { Component } from '@angular/core';
import { UserService } from '../user/user.service';
import { SharedService } from '../shared/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent {

  recipeInfo: any;
  recipeFood!: string;

  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getRecipeInfo();
  }

  getRecipeInfo() {
    this.route.queryParams.subscribe(params => {
      this.recipeFood = params['food'] || null;

      this.sharedService.getRecipeInfo(this.recipeFood).subscribe(res => {
        this.recipeInfo = res;
        console.log(this.recipeInfo);
      })
    });
  }

}
