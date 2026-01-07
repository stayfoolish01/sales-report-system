/**
 * JWT認証ユーティリティ
 *
 * JWTトークンの生成と検証を行います。
 */

import jwt from 'jsonwebtoken';

/**
 * JWTペイロード型定義
 */
export interface JwtPayload {
  salesId: number;
  email: string;
  role: 'GENERAL' | 'ADMIN';
}

/**
 * JWTトークンを生成
 *
 * @param payload - トークンに含めるユーザー情報
 * @returns 生成されたJWTトークン
 * @throws JWT_SECRETが設定されていない場合
 */
export const generateToken = (payload: JwtPayload): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // @ts-ignore - jsonwebtokenの型定義の問題を回避
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
};

/**
 * JWTトークンを検証・デコード
 *
 * @param token - 検証するJWTトークン
 * @returns デコードされたペイロード
 * @throws トークンが無効または期限切れの場合
 */
export const verifyToken = (token: string): JwtPayload => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
  return decoded;
};
