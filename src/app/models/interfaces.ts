export interface Pregunta {
  pregunta: string;
}

export interface RespuestaItem {
  pregunta: string;
  respuesta: string;
}

export interface EvaluacionRequest {
  respuestas: RespuestaItem[];
}

export interface EvaluacionResult {
  resultado: {
    comprension_tema: number;
    interpretacion: number;
    ortografia: number;
  };
}

export interface ResumenYPreguntas {
  resumen: string;
  preguntas: string[];
}
