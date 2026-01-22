```mermaid
erDiagram
    %% Entidad de Usuarios (Secretaria y Egresados)
    USERS {
        int id PK
        string email UK "Correo unico para login"
        string password_hash "Encriptada"
        string full_name
        string role "ENUM('admin', 'egresado')"
        datetime created_at
    }

    %% Entidad de Profesores (Solo informativo, sin acceso)
    PROFESORES {
        int id PK
        string full_name
        string degree "Ej: Doctor en Ingeniería"
        text bio
        string email_public "Correo de contacto visible"
        string photo_url
        boolean is_active
    }

    %% Entidad de Noticias
    NEWS {
        int id PK
        string title
        string slug UK "Para URL amigable"
        text content
        string image_url
        datetime published_at
        int created_by FK "Departamento de Ingenieria Industrial"
    }

    %% Entidad de Proyectos de Investigación
    PROJECTS {
        int id PK
        string title
        text abstract "Resumen publico"
        string pdf_url "Url del archivo (Acceso restringido)"
        int year
        datetime uploaded_at
    }

    %% Tabla Intermedia: Relación muchos a muchos
    %% Un proyecto puede tener varios profesores investigadores
    PROJECT_AUTHORS {
        int project_id PK, FK
        int professor_id PK, FK
    }

    %% Relaciones
    USERS ||--o{ NEWS : "crea (solo admin)"
    PROFESSORS }o--o{ PROJECT_AUTHORS : "participa"
    PROJECTS ||--o{ PROJECT_AUTHORS : "tiene autores"