/**
 * @file userModel.test.js
 * @description Unit tests for UserModel (DAO layer).
 *
 * Mocking strategy:
 *  - pool.query   → intercepted at prototype level 2 (vi.fn on proto.query)
 *  - pool.connect → intercepted at prototype level 2 (vi.fn on proto.connect)
 *
 * Both must go on the prototype so that userModel.js (which holds its own
 * require() reference to the same pool singleton) sees the mocked methods.
 *
 * Node v25 + CJS + Vitest ESM: vi.mock('pg') never works here.
 * All interception is done via prototype chain manipulation.
 */

import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

// ─── 1. Intercept pool.query AND pool.connect at prototype level 2 ───────────
const poolModule = await import('../../../config/db');
const pool = poolModule.default ?? poolModule;

let proto = pool;
for (let i = 0; i < 2; i++) proto = Object.getPrototypeOf(proto);
proto.query = vi.fn();
proto.connect = vi.fn();

// ─── 2. Shared mock client returned by pool.connect ──────────────────────────
const mockClient = {
  query: vi.fn(),
  release: vi.fn(),
};
proto.connect.mockResolvedValue(mockClient);

// ─── 3. Import model AFTER mocks are in place ─────────────────────────────────
const userModule = await import('../../../models/userModel');
const UserModel = userModule.default ?? userModule;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const makeUser = (overrides = {}) => ({
  id: 1,
  full_name: 'Test User',
  email: 'test@example.com',
  role: 'alumni',
  ...overrides,
});

