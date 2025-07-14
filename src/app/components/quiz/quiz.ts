import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../services/quiz';
import { RespuestaItem } from '../../models/interfaces';

@Component({
  selector: 'app-quiz',
  imports: [FormsModule, CommonModule],
  templateUrl: './quiz.html'
})
export class QuizComponent implements OnInit {
  tema: string = '';
  preguntas: string[] = [];
  respuestas: string[] = [];
  evaluando: boolean = false; // Variable para la pantalla de carga

  constructor(
    private router: Router,
    private quizService: QuizService
  ) {
    // Obtener datos del navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.tema = navigation.extras.state['tema'] || '';
      this.preguntas = navigation.extras.state['preguntas'] || [];
    }

    // Inicializar respuestas vacías
    this.respuestas = new Array(this.preguntas.length).fill('');
  }

  ngOnInit() {
    // Si no hay datos, redirigir al home
    if (!this.tema || !this.preguntas.length) {
      this.router.navigate(['/']);
      return;
    }
  }

  enviarRespuestas() {
    this.evaluando = true; // Activar pantalla de carga
    
    const respuestasData: RespuestaItem[] = this.preguntas.map((pregunta, index) => ({
      pregunta: pregunta,
      respuesta: this.respuestas[index] || ''
    }));

    this.quizService.evaluarRespuestas({ respuestas: respuestasData }).subscribe({
      next: (resultado) => {
        console.log('Respuesta completa del backend:', resultado); // Debug
        this.evaluando = false; // Desactivar pantalla de carga
        // Navegar a resultados con los datos
        this.router.navigate(['/results'], {
          state: {
            resultado: resultado.resultado, // El resultado está anidado
            tema: this.tema
          }
        });
      },
      error: (error) => {
        this.evaluando = false; // Desactivar pantalla de carga en caso de error
        console.error('Error al evaluar respuestas:', error);
        // Aquí podrías mostrar un mensaje de error
      }
    });
  }
}
