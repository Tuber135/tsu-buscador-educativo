import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResumenYPreguntas, EvaluacionRequest, EvaluacionResult } from '../models/interfaces';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  private getApiUrl(): string {
    return this.configService.getApiUrl();
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      })
    };
  }

  obtenerResumenYPreguntas(tema: string): Observable<ResumenYPreguntas> {
    return this.http.get<ResumenYPreguntas>(
      `${this.getApiUrl()}/resumen-y-preguntas?tema=${encodeURIComponent(tema)}`,
      this.getHttpOptions()
    );
  }

  evaluarRespuestas(evaluacion: EvaluacionRequest): Observable<EvaluacionResult> {
    return this.http.post<EvaluacionResult>(
      `${this.getApiUrl()}/evaluar`, 
      evaluacion,
      this.getHttpOptions()
    );
  }
}
