import { useEffect, useState } from "react";

const MOCK_STUDENTS = [
  {
    id: 1,
    fullname: "Ejemplo 1",
    specialty: "Egresado 2022",
    videoUrlEmbed: " ",
  },
  {
    id: 2,
    fullname: "Ejemplo 2",
    specialty: "8vo Semestre",
    videoUrlEmbed: " ",
  },
  {
    id: 3,
    fullname: "Ejemplo 3",
    specialty: "Egresado 2023",
    videoUrlEmbed: " ",
  },
];

export default function NuestrosEstudiantes() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    {/* para probar si funciona */}
    return MOCK_STUDENTS;
  };

  useEffect(() => {
    const run = async () => {
      try {
        const data = await fetchStudents();
        setStudents(data);
      } catch (err) {
        console.error("Error al cargar estudiantes:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Cargando estudiantes...</p>
      </div>
    );
  }

  return (
    <div className="mbg-gray-100 min-h-screen pt-12 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* titulo */}
        <div className="text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
          Nuestros Estudiantes
        </h1>
        <div className="w-24 h-1 bg-[#610b2f] mx-auto rounded-full"></div>
        <div className="max-w-3xl mx-auto">
          {/* descripción de la sección */}
        <p className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed">
          Presencia los testimonios y experiencias de los estudiantes que estudian y estudiaron en las carreras de este departamento.
        </p>
      </div>
    </div>
  </div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {students.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
              <p className="text-gray-500">No hay estudiantes disponibles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="bg-[#610b2f] text-white rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition">
                  {/* información estudiantes */}
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-1">
                      {student.fullname}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {student.specialty}
                    </p>
                  </div>

                  {/* video */}
                  {student.videoUrlEmbed ? (
                    <div className="w-full aspect-video bg-black">
                      <iframe
                        className="w-full h-full"
                        src={student.videoUrlEmbed}
                        title={`Video de ${student.fullname}`}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
