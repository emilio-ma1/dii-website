import { Link } from "react-router-dom";

/**
 * Componente reutilizable para mostrar imágenes dentro del Footer.
 *
 * @param {string} src - Ruta de la imagen.
 * @param {string} alt - Texto alternativo para accesibilidad.
 * @param {string} heightClass - Clase Tailwind para controlar la altura de la imagen.
 */

function FooterImage({ src, alt, heightClass }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${heightClass} w-auto object-contain flex-shrink-0`}
      loading="lazy" // optimiza carga de imágenes
    />
  );
}

/**
 * Footer principal del sitio web.
 *
 * Contiene:
 * - Logos institucionales
 * - Información de contacto
 * - Link de acceso a login
 * - Créditos de desarrollo
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#002D72] text-white pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex justify-center md:justify-start">
            <FooterImage
              src="/images/logo-footer.png"
              alt="Logo institucional (footer)"
              heightClass="h-[98px]"
            />
          </div>

          <div className="flex justify-center">
            <a
              href="https://userena.cl/contactos-uls"
              target="_blank"
              rel="noopener noreferrer"
            >
            <FooterImage
              src="/images/contacto-por-unidades.png"
              alt="Información de contacto por unidades"
              heightClass="h-[115px]"
            />
          </a>
        </div>

          <div className="flex justify-center md:justify-end">
            <FooterImage
              src="/images/logo-cna.png"
              alt="Logo CNA"
              heightClass="h-[98px]"
            />
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 pb-6">
          <div className="text-center text-xs text-gray-400">
            <Link
              to="/login"
              className="block text-xs opacity-60 hover:opacity-100 transition"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
      
      <div className="w-full bg-[#020617] py-5 text-xs text-gray-300 border-t-2 border-[#E30613]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex flex-col text-center lg:text-left leading-tight">
            <span>© {currentYear} Universidad de La Serena</span>
            <span className="mt-1">
              Sitio del Departamento de Ingeniería Industrial
            </span>
          </div>
          
          <div className="text-center lg:whitespace-nowrap">
            <span className="block lg:inline">
              Créditos: Matias Wormald | Emilio Maturana | Felipe Urqueta | Joselyn Montaño
            </span>
          </div>

          <div className="text-center lg:text-right lg:whitespace-nowrap">
            <span className="block lg:inline">
              QA: Adolfo Toledo | Edinson Godoy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}