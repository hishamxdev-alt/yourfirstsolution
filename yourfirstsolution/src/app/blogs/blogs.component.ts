import { Component, OnInit } from '@angular/core';
import { ApiService } from 'api.service';

declare var $;

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {

  constructor(private apiService: ApiService,) { }

  ngOnInit(): void {
    this.fetchNews()

    window.scrollTo(0, 0);
   
  }
  blogs: any = [
 
  ];
      fetchNews() {
       $('#preloader').fadeIn();
    this.apiService.getData('get-news.php').subscribe({
      next: data => {
        this.blogs = data
  
        
        $('#preloader').fadeOut();
      },
      error: err => {
        console.error('Error loading news', err)
       $('#preloader').fadeOut();
    }
    });
    }
}
