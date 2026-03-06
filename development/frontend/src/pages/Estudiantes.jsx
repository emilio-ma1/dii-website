import { useEffect, useState } from "react";

/**
 * Datos simulados de estudiantes.
 */
const MOCK_STUDENTS = [
  { id: 1, fullName: "Ejemplo 1", specialty: "Egresado 2022", videoUrlEmbed: "" },
  { id: 2, fullName: "Ejemplo 2", specialty: "8vo Semestre", videoUrlEmbed: "" },
  { id: 3, fullName: "Ejemplo 3", specialty: "Egresado 2023", videoUrlEmbed: "" },
];

/**
 * Simulación de llamada a API para obtener estudiantes.
 * Actualmente retorna datos mock.
 */
async function fetchStudents() {
  return MOCK_STUDENTS;
}

/**
 * Tarjeta que representa a un estudiante del departamento.
 * Muestra su nombre, especialidad y un video.
 * 
 * @param {Object} student - Información del estudiante
 */

function StudentCard({ student }) {
  // verifica si el estudiante tiene un video válido
  const hasVideo = Boolean(student.videoUrlEmbed && student.videoUrlEmbed.trim().length > 0);

  return (
    <div className="bg-[#722b4d] text-white rounded-2xl shadow-2xl overflow-hidden border border-white/20 transition">
      {/* información del estudiante */}
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold mb-1">{student.fullName}</h3>
        <p className="text-white/80 text-sm">{student.specialty}</p>
      </div>

      {/* video */}
      {hasVideo ? (
        <div className="w-full aspect-video bg-black">
          <iframe
            className="w-full h-full"
            src={student.videoUrlEmbed}
            title={`Video de ${student.fullName}`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="w-full aspect-video bg-black/40 flex items-center justify-center">
          <p className="text-white/70 text-sm">Video no disponible</p>
        </div>
      )}
    </div>
  );
}

/**
 * Página que muestra testimonios de estudiantes del departamento.
 */

export default function Estudiantes() {
  // estado que almacena la lista de estudiantes
  const [students, setStudents] = useState([]);
  // estado para controlar la carga de datos
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Carga de estudiantes.
   */
  useEffect(() => {
    async function loadStudents() {
      try {
        const data = await fetchStudents();
        setStudents(data);
      } catch (error) {
        console.error("Error al cargar estudiantes:", error);
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadStudents();
  }, []);

  /**
   * Vista mientras los datos se están cargando
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Cargando estudiantes...</p>
      </div>
    );
  }

// verifica si existen estudiantes
  const hasStudents = students.length > 0;
  return (
    <div className="bg-gray-100 min-h-screen pt-12 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* título de la sección */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            NUESTROS ESTUDIANTES
          </h1>
          {/* línea decorativa */}
          <div className="w-24 h-1 bg-[#722b4d] mx-auto rounded-full" />
          {/* descripción */}
          <div className="max-w-3xl mx-auto mt-4">
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed">
              Presencia los testimonios y experiencias de los estudiantes que estudian y estudiaron en
              las carreras de este departamento.
            </p>
          </div>
        </div>

        {/* sección de tarjetas */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {!hasStudents ? (
              <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
                <p className="text-gray-500">No hay estudiantes disponibles.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {/* render dinámico de estudiantes */}
                {students.map((student) => (
                  <StudentCard key={student.id} student={student} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}