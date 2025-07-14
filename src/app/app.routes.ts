import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ResumenComponent } from './components/resumen/resumen';
import { QuizComponent } from './components/quiz/quiz';
import { ResultsComponent } from './components/results/results';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'resumen', component: ResumenComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'results', component: ResultsComponent },
  { path: '**', redirectTo: '' }
];
