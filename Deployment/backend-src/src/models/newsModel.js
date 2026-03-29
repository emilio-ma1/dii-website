/**
 * @file newsModel.js
 * @description
 * Data Access Object (DAO) for the 'news' entity.
 * Handles database queries, optimized for binary file storage (BYTEA).
 */
const pool = require('../config/db');

const NewsModel = {
  /**
   * Retrieves all news records ordered by publication date (descending).
   * Excludes heavy binary fields (image_data) to preserve memory.
   *
   * @returns {Promise<Array<object>>} An array of news objects.
   * @throws {Error} If the database query fails.
   */
  getAll: async () => {
    try {
      const query = `
        SELECT id, title, slug, content, is_active, published_at, created_by 
        FROM news 
        ORDER BY published_at DESC;
      `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('[ERROR] Failed to fetch all news from database:', error);
      throw error;
    }
  },

  /**
   * Inserts a new news post into the database with binary image support.
   *
   * @param {string} title The title of the news.
   * @param {string} slug The URL-friendly identifier.
   * @param {string} content The main body of the news.
   * @param {Buffer|null} imageData The binary buffer of the image.
   * @param {string|null} imageMimetype The MIME type of the image.
   * @param {number|null} userId The ID of the admin user creating the post.
   * @param {boolean} isActive The visibility status of the news.
   * @returns {Promise<object>} The newly created news object (without binary data).
   * @throws {Error} If the database insertion fails.
   */
  create: async (title, slug, content, imageData, imageMimetype, userId, isActive) => {
    try {
      const query = `
        INSERT INTO news (title, slug, content, image_data, image_mimetype, created_by, is_active, published_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING id, title, slug, content, is_active, published_at, created_by;
      `;
      const values = [title, slug, content, imageData, imageMimetype, userId, isActive];
      
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('[ERROR] Failed to insert news into database:', error);
      throw error;
    }
  },

  /**
   * Updates an existing news post.
   * Uses COALESCE to keep the existing image if a new one is not provided.
   *
   * @param {number|string} id The ID of the news to update.
   * @param {string} title The new title.
   * @param {string} slug The new slug.
   * @param {string} content The new content.
   * @param {Buffer|null} imageData The new binary image buffer.
   * @param {string|null} imageMimetype The new image MIME type.
   * @param {boolean} isActive The new visibility status.
   * @returns {Promise<object|null>} The updated news object.
   * @throws {Error} If the database update fails.
   */
  update: async (id, title, slug, content, imageData, imageMimetype, isActive) => {
    try {
      const query = `
        UPDATE news 
        SET 
          title = $1, 
          slug = $2, 
          content = $3, 
          is_active = $4,
          image_data = COALESCE($5, image_data),
          image_mimetype = COALESCE($6, image_mimetype)
        WHERE id = $7
        RETURNING id, title, slug, content, is_active, published_at;
      `;
      const values = [title, slug, content, isActive, imageData, imageMimetype, id];
      const { rows } = await pool.query(query, values);
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to update news ID ${id} in database:`, error);
      throw error;
    }
  },

  /**
   * Deletes a news post from the database.
   *
   * @param {number|string} id The ID of the news to delete.
   * @returns {Promise<object|null>} The deleted news object.
   * @throws {Error} If the database deletion fails.
   */
  delete: async (id) => {
    try {
      const query = 'DELETE FROM news WHERE id = $1 RETURNING id, title;';
      const { rows } = await pool.query(query, [id]);
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to delete news ID ${id} from database:`, error);
      throw error;
    }
  },

  /**
   * Retrieves a specific news post by its unique URL slug.
   *
   * @param {string} slug The unique URL-friendly string.
   * @returns {Promise<object|null>} The news object.
   * @throws {Error} If the database query fails.
   */
  getBySlug: async (slug) => {
    try {
      const query = `
        SELECT id, title, slug, content, is_active, published_at, created_by 
        FROM news 
        WHERE slug = $1;
      `;
      const { rows } = await pool.query(query, [slug]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to fetch news by slug ${slug}:`, error);
      throw error;
    }
  },

  /**
   * Retrieves exclusively the binary image data for a specific news post.
   * Used for the image serving tunnel.
   * * @param {number|string} id The news ID.
   * @returns {Promise<object|null>} Object containing image_data and image_mimetype.
   */
  getImage: async (id) => {
    try {
      const query = 'SELECT image_data, image_mimetype FROM news WHERE id = $1;';
      const { rows } = await pool.query(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`[ERROR] Failed to fetch image for news ID ${id}:`, error);
      throw error;
    }
  }
};

module.exports = NewsModel;