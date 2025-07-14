# Configuración de API - TSU App

## Configuración del Backend

La aplicación usa un archivo de configuración JSON para manejar las URLs del backend. Esto permite cambiar fácilmente entre diferentes entornos sin modificar el código.

### Archivo de Configuración

El archivo se encuentra en: `src/assets/config/api-config.json`

```json
{
  "development": {
    "apiUrl": "https://d6e49d146a07.ngrok-free.app"
  },
  "production": {
    "apiUrl": "https://tu-dominio-produccion.com"
  },
  "local": {
    "apiUrl": "http://localhost:8000"
  },
  "ngrok": {
    "apiUrl": "https://d6e49d146a07.ngrok-free.app"
  }
}
```

### Cómo Cambiar la URL de ngrok

1. **Actualizar el archivo de configuración:**
   Edita `src/assets/config/api-config.json` y cambia la URL en la sección que uses:

```json
{
  "ngrok": {
    "apiUrl": "https://tu-nueva-url-ngrok.ngrok-free.app"
  }
}
```

2. **Cambiar el entorno por defecto:**
   En `src/app/services/config.service.ts`, línea 18:

```typescript
private currentEnvironment: keyof ApiConfig = 'ngrok'; // Cambia por: 'local', 'development', 'production'
```

### Entornos Disponibles

- **`local`**: Backend corriendo en localhost:8000
- **`ngrok`**: Backend expuesto a través de ngrok
- **`development`**: Ambiente de desarrollo
- **`production`**: Ambiente de producción

### Cambiar Entorno Programáticamente

También puedes cambiar el entorno desde el código:

```typescript
// En cualquier componente o servicio
constructor(private configService: ConfigService) {
  // Cambiar a entorno local
  this.configService.setEnvironment('local');
  
  // Cambiar a ngrok
  this.configService.setEnvironment('ngrok');
}
```

### Verificar la URL Actual

```typescript
console.log('URL actual:', this.configService.getApiUrl());
console.log('Entorno actual:', this.configService.getCurrentEnvironment());
```

### Tips para ngrok

1. Cada vez que reinicies ngrok, obtendrás una nueva URL
2. Actualiza el archivo `api-config.json` con la nueva URL
3. No necesitas recompilar la aplicación, solo refrescar el navegador
4. Para ngrok gratuito, la URL cambia cada 2 horas de inactividad

### Ejemplo de Uso con ngrok

```bash
# Iniciar ngrok
ngrok http 8000

# Copiar la URL (ej: https://abc123.ngrok-free.app)
# Actualizar api-config.json
# Refrescar la aplicación Angular
```
