/**
 * @file contactController.js
 * @description 
 * Thin controller for managing department contacts.
 * * Responsibilities:
 * - Validate incoming HTTP request payloads.
 * - Delegate database operations to the ContactModel.
 * - Return standardized HTTP responses and error messages.
 */
const ContactModel = require('../models/contactModel');
const AuditLogModel = require('../models/auditLogModel'); 

/**
 * Retrieves the list of all contacts.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<object>} JSON response with the contacts list.
 */
const getContacts = async (req, res) => {
  try {
    const list = await ContactModel.getAll();
    return res.status(200).json(list);
  } catch (error) {
    console.error('[ERROR] Failed to fetch contacts list:', error);
    return res.status(500).json({ message: 'Error interno al obtener los contactos.' });
  }
};

/**
 * Creates a new contact record.
 * * WHY: Uses early returns to validate inputs, avoiding deep nesting and improving readability. Also logs the creation action for audit purposes.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<object>} JSON response with the created record.
 */
const createContact = async (req, res) => {
  const { initials, full_name, role } = req.body;
  const adminId = req.user ? req.user.id : null;

  if (!initials || !full_name || !role) {
    return res.status(400).json({ message: 'Las iniciales, nombre completo y cargo son obligatorios.' });
  }

  try {
    const newContact = await ContactModel.create(initials, full_name, role);

    if (adminId) {
      await AuditLogModel.logAction(adminId, 'CREATE', 'contacts', newContact.id, { name: newContact.full_name });
    }

    return res.status(201).json({ message: 'Contacto registrado exitosamente.', contact: newContact });
  } catch (error) {
    console.error('[ERROR] Failed to create contact:', error);
    return res.status(500).json({ message: 'Error interno al registrar el contacto.' });
  }
};

/**
 * Updates an existing contact record.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<object>} JSON response with the updated record.
 */
const updateContact = async (req, res) => {
  const { id } = req.params;
  const { initials, full_name, role } = req.body;
  const adminId = req.user ? req.user.id : null;

  if (!initials || !full_name || !role) {
    return res.status(400).json({ message: 'Las iniciales, nombre completo y cargo son obligatorios.' });
  }

  try {
    const updated = await ContactModel.update(id, initials, full_name, role);

    if (!updated) {
      return res.status(404).json({ message: 'Contacto no encontrado.' });
    }

    if (adminId) {
      await AuditLogModel.logAction(adminId, 'UPDATE', 'contacts', id, { name: updated.full_name });
    }

    return res.status(200).json({ message: 'Contacto actualizado.', contact: updated });
  } catch (error) {
    console.error(`[ERROR] Failed to update contact ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al actualizar el contacto.' });
  }
};

/**
 * Deletes a contact record.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @returns {Promise<object>} JSON response confirming deletion.
 */
const deleteContact = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user ? req.user.id : null;

  try {
    const deleted = await ContactModel.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Contacto no encontrado.' });
    }

    if (adminId) {
      await AuditLogModel.logAction(adminId, 'DELETE', 'contacts', id, { id });
    }

    return res.status(200).json({ message: 'Contacto eliminado exitosamente.' });
  } catch (error) {
    console.error(`[ERROR] Failed to delete contact ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al eliminar el contacto.' });
  }
};

module.exports = {
  getContacts, createContact, updateContact, deleteContact
};