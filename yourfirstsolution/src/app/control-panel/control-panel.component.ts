import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'api.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare var $;
interface SectionItem {
  title: string;
  image_src: string;      // This holds either preview or uploaded URL
  imageUrl: string;
  previewFile?: File;     // New: holds selected image file before upload
  previewUrl?: string;    // New: stores base64 preview
  size: string;
  section_id: number;
  id: number;
}
@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css'],
  // encapsulation: ViewEncapsulation.ShadowDom
})
export class ControlPanelComponent implements OnInit {

  constructor(private apiService: ApiService,private sanitizer: DomSanitizer) {
    this.showLogin = true;
  }
sanitizeUrl(url: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}
  
  ngOnInit(): void {
    this.loadBanner();
    const token = sessionStorage.getItem('authToken');
    this.showLogin = !token;
 
  }

  ngOnDestroy() {
    sessionStorage.removeItem('authToken');
  }


  ngAfterViewInit() {
    $(document).ready(function () {
      $('.panel-content').hide();
      $('#dashboard').show();

      $('.nav-link').click(function () {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');

        var panelId = $(this).data('target');
        $('.panel-content').hide();
        $('#' + panelId).show();
      });
    });
    $("#nav").css("visibility", "hidden"); // Hide



    this.GetVisitorData()
    this.GetContactUsData()

  }


  updateCharts() {
    const visitorsCtx = document.getElementById('visitorsChart') as HTMLCanvasElement;
    new Chart(visitorsCtx, {
      type: 'doughnut',
      data: {
        labels: ['Desktop', 'Mobile'],
        datasets: [{ data: [60, 40], backgroundColor: ['#ff00c1', '#9234a5'] }]
      }
    });
    const viewsCtx = document.getElementById('viewsChart') as HTMLCanvasElement;

    new Chart(viewsCtx, {
      type: 'line',
      data: {
        labels: ['Desktop', 'Mobile'], // Replace with real data
        datasets: [{
          label: 'Reach',
          data: [this.visitorStats.desktop_visits, this.visitorStats.mobile_visits],
          backgroundColor: ['#9234a5', '#ff00c1']
        }]
      }
    });
  }



  visitorStats: any = { total_visitors: 0, desktop: 0, mobile: 0 };

  GetVisitorData() {
    this.apiService.getData('visitors.php').subscribe(
      (data) => {
        this.visitorStats = data;
        this.updateCharts();
      },
      (error) => {
        console.error('Error fetching visitor data:', error);
      }
    );
  }
  contactData: any = [];
  GetContactUsData() {
    this.apiService.getData('get-contacts.php').subscribe(
      (data) => {
        this.contactData = data;

      },
      (error) => {
        console.error('Error fetching contact data:', error);
      }
    );
  }

  deleteContact(id: number) {

    this.apiService.deleteData('delete-contact.php', { 'ID': id }).subscribe({
      next: (response) => {
        alert(response['message'])
        this.GetContactUsData(); // Refresh the list after deletion
      },
      error: (error) => {
        alert('Error deleting contact:')

        console.error('Error deleting contact:', error);
      }
    });
  }


  //! banner

  banner = {
    id: null,
    title: '',
    subtitle: '',
    background_image: '',
    video:''
  };

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  loadBanner(): void {
    $('#preloader').fadeIn();
    this.apiService.getData('banner.php').subscribe(response => {
      if (response.success && response.banner) {
        this.banner = response.banner;
        this.banner.id = response.banner.id;
        this.imagePreview = response.banner.background_image;
        this.videoPreview = response.banner.video;

      }
      $('#preloader').fadeOut();
    }, error => {
      $('#preloader').fadeOut();
    });
  }

