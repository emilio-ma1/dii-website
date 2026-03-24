import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/**
 * Ícono de calendario para las noticias
 */
function CalendarIcon() {
  return (
    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2z" />
    </svg>
  );
}

/**
 * Formatea el campo 'published_at' de la base de datos al estilo "24 de Marzo, 2026"
 */
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return "Fecha desconocida";
  try {
    const fecha = new Date(fechaISO);
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    return fechaFormateada.replace(/ de ([a-z])/, (match, letra) => ` de ${letra.toUpperCase()}`);
  } catch (error) {
    return "Fecha desconocida";
  }
};

/**
 * Renderiza la tarjeta individual de la noticia
 */
function NewsCard({ item }) {
  // Ajustamos para leer exactamente los campos de tu tabla 'news'
  const imageSrc = item.image_url || "/images/seminario.jpg";
  const categoryColor = "bg-[#1f78c1]"; // Puedes hacerlo dinámico si luego agregas categorías a news
  const categoryName = "Noticia"; 
  
  return (
    <article className="group overflow-hidden rounded-md bg-white shadow-md border-2 border-[#722b4d]/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#722b4d] flex flex-col h-full">
      <Link to={`/vinculacion-con-el-medio-detalle/${item.slug}`} className="flex flex-col h-full">
        <div className="relative h-64 overflow-hidden lg:h-80 shrink-0">
          <img
            src={imageSrc}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.target.src = "/images/seminario.jpg"; }}
          />
          <span className={`absolute left-4 top-4 rounded px-3 py-1 text-sm font-semibold text-white ${categoryColor}`}>
            {categoryName}
          </span>
        </div>

        <div className="px-5 py-5 flex flex-col grow">
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <CalendarIcon />
            <span>{formatearFecha(item.published_at)}</span>
          </div>

          <h3 className="line-clamp-2 text-[1.9rem] font-bold leading-tight text-[#722b4d] md:text-[2rem] lg:text-[2.1rem]">
            {item.title}
          </h3>

          <p className="mt-4 line-clamp-3 text-base leading-8 text-gray-600 grow">
            {item.content || "Sin descripción disponible."}
          </p>

          <div className="mt-6">
            <span className="inline-flex items-center gap-2 text-base font-semibold text-[#1f78c1] transition group-hover:gap-3">
              Leer más
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

/**
 * Componente principal de la sección de noticias en el Home
 */
export default function NoticiasHome() {
  const [latestNews, setLatestNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/news`);
        
        if (!response.ok) {
          throw new Error("Error al obtener las noticias del servidor");
        }

        const data = await response.json();

        const activeNews = data.filter(news => news.is_active);
        const sortedData = activeNews.sort((a, b) => {
          const dateA = new Date(a.published_at);
          const dateB = new Date(b.published_at);
          return dateB - dateA; 
        });

        setLatestNews(sortedData.slice(0, 3));
      } catch (err) {
        console.error("[ERROR] Fallo cargando noticias destacadas:", err);
        setError("No se pudieron cargar las noticias recientes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  return (
    <section className="bg-[#f3f3f3] pt-10 pb-20 lg:pt-14 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#1f78c1]">
            Actualidad
          </p>

          <h2 className="mt-3 text-4xl font-extrabold text-[#722b4d] sm:text-5xl lg:text-6xl">
            Social
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-gray-600 sm:text-xl">
            Mantente informado sobre las últimas novedades del departamento.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <span className="text-[#722b4d] text-lg font-semibold animate-pulse">Cargando las últimas noticias...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12 border border-red-200 bg-red-50 rounded-lg">
            {error}
          </div>
        ) : latestNews.length === 0 ? (
          <div className="text-center text-gray-500 py-12 border border-gray-200 bg-white rounded-lg">
            Aún no hay noticias publicadas.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            {latestNews.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}