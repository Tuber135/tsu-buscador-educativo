import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../services/quiz';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.html'
})
export class HomeComponent {
  tema: string = '';
  cargando: boolean = false;

  constructor(
    private router: Router,
    private quizService: QuizService
  ) {}

  buscarTema() {
    if (this.tema.trim()) {
      this.cargando = true;
      this.quizService.obtenerResumenYPreguntas(this.tema).subscribe({
        next: (data) => {
          this.cargando = false;
          // Navegamos al resumen con los datos
          this.router.navigate(['/resumen'], { 
            state: { 
              resumen: data.resumen, 
              preguntas: data.preguntas,
              tema: this.tema 
            } 
          });
        },
        error: (error) => {
          this.cargando = false;
          console.error('Error al obtener el resumen y preguntas:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      });
    }
  }
}
