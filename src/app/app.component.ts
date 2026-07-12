import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { yearsOfExperience } from './core/data/resume.data';
import { PageService } from './core/services/page.service';
import { PlatesCanvasComponent } from './shared/plates-canvas/plates-canvas.component';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { HeroComponent } from './sections/hero/hero.component';
import { AboutComponent } from './sections/about/about.component';
import { PlatformComponent } from './sections/platform/platform.component';
import { SkillsComponent } from './sections/skills/skills.component';
import { ExperienceComponent } from './sections/experience/experience.component';
import { ProjectsComponent } from './sections/projects/projects.component';
import { EducationComponent } from './sections/education/education.component';
import { ContactComponent } from './sections/contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PlatesCanvasComponent,
    NavBarComponent,
    HeroComponent,
    AboutComponent,
    PlatformComponent,
    SkillsComponent,
    ExperienceComponent,
    ProjectsComponent,
    EducationComponent,
    ContactComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly page = inject(PageService).page;

  constructor() {
    const yrs = yearsOfExperience();
    inject(Title).setTitle('Shikhor Kumer Roy - Staff Software Engineer');
    inject(Meta).updateTag({
      name: 'description',
      content: `Shikhor Kumer Roy - Staff Software Engineer with ${yrs}+ years of experience building scalable backend and data-intensive systems in Java and Kotlin.`,
    });
  }
}
