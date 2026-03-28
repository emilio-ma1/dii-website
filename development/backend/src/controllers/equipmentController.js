/**
 * @file equipmentController.js
 * @description
 * Main controller for managing equipment.
 * Responsibilities:
 * - Orchestrate HTTP requests for equipment CRUD operations.
 * - Handle the receipt of binary files (images) and pass them to the model.
 * - Log critical actions in the audit log.
 */
const EquipmentModel = require('../models/equipmentModel');
const AuditLogModel = require('../models/auditLogModel');

/**
 * Retrieves the complete list of equipment registered in the system.
 * * @param {object} req Express HTTP request object.
 * @param {object} res Express HTTP response object.
 * @returns {Promise<object>} JSON containing the list of equipment and status 200.
 * @throws {Error} If the database query fails (returns 500).
 */
const getEquipment = async (req, res) => {
  try {
    const equipmentList = await EquipmentModel.getAll();
    return res.status(200).json(equipmentList);
  } catch (error) {
    console.error('[ERROR] Failed to fetch equipment list:', error);
    return res.status(500).json({ message: 'Error interno del servidor al obtener el equipamiento.' });
  }
};

/**
 * Creates a new equipment record, supporting the optional upload of a binary image.
 * * @param {object} req Express HTTP request object, containing the body (FormData strings) and file (Multer).
 * @param {object} res Express HTTP response object.
 * @returns {Promise<object>} JSON with the created equipment and status 201, or a validation error 400.
 * @throws {Error} If insertion into the database or audit log fails (returns 500).
 */
const createEquipment = async (req, res) => {
  const { name, description } = req.body;
  const adminId = req.user ? req.user.id : null;

  if (!name) {
    return res.status(400).json({ message: 'El nombre del equipamiento es obligatorio.' });
  }

  try {
    const imageData = req.file ? req.file.buffer : null;
    const imageMimetype = req.file ? req.file.mimetype : null;

    const newEquipment = await EquipmentModel.create(
      name, description || null, imageData, imageMimetype
    );

    if (adminId) {
      await AuditLogModel.logAction(adminId, 'CREATE', 'equipment', newEquipment.id, { name: newEquipment.name });
    }

    return res.status(201).json({ message: 'Equipamiento registrado exitosamente.', equipment: newEquipment });
  } catch (error) {
    console.error('[ERROR] Failed to create equipment:', error);
    return res.status(500).json({ message: 'Error interno al registrar el equipamiento.' });
  }
};

/**
 * Updates an existing equipment record. Retains the previous image if a new one is not provided.
 * * @param {object} req Express HTTP request object, containing params (id) and body/file.
 * @param {object} res Express HTTP response object.
 * @returns {Promise<object>} JSON with update confirmation and status 200, or 404 if not found.
 * @throws {Error} If the database update fails (returns 500).
 */
const updateEquipment = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const adminId = req.user ? req.user.id : null;

  if (!name) {
    return res.status(400).json({ message: 'El nombre del equipamiento es obligatorio.' });
  }

  try {
    const imageData = req.file ? req.file.buffer : null;
    const imageMimetype = req.file ? req.file.mimetype : null;

    const updatedEquipment = await EquipmentModel.update(
      id, name, description || null, imageData, imageMimetype
    );

    if (!updatedEquipment) {
      return res.status(404).json({ message: 'Equipamiento no encontrado.' });
    }

    if (adminId) {
      await AuditLogModel.logAction(adminId, 'UPDATE', 'equipment', id, { name: updatedEquipment.name });
    }

    return res.status(200).json({ message: 'Equipamiento actualizado.', equipment: updatedEquipment });
  } catch (error) {
    console.error(`[ERROR] Failed to update equipment ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al actualizar el equipamiento.' });
  }
};

/**
 * Removes a specific equipment record from the system.
 * * @param {object} req Express HTTP request object.
 * @param {object} res Express HTTP response object.
 * @returns {Promise<object>} JSON with a success message (200) or a “resource not found” error (404).
 * @throws {Error} If the database deletion fails (returns 500).
 */
const deleteEquipment = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user ? req.user.id : null;

  try {
    const deletedEquipment = await EquipmentModel.delete(id);
    
    if (!deletedEquipment) {
      return res.status(404).json({ message: 'Equipamiento no encontrado.' });
    }

    if (adminId) {
      await AuditLogModel.logAction(adminId, 'DELETE', 'equipment', id, { name: deletedEquipment.name });
    }

    return res.status(200).json({ message: 'Equipamiento eliminado exitosamente.' });
  } catch (error) {
    console.error(`[ERROR] Failed to delete equipment ID ${id}:`, error);
    return res.status(500).json({ message: 'Error al eliminar el equipamiento.' });
  }
};

/**

* Serves the binary image file associated with a specific device.
* @param {object} req HTTP request object.
* @param {object} res HTTP response object.
* @returns {Promise<Buffer|object>} Binary buffer of the image with correct headers, or JSON 404/500 in case of error.
* @throws {Error} If the database read fails.
*/
const getEquipmentImage = async (req, res) => {
  const { id } = req.params;
  try {
    const equipment = await EquipmentModel.getImage(id);
    
    if (!equipment || !equipment.image_data) {
      return res.status(404).json({ message: 'Imagen no encontrada.' });
    }

    res.set('Content-Type', equipment.image_mimetype);
    res.set('Cross-Origin-Resource-Policy', 'cross-origin'); 
    
    return res.send(equipment.image_data);
  } catch (error) {
    console.error(`[ERROR] Controller failed to serve image for equipment ID ${id}:`, error);
    return res.status(500).json({ message: 'Error interno al obtener la imagen.' });
  }
};

module.exports = {
  getEquipment, createEquipment, updateEquipment, deleteEquipment, getEquipmentImage
};