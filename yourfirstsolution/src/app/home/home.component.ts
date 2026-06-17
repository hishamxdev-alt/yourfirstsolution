import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'api.service';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router:Router,private route: ActivatedRoute,private apiService: ApiService) { }


  partners: any = [];

  arrayImages: any = [
    { title: 'food', 'src': 'assets/service/food.jpg','size':'medium' },
    { title: 'gym', 'src': '../../assets/service/gym.jpg','size':'medium' },
    { title: 'medical', 'src': '../../assets/service/medical.jpg','size':'medium' },
    { title: 'Mountain Sunrise', 'src': '../../assets/service/car.jpg','size':'medium' },
    { title: 'Mountain Sunrise', 'src': '../../assets/service/factory.jpg','size':'large' },
    { title: 'Mountain Sunrise', 'src': '../../assets/service/fashion.jpg','size':'medium' },
    { title: 'Mountain Sunrise', 'src': '../../assets/service/realestate-.jpg','size':'medium' },
 

  ];
  featured: any = [
    // {
    //   id: 1,
    //   title: "Your First Solution",
    //   sub_title: "The Key to Effective Marketing & Media Production, Who are we?",
    //   description: "The Key to Effective Marketing & Media Production, Who are we?",
    //   src_image: "../../assets/news/featured.jfif",
    //   publishDate: "16 March, 2024",
    //  },
    // {
    //   id: 2,
    //   title: "IFBB Pro Ahmed Shokrey",
    //   sub_title:'From Benha to Vegas: The Road to Mr. Olympia | The Untold Story of IFBB Pro Champion Ahmed Shokrey',
    //   description: "From Benha to Vegas: The Road to Mr. Olympia | The Untold Story of IFBB Pro Champion Ahmed Shokrey",
    //   src_image: "../../assets/news/ahmed-shokrey.jfif",
    //   publishDate: "7 December, 2024",
    //  },
    // {
    //   id: 3,
    //   title: "Elevating Fitness Branding in Egypt",
    //    sub_title:'Strategic Partnership with IFBB Pro Mohamed Embaby',
    //   description: "Strategic Partnership with IFBB Pro Mohamed Embaby",
    //   src_image: "../../assets/news/embaby-gym.jfif",
    //   publishDate: "3 March, 2025",
    //  },
    // {
    //   id: 4,
    //   title: "MaxGen Supplements",
    //    sub_title:'Transforming a Local Brand into a Global Powerhouse with Creativity and Innovative Designs.',
    //   description: "Transforming a Local Brand into a Global Powerhouse with Creativity and Innovative Designs.",
    //   src_image: "../../assets/news/eslam-syaha.jfif",
    //   publishDate: "29 April, 2024",
    //  }

  ];
blogs: any[] = [];
    // {
    //   id: 1,
    //   title: "Your First Solution",
    //   description: "The Key to Effective Marketing & Media Production, Who are we?",
    //   image: "../../assets/news/featured.jfif",
    //   publishDate: "16 March, 2024",
    //  },
    // {
    //   id: 2,
    //   title: "IFBB Pro Ahmed Shokrey",
    //   description: "From Benha to Vegas: The Road to Mr. Olympia | The Untold Story of IFBB Pro Champion Ahmed Shokrey",
    //   image: "../../assets/news/ahmed-shokrey.jfif",
    //   publishDate: "7 December, 2024",
    //  },
    // {
    //   id: 3,
    //   title: "Elevating Fitness Branding in Egypt",
    //   description: "Strategic Partnership with IFBB Pro Mohamed Embaby",
    //   image: "../../assets/news/embaby-gym.jfif",
    //   publishDate: "3 March, 2025",
    //  },
    // {
    //   id: 4,
    //   title: "MaxGen Supplements",
    //   description: "Transforming a Local Brand into a Global Powerhouse with Creativity and Innovative Designs.",
    //   image: "../../assets/news/eslam-syaha.jfif",
    //   publishDate: "29 April, 2024",
    //  }
  

  navigateToBlogDetail(blogId: number): void {
    this.router.navigate([`/blogs/${blogId}`]);
  }

  SectorDetails(sector: any = '') {
    console.warn(sector)
     this.router.navigate(['../sectordetail',{'sector':sector}]);

  }
  IsClassSize = true;

@ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;
showSoundButton = true;

enableSound() {
  const video = this.bgVideo.nativeElement;
  video.muted = false;
  video.play().catch(err => {
    console.error('Video play error:', err);
  });
  this.showSoundButton = false; // Hide button after enabling sound
}
  titleBeforeHighlight: string = ''
  highlightWord: string = ''
  subtitle: string = '';
  backgroundUrl : string = '';

