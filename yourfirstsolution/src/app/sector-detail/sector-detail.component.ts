import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'api.service';
declare var $: any;

@Component({
  selector: 'app-sector-detail',
  templateUrl: './sector-detail.component.html',
  styleUrls: ['./sector-detail.component.css']
})
  
export class SectorDetailComponent implements OnInit {

  constructor(  private Activerouter: ActivatedRoute,private apiService: ApiService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.fetchMedia( )
   
  }
 


  videos = [
  
    

    
    // { id: 'tvbji17CfSU', title: ' ' ,category: 'Commercial'},
    // { id: 'VotynJhecmI', title: ' ' ,category: 'Commercial'},
    // { id: 'pOqwS9bG-3o', title: ' ' ,category: 'Commercial'},
    // { id: '5QtDvia7Usc', title: ' ' ,category: 'Commercial'},
    // { id: 'orfGfQd7Huo', title: ' ' ,category: 'Commercial'},
    // { id: 'e-4a6wvDvfs', title: ' ' ,category: 'Commercial'},
    // { id: 'orfGfQd7Huo', title: ' ', category: 'Commercial' },
    // { id: 'https://drive.google.com/file/d/12x3IjO3KYwstW1JzTMGy-lArWrLz_LrP/view', title: ' ', category: 'Commercial' },

    

    // { id: 'hFiWdHvNkds', title: ' ', category: 'Vlogs' },
    // { id: '9LFPxmAGibw', title: ' ', category: 'Vlogs' },
    // { id: 'gtQPfCloQpo', title: ' ', category: 'Vlogs' },

    

    // { id: 'RLPn1FfNb6c', title: ' ' ,category: 'Interview Show'},
    // { id: 'aJTJqU7t6Ow', title: ' ' ,category: 'Interview Show'},
    // { id: 'w445_Fay61o', title: ' ', category: 'Interview Show' },
    // { id: 'FXA_foZV6BY', title: ' ', category: 'Interview Show' },
    // { id: '1DY2h9VCAVM', title: ' ', category: 'Interview Show' },
        
    // { id: '5N8OlY--KWc', title: ' ' ,category: 'Interview Show'},
    // { id: 'uHATo5KzLdI', title: ' ' ,category: 'Interview Show'},
    // { id: 'IBMPKvy1bj4', title: ' ' ,category: 'Interview Show'},
    // { id: '4JFWc9IfIwc', title: ' ' ,category: 'Interview Show'},
    // { id: 'ofp0WOrUrtk', title: ' ' ,category: 'Interview Show'},
    // { id: 'BzXqwktPqtU', title: ' ' ,category: 'Interview Show'},
    // { id: '3j1gpKIxl2o', title: ' ' ,category: 'Interview Show'},
    // { id: 'gQMnS1SofWM', title: ' ' ,category: 'Interview Show'},
    // { id: 'XYbnpbVjAjg', title: ' ' ,category: 'Interview Show'},
    // { id: 'UqvGXtfYtj8', title: ' ', category: 'Interview Show' },
        
    // { id: 'fgKfhPWA9Hs', title: ' ', category: 'Documentary Films' },
    // { id: 'WC0KzNsskgo', title: ' ', category: 'Documentary Films' },

    // { id: 'M2QzVZScR4c', title: ' ', category: 'Reels & Shorts' },
    // { id: '9dIopxisQRk', title: ' ', category: 'Reels & Shorts' },
    // { id: 'f7qvleS6e8Q', title: ' ', category: 'Reels & Shorts' },
    // { id: 'oMZCIeDrjKY', title: ' ', category: 'Reels & Shorts' },
    // { id: 'ktAa-9kSLAQ', title: ' ', category: 'Reels & Shorts' },
    // { id: 'Iwv6K5Z_wXs', title: ' ', category: 'Reels & Shorts' },
    // { id: 'vhVg2XLV5ng', title: ' ', category: 'Reels & Shorts' },
    // { id: 'ZbqGeDMUTsA', title: ' ', category: 'Reels & Shorts' },
    // { id: 'f7qvleS6e8Q', title: ' ', category: 'Reels & Shorts' },

    // { id: 'orNxu5csC30', title: ' ', category: 'Motion Graphics' },
    // { id: 'ovytuKB7gA4', title: ' ', category: 'Motion Graphics' },
    // { id: 'https://www.behance.net/embed/project/122205139?ilo0=1' , category: 'Motion Graphics'},
    // { id: 'https://www.behance.net/embed/project/122368965?ilo0=1' , category: 'Motion Graphics'},
    // { id: 'https://player.vimeo.com/video/723793871?h=485373700d' , category: 'Motion Graphics'},
    // { id: 'https://drive.google.com/file/d/12x3IjO3KYwstW1JzTMGy-lArWrLz_LrP/view?usp=sharing', category: 'Motion Graphics' },
    
  ];


categories = [
  { name: 'Commercial', id: 1 },
  { name: 'Interview Show', id: 2 },
  { name: 'Vlogs', id: 3 },
  { name: 'Documentary Films', id: 4 },
  { name: 'Reels', id: 5 },
  { name: 'Motion Graphics', id: 6 },
  { name: 'Creative Ads', id: 7 }
];
  selectedCategory: string = 'Commercial';
  
