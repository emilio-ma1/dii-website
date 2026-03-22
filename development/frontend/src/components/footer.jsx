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
  // obtiene el año actual automáticamente
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
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

        <div className="border-t border-gray-700 pt-8">
          <div className="text-center text-xs text-gray-400">
            <Link
              to="/login"
              className="block text-xs opacity-60 hover:opacity-100 transition"
            >
              Iniciar Sesión
            </Link>

            <p className="mt-4">© {currentYear} Derechos reservados</p>
            <div className="mt-2">
              <p>Desarrollado por:</p>
              <ul className="mt-1 space-y-0.5">
                <li>Matias Wormald</li>
                <li>Emilio Maturana</li>
                <li>Felipe Urqueta</li>
                <li>Joselyn Montaño</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}