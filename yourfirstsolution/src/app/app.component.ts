import { Component } from '@angular/core';
import { ApiService } from 'api.service';
 
declare var $
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Your First Solution';

  constructor(private apiService: ApiService) {}




  ngAfterViewInit() {
    setTimeout(() => {
      this.apiService.trackVisitor();
      
    }, 1000);

  
  
// //Preloader
	$(window).on('load', function() {
		$("#preloader").delay(900).fadeOut();
  });
  


  }

  ngOnInit() {
  }

  ngOnDestroy() {

  }

}
