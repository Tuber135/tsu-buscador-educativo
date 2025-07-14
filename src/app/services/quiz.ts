import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  obtenerResumenYPreguntas(tema: string): Observable<ResumenYPreguntas> {
    return this.http.get<ResumenYPreguntas>(`${this.getApiUrl()}/resumen-y-preguntas?tema=${encodeURIComponent(tema)}`);
  }

  evaluarRespuestas(evaluacion: EvaluacionRequest): Observable<EvaluacionResult> {
    return this.http.post<EvaluacionResult>(`${this.getApiUrl()}/evaluar`, evaluacion);
  }
}
