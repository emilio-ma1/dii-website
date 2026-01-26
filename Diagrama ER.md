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
    }

    PROFESORES {
        int id PK
        string full_name
        string degree
        string bio
        string email_public
        boolean is_active
    }

    NEWS {
        int id PK
        string title
        string slug UK
        string content
        datetime published_at
        int created_by FK
    }

    PROJECTS {
        int id PK
        string title
        string abstract
        string pdf_url
        int year
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
    USERS ||--o{ NEWS : "publica (solo admin)"
    PROJECTS ||--|{ PROJECT_PROFESSORS : "tiene"
    PROFESORES ||--|{ PROJECT_PROFESSORS : "participa"
    PROJECTS ||--o{ PROJECT_ALUMNI : "tiene"
    USERS ||--o{ PROJECT_ALUMNI : "participa (solo egresados)"