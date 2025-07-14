import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  imports: [CommonModule],
  templateUrl: './results.html'
})
export class ResultsComponent implements OnInit {
  comprensionPercentage: number = 0;
  interpretacionPercentage: number = 0;
  ortografiaPercentage: number = 0;
  tema: string = '';
  comentarioGeneral: string = '¡Podemos mejorar, no te rindas!'; // Comentario por defecto

  constructor(private router: Router) {
    // Obtener datos del navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const resultado = navigation.extras.state['resultado'];
      this.tema = navigation.extras.state['tema'] || '';
      
      console.log('Datos recibidos en Results:', { resultado, tema: this.tema }); // Debug
      
      if (resultado) {
        // Si resultado tiene evaluacion_general (texto), parsearlo
        if (resultado.evaluacion_general) {
          this.parseEvaluacionTexto(resultado.evaluacion_general);
        } else {
          // Si tiene las propiedades directas (formato anterior)
          this.comprensionPercentage = Math.round(resultado.comprension_tema || 0);
          this.interpretacionPercentage = Math.round(resultado.interpretacion || 0);
          this.ortografiaPercentage = Math.round(resultado.ortografia || 0);
        }
      }
    }
  }

  parseEvaluacionTexto(texto: string) {
    // Buscar los porcentajes del promedio (Average section)
    const averageSection = texto.match(/\*\*Average\*\*([\s\S]*?)(?:\*\*|$)/i);
    
    if (averageSection) {
      const averageText = averageSection[1];
      const comprensionMatch = averageText.match(/Comprensión:\s*(\d+)%/i);
      const interpretacionMatch = averageText.match(/Interpretación:\s*(\d+)%/i);
      const ortografiaMatch = averageText.match(/Ortografía:\s*(\d+)%/i);

      this.comprensionPercentage = comprensionMatch ? parseInt(comprensionMatch[1]) : 75;
      this.interpretacionPercentage = interpretacionMatch ? parseInt(interpretacionMatch[1]) : 68;
      this.ortografiaPercentage = ortografiaMatch ? parseInt(ortografiaMatch[1]) : 82;
    } else {
      // Fallback: buscar cualquier mención de porcentajes
      const comprensionMatch = texto.match(/Comprensión:\s*(\d+)%/i);
      const interpretacionMatch = texto.match(/Interpretación:\s*(\d+)%/i);
      const ortografiaMatch = texto.match(/Ortografía:\s*(\d+)%/i);

      this.comprensionPercentage = comprensionMatch ? parseInt(comprensionMatch[1]) : 75;
      this.interpretacionPercentage = interpretacionMatch ? parseInt(interpretacionMatch[1]) : 68;
      this.ortografiaPercentage = ortografiaMatch ? parseInt(ortografiaMatch[1]) : 82;
    }

    // Extraer comentario general
    const comentarioMatch = texto.match(/Comentario general:\s*(.+?)(?:\n|$)/i) || 
                           texto.match(/\*\*Comentario general\*\*:\s*(.+?)(?:\n|$)/i) ||
                           texto.match(/Comentario:\s*(.+?)(?:\n|$)/i);
    
    if (comentarioMatch) {
      this.comentarioGeneral = comentarioMatch[1].trim();
    }

    console.log('Texto completo recibido:', texto);
    console.log('Porcentajes parseados:', {
      comprension: this.comprensionPercentage,
      interpretacion: this.interpretacionPercentage,
      ortografia: this.ortografiaPercentage,
      comentario: this.comentarioGeneral
    });
  }

  traducirComentario(comentario: string): string {
    // Traducir el comentario al español
    const traducciones: { [key: string]: string } = {
      'understanding': 'comprensión',
      'comprehension': 'comprensión',
      'interpretation': 'interpretación',
      'skills': 'habilidades',
      'improve': 'mejorar',
      'student': 'estudiante',
      'shows': 'muestra',
      'demonstrate': 'demuestra',
      'strong': 'fuerte',
      'command': 'dominio',
      'spelling': 'ortografía',
      'grammar': 'gramática',
      'topics': 'temas',
      'could': 'podría',
      'their': 'sus',
      'some': 'cierto',
      'but': 'pero',
      'they': 'demuestran',
      'The student': 'El estudiante',
      'and': 'y'
    };

    let comentarioTraducido = comentario;
    
    // Aplicar traducciones básicas
    Object.entries(traducciones).forEach(([en, es]) => {
      const regex = new RegExp(`\\b${en}\\b`, 'gi');
      comentarioTraducido = comentarioTraducido.replace(regex, es);
    });

    return comentarioTraducido;
  }

  ngOnInit() {
    // Si no hay datos, redirigir al home
    if (!this.tema) {
      this.router.navigate(['/']);
      return;
    }

    // Animar los porcentajes
    this.animatePercentages();
  }

  animatePercentages() {
    const duration = 1500; // 1.5 segundos
    const steps = 60;
    const increment = duration / steps;

    const comprensionTarget = this.comprensionPercentage;
    const interpretacionTarget = this.interpretacionPercentage;
    const ortografiaTarget = this.ortografiaPercentage;

    this.comprensionPercentage = 0;
    this.interpretacionPercentage = 0;
    this.ortografiaPercentage = 0;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      this.comprensionPercentage = Math.round(comprensionTarget * progress);
      this.interpretacionPercentage = Math.round(interpretacionTarget * progress);
      this.ortografiaPercentage = Math.round(ortografiaTarget * progress);

      if (step >= steps) {
        this.comprensionPercentage = comprensionTarget;
        this.interpretacionPercentage = interpretacionTarget;
        this.ortografiaPercentage = ortografiaTarget;
        clearInterval(timer);
      }
    }, increment);
  }

  nuevoQuiz() {
    this.router.navigate(['/']);
  }

  volverInicio() {
    this.router.navigate(['/']);
  }
}
