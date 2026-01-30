import { Link } from "react-router-dom";

function ProjectCard({ to, imgSrc, title, summary, author }) {
  return (
    <Link to={to} className="group block bg-white border-2 border-[#610b2f] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl focus-visible:-translate-y-2 focus-visible:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      {/* parte superior */}
      <div className="h-28 sm:h-32 flex items-center justify-center">
        <img
          src={imgSrc}
          alt={title}
          className="h-16 w-16 sm:h-20 sm:w-20 object-contain" />
      </div>
      {/* parte de abajo */}
      <div className="bg-[#610b2f] text-white px-3 py-3 min-h-[92px] relative">
        <h3 className="font-bold text-sm sm:text-base leading-snug">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-white/90 mt-1">
          {summary}
        </p>
        {/* autor */} 
        <span className="absolute bottom-2 right-3 text-[11px] sm:text-xs text-white/90">
          {author}
        </span>
      </div>
    </Link>
  );
}

//cada tarjeta redirige al detalle del proyecto usando su id
export default function VinculacionconelMedio() {
  // lista de proyectos (datos de prueba)
  const proyectos = [
    {
      id: "proyecto-1",
      imgSrc: "/images/Ambiente.png",
      title: "Título del Proyecto",
      summary: "Resumen del Proyecto",
      author: "Autor",
    },
    {
      id: "proyecto-2",
      imgSrc: "/images/Ambiente.png",
      title: "Título del Proyecto",
      summary: "Resumen del proyecto",
      author: "Autor",
    },
    {
      id: "proyecto-3",
      imgSrc: "/images/Ambiente.png",
      title: "Título del Proyecto",
      summary: "Resumen del proyecto",
      author: "Autor",
    },
    {
      id: "proyecto-4",
      imgSrc: "/images/Ambiente.png",
      title: "Título del Proyecto",
      summary: "Resumen del proyecto",
      author: "Autor",
    },
    {
      id: "proyecto-5",
      imgSrc: "/images/Ambiente.png",
      title: "Título del Proyecto",
      summary: "Resumen del proyecto",
      author: "Autor",
    },
    {
      id: "proyecto-6",
      imgSrc: "/images/Ambiente.png",
      title: "Título del Proyecto",
      summary: "Resumen del proyecto",
      author: "Autor",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen pt-12 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* titulo */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            VINCULACIÓN CON EL MEDIO
          </h1>
          <div className="w-24 h-1 bg-[#610b2f] mx-auto rounded-full"></div>
          <div className="max-w-3xl mx-auto mt-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
              Descripción del Área
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed">
              Esto es ...
            </p>
          </div>
        </div>
        {/* proyectos en grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map((p) => (
            <ProjectCard
              key={p.id}
              to={`/vinculacion-con-el-medio-detalle/${p.id}`} 
              imgSrc={p.imgSrc}
              title={p.title}
              summary={p.summary}
              author={p.author}/>
          ))}
        </div>
      </div>
    </div>
  );
}
