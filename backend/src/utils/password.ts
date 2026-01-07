/**
 * パスワードハッシュ化ユーティリティ
 *
 * bcryptを使用してパスワードのハッシュ化と検証を行います。
 */

import * as bcrypt from 'bcrypt';

/**
 * パスワードをハッシュ化
 *
 * bcryptを使用してパスワードをハッシュ化します。
 * saltRoundsは10を使用（セキュリティと速度のバランス）。
 *
 * @param password - ハッシュ化する平文パスワード
 * @returns ハッシュ化されたパスワード
 * @throws bcryptのエラーが発生した場合
 *
 * @example
 * ```typescript
 * const hashedPassword = await hashPassword('myPassword123');
 * console.log(hashedPassword); // $2b$10$...
 * ```
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * パスワードを検証
 *
 * 平文パスワードとハッシュ化されたパスワードを比較し、
 * 一致するかどうかを判定します。
 *
 * @param password - 検証する平文パスワード
 * @param hash - データベースに保存されているハッシュ化されたパスワード
 * @returns パスワードが一致する場合はtrue、しない場合はfalse
 * @throws bcryptのエラーが発生した場合
 *
 * @example
 * ```typescript
 * const isMatch = await comparePassword('myPassword123', hashedPassword);
 * if (isMatch) {
 *   console.log('パスワードが一致しました');
 * } else {
 *   console.log('パスワードが一致しません');
 * }
 * ```
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
