# Estructura del Proyecto

## Diagrama de Arquitectura

```mermaid
graph TD
    A[src] --> B[domain]
    A --> C[infrastructure]
    A --> D[application]

    B --> B1[entities]
    B --> B2[repositories]
    B --> B3[useCases]
    B3 --> B31[todo]

    C --> C1[database]
    C1 --> C11[mongoose]
    C --> C2[webApi]
    C2 --> C21[routes]
    C2 --> C22[controllers]

    D --> D1[services]

    B1 -->|Todo.js| E[Entidades del Dominio]
    B2 -->|TodoRepository.js| F[Interfaces del Repositorio]

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#fbf,stroke:#333,stroke-width:2px
```

## Descripción de las Capas

### Domain (Dominio)

- **entities**: Contiene las entidades principales del negocio (Todo.js)
- **repositories**: Interfaces que definen cómo se accede a los datos
- **useCases**: Casos de uso específicos de la aplicación

### Infrastructure (Infraestructura)

- **database**: Implementaciones concretas de persistencia de datos
  - **mongoose**: Implementación específica para MongoDB
- **webApi**: Capa de presentación web
  - **routes**: Definición de rutas de la API
  - **controllers**: Controladores que manejan las peticiones

### Application (Aplicación)

- **services**: Servicios de la aplicación que orquestan los casos de uso
