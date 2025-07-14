import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-resumen',
  imports: [CommonModule, MarkdownComponent],
  templateUrl: './resumen.html'
})
export class ResumenComponent implements OnInit, OnDestroy {
  tema: string = '';
  resumen: string = '';
  preguntas: string[] = [];
  causas: string[] = [];
  
  // Timer
  tiempoRestante: string = '20:00';
  tiempoTerminado: boolean = false;
  private intervalId: any;
  private tiempoEnSegundos: number = 1200; // 20 minutos

  constructor(private router: Router) {
    // Obtener datos del navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.tema = navigation.extras.state['tema'] || '';
      this.resumen = navigation.extras.state['resumen'] || '';
      this.preguntas = navigation.extras.state['preguntas'] || [];
    }
    
    // Procesar resumen para extraer causas si existen
    this.procesarResumen();
  }

  ngOnInit() {
    // Si no hay datos, redirigir al home
    if (!this.tema || !this.resumen) {
      this.router.navigate(['/']);
      return;
    }

    // Iniciar timer
    this.iniciarTimer();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  procesarResumen() {
    if (this.resumen.includes('Causas:')) {
      const partes = this.resumen.split('Causas:');
      this.resumen = partes[0].trim();
      
      if (partes[1]) {
        // Extraer causas del texto
        const causasTexto = partes[1];
        this.causas = causasTexto
          .split('\n')
          .filter(linea => linea.trim().startsWith('•') || linea.trim().startsWith('-'))
          .map(linea => linea.replace(/^[•-]\s*/, '').trim())
          .filter(causa => causa.length > 0);
      }
    }
  }

  iniciarTimer() {
    this.intervalId = setInterval(() => {
      this.tiempoEnSegundos--;
      
      if (this.tiempoEnSegundos <= 0) {
        this.tiempoTerminado = true;
        clearInterval(this.intervalId);
        this.tiempoRestante = '00:00';
        // Automáticamente navegar al quiz cuando termine el tiempo
        this.irAEvaluacion();
      } else {
        const minutos = Math.floor(this.tiempoEnSegundos / 60);
        const segundos = this.tiempoEnSegundos % 60;
        this.tiempoRestante = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }

  irAEvaluacion() {
    // Navegar al quiz con las preguntas
    this.router.navigate(['/quiz'], {
      state: {
        tema: this.tema,
        preguntas: this.preguntas
      }
    });
  }

  // Método para testing - saltar al cuestionario sin esperar
  saltarAlCuestionario() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.irAEvaluacion();
  }

  // Obtener el porcentaje de tiempo transcurrido para la barra de progreso
  get porcentajeTranscurrido(): number {
    const tiempoTranscurrido = 1200 - this.tiempoEnSegundos;
    return (tiempoTranscurrido / 1200) * 100;
  }
}
