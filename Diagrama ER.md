# Diseño de Base de Datos - DII Website

Este documento detalla la arquitectura de la base de datos relacional para el sitio web del Departamento de Ingeniería Industrial. El diseño prioriza la integridad referencial, la seguridad de los usuarios y la no redundancia de datos.

## 1. Diagrama Entidad-Relación (ER)

El siguiente diagrama ilustra las entidades y sus relaciones. Destaca la gestión de usuarios mixta (Secretaria y Egresados) y la relación "Muchos a Muchos" entre Proyectos y sus autores (Profesores y Egresados).

```mermaid
erDiagram
    %% ENTIDADES PRINCIPALES
    USERS {
        int id PK
        string full_name
        string email UK
        string password_hash
        string role "ENUM: admin, egresado"
        string profile_picture_url "Upload de imagen (RF-04)"
    }

    ALUMNI_PROFILES {
        int user_id PK, FK
        string phone_contact
        string portfolio_url
        string studies_summary
        boolean contact_authorized "Permite ser contactado (RF-12)"
    }

    PROFESSORS {
        int id PK
        string full_name
        string degree
        string bio
        string email_public
        string profile_picture_url "Upload de imagen (RF-04)"
        string portfolio_url "Portafolio/Estudios (RF-13)"
        boolean is_active
    }

    NEWS {
        int id PK
        string title
        string slug UK
        string content
        string image_url "Upload de imagen (RF-04)"
        boolean is_active "Sigue vigente (RF-10)"
        datetime published_at
        int created_by FK
    }

    PROJECTS {
        int id PK
        string title
        string abstract
        string pdf_url
        string image_url "Upload de imagen (RF-04)"
        string status "ENUM: en proceso, finalizado (RF-08)"
        string category "ENUM: investigacion, vinculacion (RF-05)"
        int year
    }

    EQUIPMENT {
        int id PK
        string name
        string category
        text description
        string image_url "Upload de imagen"
    }

    %% TABLAS INTERMEDIAS (PIVOT)
    PROJECT_PROFESSORS {
        int project_id PK, FK
        int professor_id PK, FK
    }

    PROJECT_ALUMNI {
        int project_id PK, FK
        int user_id PK, FK
    }

    %% RELACIONES
    USERS ||--o| ALUMNI_PROFILES : "tiene detalles (solo egresados)"
    USERS ||--o{ NEWS : "publica (solo admin)"
    PROJECTS ||--|{ PROJECT_PROFESSORS : "tiene"
    PROFESSORS ||--|{ PROJECT_PROFESSORS : "participa"
    PROJECTS ||--o{ PROJECT_ALUMNI : "tiene"
    USERS ||--o{ PROJECT_ALUMNI : "participa (solo egresados)"
