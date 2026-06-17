import { Component, OnInit } from '@angular/core';
import { ApiService } from 'api.service';
declare var $: any;

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getPartners();
  }
  

getPartners() {
  this.apiService.getData('partners.php').subscribe({
    next: data => {
      this.partners = data.partners;
 
    },
    error: err => console.error('Error loading partners', err)
  });
}
  
  partners: any = []
  

 


}
