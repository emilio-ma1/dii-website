/**
 * @file GestionEstudiantes.jsx
 * @description
 * Main container for Alumni/Student Profiles management. Acts as a Thin Controller.
 * * Responsibilities:
 * - Manage local UI state (form visibility, current editing profile).
 * - Intercept file uploads and enforce size limits (2MB).
 * - Transform UI state into FormData payloads for binary network transport.
 */
import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";
import { useStudentManagement } from "../hooks/useStudentManagement";
import { StudentForm } from "../components/Student/StudentForm";
import { StudentCard } from "../components/Student/StudentCard";

const DEFAULT_PERMISSIONS = { createStudent: false, editStudent: false, deleteStudent: false };

const EMPTY_FORM = { id: "", user_id: "", specialty: "", degree: "", image_file: null, videoUrlEmbed: "", isProfilePublic: true };

/**
 * Main component for the Student/Alumni Management view.
 *
 * @returns {JSX.Element} The rendered management dashboard.
 */
export default function StudentManagement() {
  const { user } = useAuth();
  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;

  // Network logic delegated to Custom Hook
  const { students, eligibleUsers, isSaving, saveStudentProfile, deleteStudentProfile } = useStudentManagement(permissions.createStudent);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  /**
   * Resets the local form state to its initial empty configuration.
   * @returns {void}
   */
  const resetFormState = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  /**
   * Populates the form with existing data when triggering edit mode.
   *
   * @param {object} student The student record to be edited.
   * @returns {void}
   */
  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormData({
      id: student.id,
      user_id: student.user_id || "",
      specialty: student.specialty || "",
      degree: student.degree || "",
      image_file: null,
      videoUrlEmbed: student.videoUrlEmbed || "",
      isProfilePublic: student.isProfilePublic ?? true
    });
    setShowForm(true);
  };

  /**
   * Prompts for confirmation and triggers the deletion of a student profile.
   *
   * @param {string|number} id The unique identifier of the student profile.
   * @returns {Promise<void>}
   */
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este perfil público? La cuenta de usuario seguirá existiendo.")) {
      await deleteStudentProfile(id);
    }
  };

  /**
   * Updates the form state based on user input.
   * Includes a validation guard to intercept and validate binary files.
   *
   * @param {Event} e The input change event from the form.
   * @returns {void}
   */
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files && files.length > 0) {
      const selectedFile = files[0];

      if (selectedFile.size > 2 * 1024 * 1024) { // 2MB Limit
        alert("La imagen excede el límite de 2MB permitidos.");
        e.target.value = ""; // Reset the input
        return;
      }

      setFormData((prev) => ({ ...prev, image_file: selectedFile }));
      return;
    }

    setFormData(prev => ({ 
      ...prev, 
      [name]: name === "isProfilePublic" ? value === "true" : value 
    }));
  };

  /**
   * Handles the form submission.
   * Packs the JSON state into a FormData object to support multipart/form-data.
   *
   * @param {Event} event The form submission event.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const submitData = new FormData();
    submitData.append("user_id", formData.user_id || "");
    submitData.append("specialty", formData.specialty || "");
    submitData.append("degree", formData.degree || "");
    submitData.append("video_url_embed", formData.videoUrlEmbed || "");
    submitData.append("is_profile_public", formData.isProfilePublic);

    if (formData.image_file) {
      submitData.append("image", formData.image_file);
    }

    const success = await saveStudentProfile(submitData, editingId);
    if (success) resetFormState();
  };

  // RBAC Security Lock
  if (!permissions.createStudent && !permissions.editStudent && !permissions.deleteStudent) {
    return <div className="p-8 text-center text-red-600 font-bold">Acceso Denegado</div>;
  }

  return (
    <section className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-[#722b4d]">Gestión de Estudiantes</h1>
        {permissions.createStudent && (
          <button 
            onClick={() => { resetFormState(); setShowForm(true); }} 
            className="bg-[#722b4d] text-white px-5 py-3 rounded-xl shadow-md transition hover:opacity-90"
          >
            + Enlazar Perfil
          </button>
        )}
      </div>

      {showForm ? (
        <StudentForm
          formData={formData}
          eligibleUsers={eligibleUsers}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={resetFormState}
          isEditing={Boolean(editingId)}
          isSaving={isSaving}
        />
      ) : (
        <div className="space-y-4">
          {students.length > 0 ? (
            students.map(s => (
              <StudentCard 
                key={s.id} 
                student={s} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
                permissions={permissions} 
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#722b4d]/20 bg-white p-8 text-center text-gray-500">
              No hay perfiles de estudiantes registrados.
            </div>
          )}
        </div>
      )}
    </section>
  );
}