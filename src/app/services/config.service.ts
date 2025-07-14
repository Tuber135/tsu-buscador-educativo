import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface ApiConfig {
  development: {
    apiUrl: string;
  };
  production: {
    apiUrl: string;
  };
  local: {
    apiUrl: string;
  };
  ngrok: {
    apiUrl: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configSubject = new BehaviorSubject<ApiConfig | null>(null);
  public config$ = this.configSubject.asObservable();
  
  private currentEnvironment: keyof ApiConfig = 'local'; // Usando local por defecto para desarrollo

  constructor(private http: HttpClient) {
    this.loadConfig();
  }

  private loadConfig(): void {
    this.http.get<ApiConfig>('assets/config/api-config.json').subscribe({
      next: (config) => {
        this.configSubject.next(config);
      },
      error: (error) => {
        console.error('Error loading configuration:', error);
        // Fallback a configuración por defecto
        const fallbackConfig: ApiConfig = {
          development: { apiUrl: 'http://localhost:8000' },
          production: { apiUrl: 'http://localhost:8000' },
          local: { apiUrl: 'http://localhost:8000' },
          ngrok: { apiUrl: 'http://localhost:8000' }
        };
        this.configSubject.next(fallbackConfig);
      }
    });
  }

  getApiUrl(): string {
    const config = this.configSubject.value;
    if (config) {
      return config[this.currentEnvironment].apiUrl;
    }
    return 'http://localhost:8000'; // Fallback
  }

  setEnvironment(env: keyof ApiConfig): void {
    this.currentEnvironment = env;
  }

  getCurrentEnvironment(): keyof ApiConfig {
    return this.currentEnvironment;
  }
}
