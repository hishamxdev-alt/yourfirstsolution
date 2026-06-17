import { Component, OnInit } from '@angular/core';
import { ApiService } from 'api.service';
declare var $;
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  contactData: any = { 'name': '', 'email': '', 'subject':'','message':''}
  
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
   
  }
  ngAfterViewInit()
  {
	
 
  
// //Preloader
	$(window).on('load', function() {
		$("#preloader").delay(800).fadeOut();
  });
  


  }
  responseMessage = '';

  onSubmit(event) {
    console.warn(event)
    let contactData = event.form.value
      $('#preloader').fadeIn();

    this.apiService.postData('contact-us.php', contactData).subscribe(
      response => {
         this.responseMessage = 'Thank you for contacting us! We will get back to you shortly.';
         $('#preloader').fadeOut();
        alert(this.responseMessage);

      },
      error => {
         $('#preloader').fadeOut();
        this.responseMessage = 'There was an issue submitting your message. Please try again later.';
      }
    )

  }
}