 newVideoUrl: string = '';

  fetchMedia() {
        $('#preloader').fadeIn();

  this.apiService.getData(`media.php?category=${this.selectedCategory}`).subscribe({
    next: data => {
      this.videos = data.videos;
          $('#preloader').fadeOut();

     },
    error: err => {
      console.error(`Error loading ${name}`, err);
      $('#preloader').fadeOut();
    }
    
  });
}
  

  filterVideos() {
    // this.selectedCategory === 'All' ? this.videos  :
    return  this.videos.filter(video => video.category === this.selectedCategory);
  }

  setCategory(category: string) {
    this.selectedCategory = category;
    this.fetchMedia( )
  }
  

  getEmbedUrl(videoId: string): string {
    if (videoId.startsWith('http')) {
      return videoId;  // Return the URL as it is if it already contains 'https:'
    } else {
      return `https://www.youtube.com/embed/${videoId}`;  // Format it as a YouTube embed URL
    }
  }
  Banner='../../assets/sectors/banner-default.png'
  subHeader = '';
  IsClassSize = true;
  sector: any = '';
  arrayImages = [];
  sectorHeader: any = '';
  sectionId = 1;
  ngAfterViewInit() {
    this.sector = this.Activerouter.snapshot.paramMap.get('sector')
    if (this.sector == 'food') {
    //  this.arrayImages = this.food;
      this.sectorHeader = 'Food & Beverage'
      this.subHeader='home/sectors/food'
      this.sectionId = 7;
    } if (this.sector == 'sports') {
   //   this.arrayImages = this.gym;
      this.sectorHeader = 'Sports and Nutrition'
      this.subHeader = 'home/sectors/sports'
      this.Banner='../../assets/sectors/gym/banner.jpg'
      this.sectionId = 8;

    }    if (this.sector == 'medical') {
      this.sectorHeader = 'Medical'
      this.subHeader='home/sectors/medical'
   //  this.arrayImages = this.Medical
      this.sectionId = 9;

    }    if (this.sector == 'car') {
      this.sectorHeader = 'Cars & Automotive'
      this.subHeader='home/sectors/cars'
  //    this.arrayImages = this.car
      this.sectionId = 10;

    }
    if (this.sector == 'factory') {
      this.sectorHeader = 'Manufacturing & Construction'
      this.subHeader='home/sectors/manufacturing'
    //  this.arrayImages = this.factory
      this.sectionId = 11;

    }
    if (this.sector == 'realestate') {
      this.sectorHeader = 'Realestate'
      this.subHeader='home/sectors/realestate'
   //   this.arrayImages = this.realestate
      this.sectionId=13
    }
    if (this.sector == 'fashion') {
      this.sectorHeader = 'Fashion & Beauty'
      this.subHeader='home/sectors/fashion'
   //   this.arrayImages = this.fashion;
      this.sectionId=12
    }
    



      if (this.sector == 'media') {
      this.sectorHeader='Media & Production'
      this.subHeader='home/services/media'
        this.sectionId = 6;
    }
    if (this.sector == 'modeling') {
      this.sectorHeader = 'Modeling Service'
      this.subHeader='home/services/modelingService'
      this.sectionId=1
    //  this.arrayImages=this.Modeling
    }
    if (this.sector == 'branding') {
      this.sectorHeader = 'Branding'
      this.subHeader = 'home/services/branding'
   //   this.arrayImages = this.Branding
      this.sectionId=2
    }
    if (this.sector == 'social') {
      this.sectorHeader = 'Social Media'
      this.subHeader='home/services/socialmedia'
   //   this.arrayImages = this.Social
      this.sectionId=3
    }

    if (this.sector == 'photography') {
      this.sectorHeader = 'Photography'
      this.subHeader='home/services/photography'
    //  this.arrayImages = this.Photography
      this.sectionId=5
    }

    if (this.sector == 'campaigns') {
      this.sectorHeader = 'Offline Campaings  & Digital Printing'
      this.subHeader='home/services/offlineCampaings'
   //   this.arrayImages = this.Campaigns
      this.sectionId=4
    }
    

   this.getSection(this.sectionId , this.sector)
    
   }
 
