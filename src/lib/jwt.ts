import { jwtVerify } from 'jose';
import { NextApiRequest, NextApiResponse } from 'next';

export async function verifyJWT(req: NextApiRequest, res: NextApiResponse) {
  const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SIGNING_KEY);
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return null;
  }
}
