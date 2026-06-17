import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import * as $ from "jquery";
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { SectorDetailComponent } from './sector-detail/sector-detail.component';
import { SafePipe } from './safe.pipe';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { PartnersComponent } from './partners/partners.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogsDetailsComponent } from './blogs-details/blogs-details.component';
import { FullImagePathPipe } from './full-image-path.pipe';
 import { QuillModule } from 'ngx-quill';
const appRoutes: Routes = [
  { path: '', component: HomeComponent },
 
  { path: 'contact', component: ContactUsComponent },
  { path: 'partners', component: PartnersComponent },

  { path: 'sectordetail', component: SectorDetailComponent } ,
  { path: 'control-panel', component: ControlPanelComponent } ,
  { path: 'blogs', component: BlogsComponent },
  { path: 'blogs/:id', component: BlogsDetailsComponent },

  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect unknown routes


  //{ path: 'home', component: HomeV1Component },
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    FooterComponent,
    ContactUsComponent,
    SectorDetailComponent,
    SafePipe,
    ControlPanelComponent,
    PartnersComponent,
    BlogsComponent,
    BlogsDetailsComponent,
    FullImagePathPipe,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,FormsModule,RouterModule.forRoot(appRoutes, { useHash: false }),QuillModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  exports: [RouterModule]

})
export class AppModule { }
