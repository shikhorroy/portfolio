import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Resume } from '../data/resume.data';

const CAREER_START = new Date(2017, 10, 1); // month is 0-indexed

function yearsOfExperience(): number {
  const now = new Date();
  const years = now.getFullYear() - CAREER_START.getFullYear();
  const beforeAnniversary =
    now.getMonth() < CAREER_START.getMonth() ||
    (now.getMonth() === CAREER_START.getMonth() && now.getDate() < CAREER_START.getDate());
  return beforeAnniversary ? years - 1 : years;
}

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  private resumeSignal = signal<Resume | null>(null);
  private loadPromise: Promise<Resume> | null = null;

  constructor(private http: HttpClient) {
    this.load();
  }

  private load(): void {
    this.loadPromise = firstValueFrom(
      this.http.get<Omit<Resume, 'about' | 'highlights'> & {
        about: string[];
        highlights: { label: string; value: string }[];
      }>('assets/data/resume.json')
    ).then((rawData) => {
      const years = yearsOfExperience();

      const resume: Resume = {
        ...rawData,
        about: rawData.about.map((line) =>
          line.replace('{yearsOfExperience}', String(years))
        ),
        highlights: rawData.highlights.map((h) => ({
          ...h,
          value: h.value.replace('{yearsOfExperience}', String(years)),
        })),
      };

      this.resumeSignal.set(resume);
      return resume;
    });
  }

  async getResume(): Promise<Resume> {
    if (this.resumeSignal()) {
      return this.resumeSignal()!;
    }
    return this.loadPromise || Promise.reject('Resume service not initialized');
  }

  get resume$() {
    return this.resumeSignal;
  }
}