    previewImage(event: any) {
    const file = event.target.files[0];
    if (file) {
    //  this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }


  videoPreview: string | ArrayBuffer | null = null;

previewVideo(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
           if (file.size > 10 * 1024 * 1024) {
      alert('❌ Video too large. Please upload a file under 10MB.');
      return;
        }
    
    
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.videoPreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

submitBanner() {
  const formData = new FormData();
  formData.append('title', this.banner.title);
  formData.append('subtitle', this.banner.subtitle);

  if (this.selectedFile) {
    formData.append('video', this.selectedFile); // must match PHP's $_FILES['video']
  }

  if (this.banner.id) {
    formData.append('id', this.banner.id);
  }
    $('#preloader').fadeIn();

  this.apiService.postFormData('banner.php', formData).subscribe(res => {
    console.log(res);
    alert('✅ Banner added successfully');
        $('#preloader').fadeOut();

  }, error => {
    $('#preloader').fadeOut();
            alert('✅ ❌ Upload failed');

  });
}

  //! news

  news: any = [];
  featured: any = [];


  //! service  & sectors


  section: { ID: number, name: string }[] = [
    { ID: 1, name: 'modeling' },
    { ID: 2, name: 'branding' },
    { ID: 3, name: 'social' },
    { ID: 4, name: 'offline campaigns' },
    { ID: 5, name: 'photography' },
    { ID: 6, name: 'media production' }


  ];
  sectors: { ID: number, name: string }[] = [
    { ID: 7, name: 'food' },
    { ID: 8, name: 'sports' },
    { ID: 9, name: 'medical' },
    { ID: 10, name: 'cars' },
    { ID: 11, name: 'manufacturing' },
    { ID: 12, name: 'fashion' },
    { ID: 13, name: 'realestate' }


  ];

  partners: any[] = [];

  activeSection = 'modeling';


  sectionData = {};


  items: any = []

  activePanel: string = 'dashboard';

  sidebarClick(panel: string) {
    this.activePanel = panel;

    if (panel === 'section') {
      this.activeSection = this.section[0]['name']
      this.fetchSection(this.section[0]['ID'], this.section[0]['name']);
    }
    else if (panel === 'sector') {
      this.activeSection = this.sectors[0]['name']
      this.fetchSection(this.sectors[0]['ID'], this.sectors[0]['name']);

    } else if (panel === 'partners') {
      this.activeSection = 'partners',

        this.fetchPartners();
    } else if (panel === 'news') {
      this.activeSection = 'news',
        this.fetchNews();
    } else if (panel === 'featured') {
      this.activeSection = 'featured',
        this.fetchFeatured();
    } else if (panel === 'media-production') {
         this.fetchMedia()
    }
    
  
  }
  activeSectionId: any = 1;
  switchSection(name: string, ID: number) {
    this.activeSection = name;
    this.activeSectionId = ID;
    this.fetchSection(ID, name);
  }

  fetchSection(sectionid: number, name: string) {
    $('#preloader').fadeIn();
    this.apiService.getData(`get-section.php?section=${sectionid}`).subscribe({
      next: data => {
        this.items = data;
        this.sectionData[name] = data;
        $('#preloader').fadeOut();
      },
      error: err => {
        $('#preloader').fadeOut();
        this.items = [];
        this.sectionData[name] =  [];
      },
    });
  }

  fetchPartners() {
    $('#preloader').fadeIn();
    this.apiService.getData('partners.php').subscribe({
      next: data => {
        this.partners = data.partners;
        this.sectionData['partners'] = data.partners;
        $('#preloader').fadeOut();
      },
      error: err => {
        $('#preloader').fadeOut();
       this.partners = [];
       this.sectionData['partners'] =  [];
      }

    });
  }

  fetchNews() {
    $('#preloader').fadeIn();
    this.apiService.getData('get-news.php').subscribe({
      next: data => {
        this.news = data
        this.sectionData['news'] = data;
        $('#preloader').fadeOut();
      },
      error: err => {
        $('#preloader').fadeOut();
             this.news = [];
       this.sectionData['news'] =  [];
      }
    });
  }

  fetchFeatured() {
    $('#preloader').fadeIn();
    this.apiService.getData('get-featured.php').subscribe({
      next: data => {
        this.featured = data
        this.sectionData['featured'] = data
        $('#preloader').fadeOut();
      },
      error: err => {
        $('#preloader').fadeOut();
        this.featured = [];
       this.sectionData['featured'] =  [];
      }
    });
  }


  //! upload add remove functions
  onUpdatePartners(index: number, item: SectionItem): void {
    if (!item.previewFile) {
      item = this.partners[index]
    }

    const formData = new FormData();
    formData.append('logo', item.previewFile);

    if (item.id) {
      formData.append('id', item.id.toString()); // Optional: for backend update logic
    }

    $('#preloader').fadeIn();

    this.apiService.postFormData('upload-partners.php', formData).subscribe({
      next: response => {
        if (response?.path && response?.url) {
          // Update the correct item in the array
          this.partners[index].logo = response.path;
          this.partners[index].imageUrl = response.url;
          this.partners[index].previewFile = undefined;
          this.partners[index].previewUrl = undefined;
          this.partners[index].name = response.name;
          this.partners[index].id = response.id; // Save new ID if returned
          alert('✅ Image added sucessfully');
          $('#preloader').fadeOut();
        } else {
          $('#preloader').fadeOut();
        }
      },
      error: err => {
        $('#preloader').fadeOut();
        alert('✅ ❌ Upload failed');

      }
    });
  }




  //! upload add remove functions
  onUpdateItem(index: number, item: SectionItem): void {
    if (!item.previewFile) {
      item = this.items[index]
    }

    const formData = new FormData();
    formData.append('image', item.previewFile);
    formData.append('section_id', item.section_id.toString());
    formData.append('title', item.title ?? '');
    formData.append('size', item.size ?? '');

    if (item.id) {
      formData.append('id', item.id.toString()); // Optional: for backend update logic
    }

    $('#preloader').fadeIn();

    this.apiService.postFormData('upload.php', formData).subscribe({
      next: response => {
        if (response?.path && response?.url) {
          // Update the correct item in the array
          this.items[index].image_src = response.path;
          this.items[index].imageUrl = response.url;
          this.items[index].previewFile = undefined;
          this.items[index].previewUrl = undefined;
          this.items[index].title = response.title;
          this.items[index].section_id = +response.section_id;
          this.items[index].size = response.size;
          this.items[index].id = response.id; // Save new ID if returned
          alert('✅ Image added sucessfully');
          $('#preloader').fadeOut();
        } else {
          $('#preloader').fadeOut();
        }
      },
      error: err => {
        alert('✅ ❌ Upload failed');
        $('#preloader').fadeOut();

      }
    });
  }

  //! upload add remove functions
  onUpdateNews(index: number, item: any): void {
    if (!item.previewFile) {
      item = this.news[index]

    }
    const formData = new FormData();
    formData.append('image_src', item.previewFile);
    formData.append('title', item.title);
    formData.append('sub_title', item.sub_title ?? '');
    formData.append('description', item.description ?? '');


    if (item.id) {
      formData.append('id', item.id.toString());
    }

    $('#preloader').fadeIn();

    this.apiService.postFormData('update-news.php', formData).subscribe({
      next: response => {
        this.fetchNews();
        alert('✅ Article added sucessfully');
        $('#preloader').fadeOut();

      },
      error: err => {
        $('#preloader').fadeOut();
        alert('✅ ❌ Upload failed');

      }
    });
  }

  //! upload add remove functions
  onUpdateFeatured(index: number, item: any): void {
    if (!item.previewFile) {
      item = this.featured[index]


    }

    const formData = new FormData();
    formData.append('image_src', item.previewFile);
    formData.append('title', item.title);
    formData.append('sub_title', item.sub_title ?? '');
    formData.append('description', item.description ?? '');

    if (item.id) {
      formData.append('id', item.id.toString());
    }

    $('#preloader').fadeIn();

    this.apiService.postFormData('update-featured.php', formData).subscribe({
      next: response => {
        this.fetchFeatured();
        alert('✅ Featured added sucessfully');
        $('#preloader').fadeOut();

      },
      error: err => {
        $('#preloader').fadeOut();
      }
    });
  }



  onRemoveItem(index: number, sectionName = null): void {
    let id = 0;
    let url: string = '';

    if (sectionName == 'partners') {
      url = 'delete-partners.php'
      id = this.partners[index].id;
      if (typeof id == 'undefined') {
        this.partners.splice(index)
        return
      }
    } else if (sectionName == 'news') {
      url = 'delete-news.php'
      id = this.news[index].id;
      if (typeof id == 'undefined') {
        this.news.splice(index)
        return
      }
    } else if (sectionName == 'featured') {
      url = 'delete-featured.php'
      id = this.featured[index].id;
      if (typeof id == 'undefined') {
        this.featured.splice(index)
        return
      }
    } else {
      url = 'delete-section-item.php'
      id = this.items[index].id;

      if (typeof id == 'undefined') {
        this.items.splice(index)
        return
      }
    }
    $('#preloader').fadeIn();

    this.apiService.deleteData(url, { id: id }).subscribe({
      next: (response) => {
        alert('✅ item Deleted');
        if (sectionName == 'partners') {
          this.fetchPartners()
        } else if (sectionName == 'news') {
          this.fetchNews()
        }
        else if (sectionName == 'featured') {
          this.fetchFeatured()

        } else {
          this.fetchSection(this.activeSectionId, this.activeSection); // Refresh the list after deletion
        }
        $('#preloader').fadeOut();

      },
      error: (error) => {
        alert('Error deleting ');
        $('#preloader').fadeOut();

      }
    });
  }

  onAddItem(): void {


    const newItem = {
      title: '',
      image_src: '',
      size: 'banner',
      section_id: this.activeSectionId ?? 0
    };
    const newpartner = {
      title: '',
      logo: '',
      section_id: this.activeSectionId ?? 0
    };
    const newArticle = {
      title: '',
      sub_title: '',
      image_src: '',
      descrption: ''
    };
    const newFeatured = {
      title: '',
      sub_title: '',
      image_src: '',
      descrption: ''
    };
    if (this.activeSection == 'partners') {

      this.partners.push(newpartner);

    } else if (this.activeSection == 'news') {

      this.news.push(newArticle);
    }
    else if (this.activeSection == 'featured') {

      this.featured.push(newFeatured);
    } else {


      this.items.push(newItem);

    }




  }
  onFileSelected(event: Event, index: number, section: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    let targetArray: any[];

    // Determine which array to update based on section
    switch (section) {
      case 'partners':
        targetArray = this.partners;
        break;
      case 'news':
        targetArray = this.news;
        break;
      case 'featured':
        targetArray = this.featured;
        break
      default:
        targetArray = this.items
        return;
    }

    const item = targetArray?.[index];
    if (!item) return;
    if (targetArray?.[index]['id']) {
      item.image_src = undefined;
    }
    item.previewFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      item.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


 

   
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
  
videos: any[] = [];
newVideoUrl: string = '';

  fetchMedia( ) {
  this.apiService.getData(`media.php?category=${this.selectedCategory}`).subscribe({
    next: data => {
      this.videos = data.videos;
     },
    error: err => console.error(`Error loading ${name}`, err)
  });
}
  
  
onAddVideo() {
  this.videos.push({
    id: '',
    title: '',
    category: this.selectedCategory,
  });
}

// Automatically triggered when user pastes a URL
  onVideoUrlChange(url: string, idx = 0) {
  this.newVideoUrl = url;
  const videoId = this.extractYouTubeId(url);
  if (videoId) {
    this.videos[idx]['id'] = videoId
     this.videos[idx]['category'] = this.selectedCategory

 
    this.newVideoUrl = ''; // Clear input
  }
}

extractYouTubeId(url: string): string | null {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

onUpdateVideo(index: number, video: any) {
  $('#preloader').fadeIn();
  
    const formData = new FormData();
    formData.append('category', this.selectedCategory);
    formData.append('title', '');

    if (video.id) {
      formData.append('id', video.id); // Optional: for backend update logic
    }


  this.apiService.postFormData('media.php', formData).subscribe({
    next: (res: any) => {
      console.log('✅ Video saved:', res);
        $('#preloader').fadeOut();
    },
    error: (err) => {
      console.error('❌ Save failed:', err);
     $('#preloader').fadeOut();

    }
  });
}

  onRemoveVideo(index: number) {
    let id 

    id=this.videos[index]['id']
      if (typeof id == 'undefined') {
        this.videos.splice(index)
        return
      }


    this.apiService.deleteData('delete-media.php', { id: id }).subscribe({
      next: (response) => {
        alert('✅ video Deleted');
        this.fetchMedia()
      } ,
         error: (error) => {
           $('#preloader').fadeOut();
        alert('Error deleting video');

      }
    });

}

filterVideos() {
  return this.videos.filter(video => video.category === this.selectedCategory);
}
  
    getEmbedUrl(videoId: string): string {
    if (videoId.startsWith('http')) {
      return videoId;  // Return the URL as it is if it already contains 'https:'
    } else {
      return `https://www.youtube.com/embed/${videoId}`;  // Format it as a YouTube embed URL
    }
  }

// getEmbedUrl(id: string): SafeResourceUrl {
//   // Handle Google Drive links
//   if (id.includes('drive.google.com')) {
//     const fileIdMatch = id.match(/\/d\/([^\/]+)\//);
//     const fileId = fileIdMatch ? fileIdMatch[1] : null;
//     if (fileId) {
//       const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
//       return this.sanitizer.bypassSecurityTrustResourceUrl(previewUrl);
//     }
//   }

//   // Handle full YouTube URLs
//   if (id.includes('youtube.com') || id.includes('youtu.be')) {
//     const videoIdMatch = id.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
//     const videoId = videoIdMatch ? videoIdMatch[1] : id;
//     const embedUrl = `https://www.youtube.com/embed/${videoId}`;
//     return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
//   }

//   // Handle raw YouTube video ID
//   if (/^[a-zA-Z0-9_-]{11}$/.test(id)) {
//     return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}`);
//   }

//   // Fallback: trust raw URL
//   return this.sanitizer.bypassSecurityTrustResourceUrl(id);
// }



setCategory(category: string) {
  this.selectedCategory = category;
  this.fetchMedia()
}

 
 
 


  showLogin = true;
  login = { email: '', password: '' };
  loginError = false;

  submitLogin() {
    if ((this.login.email === 'Admin'||this.login.email === 'admin') && this.login.password === 'yfsyfsyfs...') {
      this.showLogin = false;
      this.loginError = false;
      // You can store token or redirect here
      sessionStorage.setItem('authToken', 'mock-token');
    } else {
      this.loginError = true;
    }
  }





}

