import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  
  isAtTop: boolean = true;
  mobileNavOpen: boolean = false;

  constructor(private router: Router, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    // this.checkScrollPosition();
  }

  @HostListener("window:scroll", [])
  checkScrollPosition(): void {
    this.cdRef.detectChanges();
  }

  toggleMobileNav(): void {
    this.mobileNavOpen = !this.mobileNavOpen;
  }

  navigate(section: string): void {
    this.mobileNavOpen = false; // Close mobile menu on navigation
    this.router.navigate(['/'], { fragment: section });
  }

   ngAfterViewChecked()
  {
    if(this.router.url==='/'||this.router.url.includes('#')){

      this.isAtTop = true;
      this.isAtTop = window.scrollY < 50;

      this.cdRef.detectChanges();
    }else{
      this.isAtTop=false;
    }

  }

 
}