videoUrl
  ngOnInit() {

    // this.apiService.getData('banner.php')
    //   .subscribe(res => {
    //     if (res.success) {
    //       this.subtitle = res.banner.subtitle;
    //       const words = res.banner.title.trim().split(' ');
    //       this.highlightWord = words.pop()!; // last word
    //       this.titleBeforeHighlight = words.join(' ');

    //       this.backgroundUrl = `url('${res.banner.background_image}'), var(--gradient-1)`;

    //     }

    //   });
    this.apiService.getData('banner.php')
  .subscribe(res => {
    if (res.success) {
      this.subtitle = res.banner.subtitle;

      const words = res.banner.title.trim().split(' ');
      this.highlightWord = words.pop()!;
      this.titleBeforeHighlight = words.join(' ');

      // Load video instead of background image
    this.videoUrl = `${res.banner.video}`;
    }
  });
    this.apiService.getData('get-news.php')
      .subscribe(res => {
        this.blogs = res
      }),
      error => { console.error('Failed to load blogs', error) }
     
    
      
    this.apiService.getData('get-featured.php')
         .subscribe(res => {
        this.featured = res
      }),
      error => { console.error('Failed to featured ', error) }
  }

getPartners() {
  this.apiService.getData('partners.php').subscribe({
    next: data => {
      this.partners = data.partners;

      setTimeout(() => {
        this.initPartnerCanvasSlider();  // initialize the canvas animation
      }, 300); // slight delay to ensure DOM is ready
    },
    error: err => console.error('Error loading partners', err)
  });
}

  
  
  ngAfterViewInit() {
    
      const vid = document.querySelector<HTMLVideoElement>('video.bg-video');
  if (vid) {
    vid.muted = true;
    vid.play().catch(() => console.log('Autoplay prevented'));
  }
    this.getPartners()
    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            if (sectionId) {
              history.replaceState(null, '', `#${sectionId}`);
            }
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px', // section must be centered in view
        threshold: 0
      }
    );

    sections.forEach(section => {
      observer.observe(section);
    });
    
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });

    
  let $animation_elements = $('.fade-in-section');
let $window = $(window);

function check_if_in_view() {
  let window_height = $window.height();
  let window_top_position = $window.scrollTop();
  let window_bottom_position = (window_top_position + window_height);

  $.each($animation_elements, function() {
    let $element = $(this);
    let element_height = $element.outerHeight();
    let element_top_position = $element.offset().top;
    let element_bottom_position = (element_top_position + element_height);

    //check to see if this current container is within viewport
    if ((element_bottom_position >= window_top_position) &&
      (element_top_position <= window_bottom_position)) {
       $element.addClass('is-visible');
    } else {
      // $element.removeClass('is-visible');
    }
  });
}

    $window.on('scroll resize', check_if_in_view);
    $window.trigger('scroll');

  
  
  }
initPartnerCanvasSlider() {
  const canvas = $('#partnerSlider')[0] as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  if (!canvas || !ctx) return;

  // Set canvas dimensions
  canvas.width = window.innerWidth;
  canvas.height = 150;

  let animationFrameId: number;
  let isAnimating = true;

  // Logo sizing and spacing
  const logoWidth = 180;
  const logoHeight = 140;
  const spacing = 80;
  let speed = 3;

  // Get logo image sources
const logos = this.partners.map(p => p.logo);
  const logoImages: { img: HTMLImageElement; x: number }[] = [];
  let loadedCount = 0;

  function draw() {
    if (!isAnimating) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    logoImages.forEach((logo) => {
      ctx.drawImage(
        logo.img,
        logo.x,
        (canvas.height - logoHeight) / 2,
        logoWidth,
        logoHeight
      );

      logo.x -= speed;

      // Wrap to the right
      if (speed > 0 && logo.x + logoWidth < 0) {
        const maxX = Math.max(...logoImages.map(l => l.x));
        logo.x = maxX + logoWidth + spacing;
      }

      // Wrap to the left
      if (speed < 0 && logo.x > canvas.width) {
        const minX = Math.min(...logoImages.map(l => l.x));
        logo.x = minX - logoWidth - spacing;
      }
    });

    animationFrameId = requestAnimationFrame(draw);
  }

  function startAnimation() {
    isAnimating = true;
    draw();
  }

  function stopAnimation() {
    isAnimating = false;
    cancelAnimationFrame(animationFrameId);
  }

  function initializeLogos() {
    logos.forEach((src, index) => {
      const img = new Image();
      img.src = src;

      img.onload = () => {
        loadedCount++;
        logoImages.push({ img, x: index * (logoWidth + spacing) });

        if (loadedCount === logos.length) {
          startAnimation();
        }
      };

      img.onerror = () => {
        console.warn('Failed to load image:', src);
      };
    });
  }

  // Controls
  $('#leftArrow').click(() => {
    speed = -Math.abs(speed); // Move left
  });

  $('#rightArrow').click(() => {
    speed = Math.abs(speed); // Move right
  });

  // Pause on hover
  $('#partnerSlider').hover(stopAnimation, startAnimation);

  // Start
  initializeLogos();
}
  
  
  
  featuredOffset = 0;
featuredVisibleCount = 3;

get visibleFeatured() {
  return this.featured?.slice(this.featuredOffset, this.featuredOffset + this.featuredVisibleCount);
}

nextFeatured() {
  if (this.featuredOffset + this.featuredVisibleCount < this.featured.length) {
    this.featuredOffset += this.featuredVisibleCount;
  }
}

prevFeatured() {
  if (this.featuredOffset - this.featuredVisibleCount >= 0) {
    this.featuredOffset -= this.featuredVisibleCount;
  }
}
  
  

}