// =============================================================================
describe('UserModel', () => {

  beforeEach(() => {
    proto.query.mockReset();
    proto.connect.mockReset();
    mockClient.query.mockReset();
    mockClient.release.mockReset();
    proto.connect.mockResolvedValue(mockClient);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getAll', () => {

    it('returns array of users ordered by full_name', async () => {
      const users = [makeUser({ id: 1 }), makeUser({ id: 2, full_name: 'Zara' })];
      proto.query.mockResolvedValue({ rows: users });

      const result = await UserModel.getAll();

      expect(result).toEqual(users);
      expect(proto.query.mock.calls[0][0]).toContain('SELECT id, full_name, email, role FROM users');
      expect(proto.query.mock.calls[0][0]).toContain('ORDER BY full_name ASC');
    });

    it('returns empty array when no users exist', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      const result = await UserModel.getAll();

      expect(result).toEqual([]);
    });

    it('does NOT include password_hash in the query', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      await UserModel.getAll();

      expect(proto.query.mock.calls[0][0]).not.toContain('password');
    });

    it('throws and propagates database errors', async () => {
      proto.query.mockRejectedValue(new Error('DB connection lost'));

      await expect(UserModel.getAll()).rejects.toThrow('DB connection lost');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getByEmail', () => {

    it('returns user object when email exists', async () => {
      const user = makeUser({ password_hash: 'hashed' });
      proto.query.mockResolvedValue({ rows: [user] });

      const result = await UserModel.getByEmail('test@example.com');

      expect(result).toEqual(user);
      expect(proto.query.mock.calls[0][1]).toEqual(['test@example.com']);
    });

    it('returns null when email does not exist', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      const result = await UserModel.getByEmail('ghost@example.com');

      expect(result).toBeNull();
    });

    it('uses $1 parameterized query to prevent SQL injection', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      await UserModel.getByEmail("'; DROP TABLE users; --");

      const sql = proto.query.mock.calls[0][0];
      expect(sql).toContain('$1');
      expect(proto.query.mock.calls[0][1]).toEqual(["'; DROP TABLE users; --"]);
    });

    it('throws on database error', async () => {
      proto.query.mockRejectedValue(new Error('Timeout'));

      await expect(UserModel.getByEmail('x@x.com')).rejects.toThrow('Timeout');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getByRole', () => {

    it('returns users matching the given role', async () => {
      const teachers = [makeUser({ role: 'teacher' }), makeUser({ id: 2, role: 'teacher' })];
      proto.query.mockResolvedValue({ rows: teachers });

      const result = await UserModel.getByRole('teacher');

      expect(result).toEqual(teachers);
      expect(proto.query.mock.calls[0][1]).toEqual(['teacher']);
    });

    it('returns empty array when no users match role', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      const result = await UserModel.getByRole('admin');

      expect(result).toEqual([]);
    });

    it('query selects id, full_name, email (no password)', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      await UserModel.getByRole('alumni');

      const sql = proto.query.mock.calls[0][0];
      expect(sql).toContain('SELECT id, full_name, email');
      expect(sql).not.toContain('password');
    });

    it('throws on database error', async () => {
      proto.query.mockRejectedValue(new Error('Role query failed'));

      await expect(UserModel.getByRole('teacher')).rejects.toThrow('Role query failed');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  describe('deleteById', () => {

    it('returns true when user is found and deleted', async () => {
      proto.query.mockResolvedValue({ rows: [{ id: 5 }] });

      const result = await UserModel.deleteById(5);

      expect(result).toBe(true);
      expect(proto.query.mock.calls[0][1]).toEqual([5]);
    });

    it('returns false when user does not exist', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      const result = await UserModel.deleteById(999);

      expect(result).toBe(false);
    });

    it('uses RETURNING id to confirm deletion', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      await UserModel.deleteById(1);

      expect(proto.query.mock.calls[0][0]).toContain('RETURNING id');
    });

    it('throws on database error', async () => {
      proto.query.mockRejectedValue(new Error('FK constraint'));

      await expect(UserModel.deleteById(1)).rejects.toThrow('FK constraint');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  describe('updateById', () => {

    const baseData = { full_name: 'New Name', email: 'new@mail.com', role: 'teacher' };

    it('returns updated user when found (without passwordHash)', async () => {
      const updated = makeUser(baseData);
      proto.query.mockResolvedValue({ rows: [updated] });

      const result = await UserModel.updateById(1, baseData);

      expect(result).toEqual(updated);
      // 4 values: full_name, email, role, userId
      expect(proto.query.mock.calls[0][1]).toHaveLength(4);
    });

    it('includes password_hash in query when passwordHash is provided', async () => {
      const dataWithPwd = { ...baseData, passwordHash: 'newhash123' };
      proto.query.mockResolvedValue({ rows: [makeUser()] });

      await UserModel.updateById(1, dataWithPwd);

      const values = proto.query.mock.calls[0][1];
      // 5 values: full_name, email, role, passwordHash, userId
      expect(values).toHaveLength(5);
      expect(values).toContain('newhash123');
    });

    it('returns null when user does not exist', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      const result = await UserModel.updateById(999, baseData);

      expect(result).toBeNull();
    });

    it('uses RETURNING id, full_name, email, role', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      await UserModel.updateById(1, baseData);

      expect(proto.query.mock.calls[0][0]).toContain('RETURNING id, full_name, email, role');
    });

    it('throws on database error', async () => {
      proto.query.mockRejectedValue(new Error('Unique violation'));

      await expect(UserModel.updateById(1, baseData)).rejects.toThrow('Unique violation');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  describe('updateAccountAndCleanProfiles', () => {

    const args = [1, 'Full Name', 'email@test.com', 'teacher', null];

    it('commits transaction and returns updated user on success', async () => {
      const updated = makeUser({ role: 'teacher' });
      mockClient.query
        .mockResolvedValueOnce(undefined)             // BEGIN
        .mockResolvedValueOnce({ rows: [updated] })   // UPDATE users
        .mockResolvedValueOnce(undefined)             // DELETE alumni_profiles
        .mockResolvedValueOnce(undefined);            // COMMIT

      const result = await UserModel.updateAccountAndCleanProfiles(...args);

      expect(result).toEqual(updated);
      expect(mockClient.query.mock.calls[0][0]).toBe('BEGIN');
      expect(mockClient.query.mock.calls.at(-1)[0]).toBe('COMMIT');
      expect(mockClient.release).toHaveBeenCalledOnce();
    });

    it('deletes alumni_profiles when role is teacher', async () => {
      const updated = makeUser({ role: 'teacher' });
      mockClient.query
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({ rows: [updated] })
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined);

      await UserModel.updateAccountAndCleanProfiles(1, 'N', 'e@e.com', 'teacher', null);

      const queries = mockClient.query.mock.calls.map(c => c[0]);
      expect(queries.some(q => typeof q === 'string' && q.includes('DELETE FROM alumni_profiles'))).toBe(true);
      expect(queries.some(q => typeof q === 'string' && q.includes('DELETE FROM professors'))).toBe(false);
    });

    it('deletes professors when role is alumni', async () => {
      const updated = makeUser({ role: 'alumni' });
      mockClient.query
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({ rows: [updated] })
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined);

      await UserModel.updateAccountAndCleanProfiles(1, 'N', 'e@e.com', 'alumni', null);

      const queries = mockClient.query.mock.calls.map(c => c[0]);
      expect(queries.some(q => typeof q === 'string' && q.includes('DELETE FROM professors'))).toBe(true);
      expect(queries.some(q => typeof q === 'string' && q.includes('DELETE FROM alumni_profiles'))).toBe(false);
    });

    it('deletes both profiles when role is admin', async () => {
      const updated = makeUser({ role: 'admin' });
      mockClient.query
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({ rows: [updated] })
        .mockResolvedValueOnce(undefined) // DELETE alumni_profiles
        .mockResolvedValueOnce(undefined) // DELETE professors
        .mockResolvedValueOnce(undefined); // COMMIT

      await UserModel.updateAccountAndCleanProfiles(1, 'N', 'e@e.com', 'admin', null);

      const queries = mockClient.query.mock.calls.map(c => c[0]);
      expect(queries.some(q => typeof q === 'string' && q.includes('DELETE FROM alumni_profiles'))).toBe(true);
      expect(queries.some(q => typeof q === 'string' && q.includes('DELETE FROM professors'))).toBe(true);
    });

    it('includes passwordHash in UPDATE when provided', async () => {
      const updated = makeUser();
      mockClient.query
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({ rows: [updated] })
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined);

      await UserModel.updateAccountAndCleanProfiles(1, 'N', 'e@e.com', 'teacher', 'hashval');

      const updateCall = mockClient.query.mock.calls[1];
      expect(updateCall[1]).toContain('hashval');
      expect(updateCall[1]).toHaveLength(5);
    });

    it('rolls back and returns null when user is not found', async () => {
      mockClient.query
        .mockResolvedValueOnce(undefined)           // BEGIN
        .mockResolvedValueOnce({ rows: [] })        // UPDATE → not found
        .mockResolvedValueOnce(undefined);          // ROLLBACK

      const result = await UserModel.updateAccountAndCleanProfiles(999, 'N', 'e@e.com', 'teacher', null);

      expect(result).toBeNull();
      const queries = mockClient.query.mock.calls.map(c => c[0]);
      expect(queries).toContain('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalledOnce();
    });

    it('rolls back, releases client, and re-throws on database error', async () => {
      mockClient.query
        .mockResolvedValueOnce(undefined)                    // BEGIN
        .mockRejectedValueOnce(new Error('TX failed'));      // UPDATE → error

      await expect(
        UserModel.updateAccountAndCleanProfiles(1, 'N', 'e@e.com', 'teacher', null)
      ).rejects.toThrow('TX failed');

      const queries = mockClient.query.mock.calls.map(c => c[0]);
      expect(queries).toContain('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalledOnce();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getFullProfile', () => {

    it('returns null when user does not exist', async () => {
      proto.query.mockResolvedValueOnce({ rows: [] });

      const result = await UserModel.getFullProfile(99);

      expect(result).toBeNull();
      expect(proto.query).toHaveBeenCalledOnce();
    });

    it('returns base user merged with professor data for teacher role', async () => {
      const base = makeUser({ role: 'teacher' });
      const prof = { degree: 'PhD', area: 'Mathematics' };
      proto.query
        .mockResolvedValueOnce({ rows: [base] })
        .mockResolvedValueOnce({ rows: [prof] });

      const result = await UserModel.getFullProfile(1);

      expect(result).toEqual({ ...base, ...prof });
      expect(proto.query).toHaveBeenCalledTimes(2);
      expect(proto.query.mock.calls[1][0]).toContain('professors');
    });

    it('returns base user merged with alumni data for alumni role', async () => {
      const base = makeUser({ role: 'alumni' });
      const alumni = { degree: 'BSc', specialty: 'AI', is_profile_public: true };
      proto.query
        .mockResolvedValueOnce({ rows: [base] })
        .mockResolvedValueOnce({ rows: [alumni] });

      const result = await UserModel.getFullProfile(1);

      expect(result).toEqual({ ...base, ...alumni });
      expect(proto.query.mock.calls[1][0]).toContain('alumni_profiles');
    });

    it('returns only base user for admin role (no extended profile)', async () => {
      const base = makeUser({ role: 'admin' });
      proto.query.mockResolvedValueOnce({ rows: [base] });

      const result = await UserModel.getFullProfile(1);

      expect(result).toEqual(base);
      expect(proto.query).toHaveBeenCalledOnce();
    });

    it('returns base user even when extended profile row is missing', async () => {
      const base = makeUser({ role: 'teacher' });
      proto.query
        .mockResolvedValueOnce({ rows: [base] })
        .mockResolvedValueOnce({ rows: [] }); // no professor row

      const result = await UserModel.getFullProfile(1);

      expect(result).toEqual(base);
    });

    it('throws on database error', async () => {
      proto.query.mockRejectedValue(new Error('Query failed'));

      await expect(UserModel.getFullProfile(1)).rejects.toThrow('Query failed');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getAuthors', () => {

    it('returns teachers and alumni only', async () => {
      const authors = [
        makeUser({ role: 'teacher' }),
        makeUser({ id: 2, role: 'alumni' }),
      ];
      proto.query.mockResolvedValue({ rows: authors });

      const result = await UserModel.getAuthors();

      expect(result).toEqual(authors);
      const sql = proto.query.mock.calls[0][0];
      expect(sql).toContain("role IN ('teacher', 'alumni')");
    });

    it('returns empty array when no valid authors exist', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      const result = await UserModel.getAuthors();

      expect(result).toEqual([]);
    });

    it('throws on database error', async () => {
      proto.query.mockRejectedValue(new Error('Authors query failed'));

      await expect(UserModel.getAuthors()).rejects.toThrow('Authors query failed');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getProfileImage', () => {

    it('returns null when user does not exist', async () => {
      proto.query.mockResolvedValueOnce({ rows: [] });

      const result = await UserModel.getProfileImage(99);

      expect(result).toBeNull();
      expect(proto.query).toHaveBeenCalledOnce();
    });

    it('returns null when role is admin (no image table)', async () => {
      proto.query.mockResolvedValueOnce({ rows: [{ role: 'admin' }] });

      const result = await UserModel.getProfileImage(1);

      expect(result).toBeNull();
      expect(proto.query).toHaveBeenCalledOnce();
    });

    it('queries professors table for teacher role', async () => {
      const image = { image_data: Buffer.from('img'), image_mimetype: 'image/png' };
      proto.query
        .mockResolvedValueOnce({ rows: [{ role: 'teacher' }] })
        .mockResolvedValueOnce({ rows: [image] });

      const result = await UserModel.getProfileImage(1);

      expect(result).toEqual(image);
      expect(proto.query.mock.calls[1][0]).toContain('professors');
    });

    it('queries alumni_profiles table for alumni role', async () => {
      const image = { image_data: Buffer.from('img'), image_mimetype: 'image/jpeg' };
      proto.query
        .mockResolvedValueOnce({ rows: [{ role: 'alumni' }] })
        .mockResolvedValueOnce({ rows: [image] });

      const result = await UserModel.getProfileImage(1);

      expect(result).toEqual(image);
      expect(proto.query.mock.calls[1][0]).toContain('alumni_profiles');
    });

    it('returns null when image row does not exist in table', async () => {
      proto.query
        .mockResolvedValueOnce({ rows: [{ role: 'teacher' }] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await UserModel.getProfileImage(1);

      expect(result).toBeNull();
    });

    it('throws on database error', async () => {
      proto.query.mockRejectedValue(new Error('Image fetch failed'));

      await expect(UserModel.getProfileImage(1)).rejects.toThrow('Image fetch failed');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  describe('setLoginCode', () => {

    it('executes UPDATE and returns true', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      const result = await UserModel.setLoginCode(1, '123456', new Date('2099-01-01'));

      expect(result).toBe(true);
      expect(proto.query.mock.calls[0][1]).toEqual([
        '123456',
        new Date('2099-01-01'),
        1,
      ]);
    });

    it('SQL sets login_code and login_code_expires_at', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      await UserModel.setLoginCode(1, 'abc', new Date());

      const sql = proto.query.mock.calls[0][0];
      expect(sql).toContain('login_code');
      expect(sql).toContain('login_code_expires_at');
    });

    it('throws on database error', async () => {
      proto.query.mockRejectedValue(new Error('Set code failed'));

      await expect(UserModel.setLoginCode(1, 'x', new Date())).rejects.toThrow('Set code failed');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getLoginCode', () => {

    it('returns login code data when user exists', async () => {
      const row = { login_code: '654321', login_code_expires_at: new Date('2099-01-01') };
      proto.query.mockResolvedValue({ rows: [row] });

      const result = await UserModel.getLoginCode(1);

      expect(result).toEqual(row);
    });

    it('returns null when user does not exist', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      const result = await UserModel.getLoginCode(99);

      expect(result).toBeNull();
    });

    it('throws on database error', async () => {
      proto.query.mockRejectedValue(new Error('Get code failed'));

      await expect(UserModel.getLoginCode(1)).rejects.toThrow('Get code failed');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  describe('clearLoginCode', () => {

    it('sets both fields to NULL and returns true', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      const result = await UserModel.clearLoginCode(1);

      expect(result).toBe(true);
      const sql = proto.query.mock.calls[0][0];
      expect(sql).toContain('login_code = NULL');
      expect(sql).toContain('login_code_expires_at = NULL');
    });

    it('throws on database error', async () => {
      proto.query.mockRejectedValue(new Error('Clear failed'));

      await expect(UserModel.clearLoginCode(1)).rejects.toThrow('Clear failed');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  describe('getByResetToken', () => {

    it('returns user when reset token matches', async () => {
      const user = makeUser({ reset_token: 'tok123' });
      proto.query.mockResolvedValue({ rows: [user] });

      const result = await UserModel.getByResetToken('tok123');

      expect(result).toEqual(user);
      expect(proto.query.mock.calls[0][1]).toEqual(['tok123']);
    });

    it('returns null when token does not match', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      const result = await UserModel.getByResetToken('invalid');

      expect(result).toBeNull();
    });

    it('throws on database error', async () => {
      proto.query.mockRejectedValue(new Error('Token query failed'));

      await expect(UserModel.getByResetToken('t')).rejects.toThrow('Token query failed');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  describe('setResetToken', () => {

    it('executes UPDATE with correct values and returns true', async () => {
      proto.query.mockResolvedValue({ rows: [] });
      const expires = new Date('2099-12-31');

      const result = await UserModel.setResetToken(1, 'tok_abc', expires);

      expect(result).toBe(true);
      expect(proto.query.mock.calls[0][1]).toEqual(['tok_abc', expires, 1]);
    });

    it('SQL sets reset_token and reset_token_expires_at', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      await UserModel.setResetToken(1, 'x', new Date());

      const sql = proto.query.mock.calls[0][0];
      expect(sql).toContain('reset_token');
      expect(sql).toContain('reset_token_expires_at');
    });

    it('throws on database error', async () => {
      proto.query.mockRejectedValue(new Error('Set token failed'));

      await expect(UserModel.setResetToken(1, 'x', new Date())).rejects.toThrow('Set token failed');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  describe('updatePasswordAndClearToken', () => {

    it('returns true after updating password and nullifying token fields', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      const result = await UserModel.updatePasswordAndClearToken(1, 'newhash');

      expect(result).toBe(true);
      expect(proto.query.mock.calls[0][1]).toEqual(['newhash', 1]);
    });

    it('SQL sets password_hash and clears reset_token and reset_token_expires_at', async () => {
      proto.query.mockResolvedValue({ rows: [] });

      await UserModel.updatePasswordAndClearToken(1, 'h');

      const sql = proto.query.mock.calls[0][0];
      expect(sql).toContain('password_hash');
      expect(sql).toContain('reset_token = NULL');
      expect(sql).toContain('reset_token_expires_at = NULL');
    });

    it('throws on database error', async () => {
      proto.query.mockRejectedValue(new Error('Password update failed'));

      await expect(UserModel.updatePasswordAndClearToken(1, 'h')).rejects.toThrow('Password update failed');
    });
  });

});