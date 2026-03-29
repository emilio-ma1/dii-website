# Diseño de Base de Datos - DII Website

Este documento detalla la arquitectura de la base de datos relacional para el sitio web del Departamento de Ingeniería Industrial. El diseño prioriza la integridad referencial, la seguridad de los usuarios y la no redundancia de datos.

## 1. Diagrama Entidad-Relación (ER)

El siguiente diagrama ilustra las entidades y sus relaciones. Destaca la gestión de usuarios mixta (Secretaria y Egresados) y la relación "Muchos a Muchos" entre Proyectos y sus autores (Profesores y Egresados).

```mermaid
erDiagram
    users {
        SERIAL id PK
        VARCHAR(100) full_name
        VARCHAR(100) email
        VARCHAR(255) password_hash
        VARCHAR(20) role
        VARCHAR(6) login_code
        TIMESTAMP login_code_expires_at
        VARCHAR(255) reset_token
        TIMESTAMP reset_token_expires_at
        TIMESTAMP created_at
    }

    alumni_profiles {
        SERIAL id PK
        INTEGER user_id FK "UNIQUE"
        VARCHAR(100) degree
        VARCHAR(100) specialty
        VARCHAR(255) video_url_embed
        BYTEA image_data
        VARCHAR(50) image_mimetype
        BOOLEAN is_profile_public
    }

    professors {
        SERIAL id PK
        INTEGER user_id FK "UNIQUE"
        VARCHAR(100) degree
        VARCHAR(100) area
        BYTEA image_data
        VARCHAR(50) image_mimetype
    }

    news {
        SERIAL id PK
        VARCHAR(200) title
        VARCHAR(255) slug
        TEXT content
        BYTEA image_data
        VARCHAR(50) image_mimetype
        BOOLEAN is_active
        TIMESTAMP published_at
        INTEGER created_by FK
    }

    categories {
        SERIAL id PK
        VARCHAR(100) name
        TEXT description
    }

    projects {
        SERIAL id PK
        VARCHAR(255) title
        TEXT abstract
        DATE year
        VARCHAR(20) status
        INTEGER category_id FK
        BYTEA image_data
        VARCHAR(50) image_mimetype
        BYTEA pdf_data
        VARCHAR(50) pdf_mimetype
    }

    equipment {
        SERIAL id PK
        VARCHAR(100) name
        VARCHAR(100) category
        TEXT description
        BYTEA image_data
        VARCHAR(50) image_mimetype
    }

    contacts {
        SERIAL id PK
        VARCHAR(100) name
        VARCHAR(100) email
        VARCHAR(150) subject
        TEXT message
        BOOLEAN is_read
        TIMESTAMP created_at
    }

    project_authors {
        INTEGER project_id PK, FK
        INTEGER user_id PK, FK
    }

    audit_logs {
        SERIAL id PK
        INTEGER user_id FK
        VARCHAR(50) action
        VARCHAR(50) entity_type
        INTEGER entity_id
        JSONB details
        TIMESTAMP created_at
    }

    %% Relaciones (Basadas en las llaves foraneas y restricciones UNIQUE)
    
    %% Relaciones 1 a 1 (Un usuario puede tener cero o un perfil de egresado/profesor)
    users ||--o| alumni_profiles : "has_profile (CASCADE)"
    users ||--o| professors : "has_profile (CASCADE)"

    %% Relaciones 1 a Muchos (Un usuario puede crear muchas noticias o generar muchos logs)
    users ||--o{ news : "publishes"
    users ||--o{ audit_logs : "triggers (SET NULL)"

    %% Relaciones 1 a Muchos (Una categoria tiene muchos proyectos)
    categories ||--o{ projects : "contains (RESTRICT)"

    %% Relacion Muchos a Muchos (Proyectos y Autores)
    projects ||--o{ project_authors : "has_author (CASCADE)"
    users ||--o{ project_authors : "is_author (CASCADE)"
