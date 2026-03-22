/**
 * @file GestionEstudiantes.jsx
 * @description Main container for Alumni/Student Profiles management. Acts as a Thin Controller.
 */
import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";
import { useStudentManagement } from "../hooks/useStudentManagement";
import { StudentForm } from "../components/Student/StudentForm";
import { StudentCard } from "../components/Student/StudentCard";

const DEFAULT_PERMISSIONS = { createStudent: false, editStudent: false, deleteStudent: false };
const EMPTY_FORM = { id: "", user_id: "", specialty: "", degree: "", imageUrl: "", videoUrlEmbed: "", isProfilePublic: true };

export default function StudentManagement() {
  const { user } = useAuth();
  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;

  // Extraemos la lógica de red delegada al Custom Hook
  const { students, eligibleUsers, isSaving, saveStudentProfile, deleteStudentProfile } = useStudentManagement(permissions.createStudent);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const resetFormState = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormData({
      id: student.id,
      user_id: student.user_id,
      specialty: student.specialty,
      degree: student.degree,
      imageUrl: student.imageUrl || "",
      videoUrlEmbed: student.videoUrlEmbed || "",
      isProfilePublic: student.isProfilePublic ?? true
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este perfil público? La cuenta de usuario seguirá existiendo.")) {
      await deleteStudentProfile(id);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === "isProfilePublic" ? value === "true" : value 
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await saveStudentProfile(formData, editingId);
    if (success) resetFormState();
  };

  // Bloqueo de seguridad si el usuario no tiene permisos básicos
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