  getSection(sectionid: number, name: string) {
   $('#preloader').fadeIn();

  this.apiService.getData(`get-section.php?section=${sectionid}`).subscribe({
    next: data => {
      this.arrayImages = data;
       $('#preloader').fadeOut();

     },
    error: err => {
      console.error(`Error loading ${name}`, err);
           $('#preloader').fadeOut();
}
  });
}
  
  food = [
  
 
    // { title: '', src: '../../assets/sectors/food/1.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/food/2.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/food/3.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/food/4.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/food/5.jpg', 'size': 'banner' },
 
 
  ];

  gym = [
    // { title: '', src: '../../assets/sectors/gym/1.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/gym/2.jpg' ,'size':'banner'},
    // { title: '', src: '../../assets/sectors/gym/3.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/gym/4.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/gym/5.jpg','size':'banner' },

  ];
  Medical = [
    // { title: 'CLINICS', src: '../../assets/sectors/medical/1.jpg','size':'banner' },
    // { title: 'HEALTH', src: '../../assets/sectors/medical/2.jpg' ,'size':'banner'},
    // { title: 'BEAUTY AND WEALTHNESS', src: '../../assets/sectors/medical/3.jpg','size':'banner' },
   

  ];
  car = [
    // { title: 'NISSAN', src: '../../assets/sectors/car/1.jpg','size':'banner' },
 

  ];
  factory = [
    // { title: 'CONSTRUCTION', src: '../../assets/sectors/factory/1.jpg','size':'banner' },
    // { title: 'SAFETY', src: '../../assets/sectors/factory/2.jpg','size':'banner' },


  ];
  realestate = [
    // { title: '', src: '../../assets/sectors/realestate/1.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/realestate/2.jpg','size':'banner' },


  ];
  fashion = [
    // { title: '', src: '../../assets/sectors/fashion/1.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/fashion/2.jpg','size':'banner' },


  ];

          // services
  Modeling = [
    // { title: 'Yusuf Fitness', src: '../../assets/sectors/modeling-service/yusuf-fitness.jpg','size':'banner' },
    // { title: 'Natalie Kosiba', src: '../../assets/sectors/modeling-service/natalie.jpg','size':'banner' },
    // { title: 'Julia Vermeniska', src: '../../assets/sectors/modeling-service/julia-vermeniska.jpg','size':'banner' },
    // { title: 'Lia Angelova', src: '../../assets/sectors/modeling-service/lia-angelova.jpg','size':'banner' },
    // { title: 'Ahmed Shokry', src: '../../assets/sectors/modeling-service/ahmed-shokry.jpg','size':'banner' },

     
  ];
  Branding = [
    // { title: '', src: '../../assets/sectors/branding/1.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/branding/2.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/branding/6.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/branding/3.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/branding/4.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/branding/5.jpg','size':'banner' },


     
  ];
  Social = [
    // { title: 'Designing & Branding for social media', src: '../../assets/sectors/social/1.jpg','size':'banner' },
 
  ]

  Photography = [
    // { title: 'Sports', src: '../../assets/sectors/photography/1.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/photography/2.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/photography/3.jpg','size':'banner' },
    // { title: 'Food', src: '../../assets/sectors/photography/4.jpg','size':'banner' },
    // { title: 'Fashion', src: '../../assets/sectors/photography/5.jpg','size':'banner' },


     
  ];

  Campaigns = [
    // { title: '', src: '../../assets/sectors/campains/1.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/campains/2.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/campains/3.jpg','size':'banner' },
    // { title: '', src: '../../assets/sectors/campains/4.jpg','size':'banner' },

  ];



}
