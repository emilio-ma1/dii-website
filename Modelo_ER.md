```mermaid
erDiagram
    NOTICIAS {
      BIGINT id PK
      VARCHAR titulo
      VARCHAR slug
      VARCHAR resumen
      TEXT cuerpo
      VARCHAR cover_image_url
      VARCHAR status
      TIMESTAMPTZ published_at
      TIMESTAMPTZ created_at
      TIMESTAMPTZ updated_at
    }

    CATEGORIES {
      BIGINT id PK
      VARCHAR name
      VARCHAR slug
      TIMESTAMPTZ created_at
    }

    TAGS {
      BIGINT id PK
      VARCHAR name
      VARCHAR slug
      TIMESTAMPTZ created_at
    }

    NEWS_CATEGORIES {
      BIGINT news_id FK
      BIGINT category_id FK
      TIMESTAMPTZ created_at
    }

    NEWS_TAGS {
      BIGINT news_id FK
      BIGINT tag_id FK
      TIMESTAMPTZ created_at
    }

    ATTACHMENTS {
      BIGINT id PK
      BIGINT news_id FK
      VARCHAR file_name
      VARCHAR file_url
      VARCHAR mime_type
      BIGINT file_size_bytes
      TIMESTAMPTZ created_at
    }

    NOTICIAS ||--o{ ATTACHMENTS : tiene
    NOTICIAS ||--o{ NEWS_CATEGORIES : clasifica
    CATEGORIES ||--o{ NEWS_CATEGORIES : agrupa
    NOTICIAS ||--o{ NEWS_TAGS : etiqueta
    TAGS ||--o{ NEWS_TAGS : agrupa