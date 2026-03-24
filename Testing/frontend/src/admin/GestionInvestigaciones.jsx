import { useState, useEffect } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";
import { useResearchData } from "../hooks/useResearchData";
import { ProjectForm } from "../components/Research/ProjectForm";
import { ProjectCard } from "../components/Research/ProjectCard";

const DEFAULT_PERMISSIONS = {
  createProject: false,
  editProject: false,
  deleteProject: false,
  manageAccounts: false,
};

const EMPTY_FORM = {
  id: "",
  title: "",
  authors: [], 
  category_id: "", 
  year: "",
  abstract: "", 
  pdf_url: "", 
  image_url: "",
  status: "in_progress",
};

/**
 * Main container for research project management.
 * Coordinates state, permissions, and layout rendering.
 *
 * @returns {JSX.Element} The research management view.
 */
export default function ResearchManagement() {
  const { user } = useAuth();
  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;

  // Lógica delegada al Custom Hook
  const shouldFetchDependencies = permissions.createProject || permissions.editProject;
  const { availableAuthors, categories } = useResearchData(shouldFetchDependencies);

  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const isEditing = Boolean(editingProjectId);

  const resetFormState = () => {
    setShowForm(false);
    setEditingProjectId(null);
    setFormData(EMPTY_FORM);
  };

  const initializeNewProject = () => {
    setEditingProjectId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const loadProjectForEditing = (project) => {
    setEditingProjectId(project.id);
    setFormData({
      id: project.id || "",
      title: project.title || "",
      authors: project.authors || [], 
      category_id: project.category_id || "",
      year: project.year || "",
      abstract: project.abstract || "",
      pdf_url: project.pdf_url || "",
      image_url: project.image_url || "",
      status: project.status || "in_progress",
    });
    setShowForm(true);
  };

  const deleteProject = () => {
    // Lógica futura para borrar
  };

  const updateFormState = (event) => {
    const { name, value } = event.target;
    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  };

// Función para buscar los proyectos en la BD
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data); // Guardamos los proyectos en React
      }
    } catch (error) {
      console.error("[ERROR] No se pudieron cargar los proyectos:", error);
    }
  };

  // Ejecutar la búsqueda automáticamente al entrar a la página
  useEffect(() => {
    fetchProjects();
  }, []);

const submitProjectData = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
        method: "POST", 
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("¡Proyecto guardado con éxito!");
        resetFormState();
        fetchProjects();
      } else {
        const data = await response.json();
        alert(`Error al guardar: ${data.message}`);
      }
    } catch (error) {
      console.error("[ERROR] Network failure saving project:", error);
      alert("Error de red al intentar guardar el proyecto.");
    }
  };

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-[#722b4d] sm:text-4xl">
          Gestión de Investigaciones
        </h1>

        {permissions.createProject && (
          <button
            type="button"
            onClick={initializeNewProject}
            className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
          >
            + Nuevo Proyecto
          </button>
        )}
      </div>

      <div className="mt-8">
        {showForm ? (
          <ProjectForm
            formData={formData}
            onChange={updateFormState}
            onSubmit={submitProjectData}
            onCancel={resetFormState}
            isEditing={isEditing}
            availableUsers={availableAuthors} 
            setFormData={setFormData}
            categories={categories}
          />
        ) : (
          <div className="space-y-4">
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={loadProjectForEditing}
                  onDelete={deleteProject}
                  permissions={permissions}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#722b4d]/20 bg-white p-8 text-center text-gray-500">
                No hay proyectos registrados todavía.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}