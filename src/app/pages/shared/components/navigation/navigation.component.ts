import { Component, HostBinding } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  @HostBinding('class') className = '';
  toggleControl = new UntypedFormControl(false);
  user: boolean = false;
  userData: any;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private overlayContainer: OverlayContainer,
  ) { }

  ngOnInit(): void {
    this.changeTheme();
  }

  changeTheme() {
    this.toggleControl.valueChanges.subscribe(val => {
      const darkModeClass = 'unicorn-dark-theme';
      this.className = val ? darkModeClass : '';

      const classes = this.overlayContainer.getContainerElement().classList;
      if (val) {
        classes.add(darkModeClass);
      } else {
        classes.remove(darkModeClass);
      }

      this.changeBackground(val);
    })
  }

  changeBackground(val: any) {
    var contentBackground = document.getElementById("content-background");

    if (val) {
      contentBackground!.style.backgroundImage = "url('../../../assets/background/bg-dark.jpg')";
    } else {
      contentBackground!.style.backgroundImage = "url('../../../assets/background/bg-light.jpg')";
    }
  }
}
