import { SignJWT } from 'jose';

import bcrypt from "bcryptjs";
import { NextResponse } from 'next/server';

// Constants
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'supersecret'
);
const ISSUER = 'your-app-name';
const AUDIENCE = 'your-app-users';
const SALT_ROUNDS = 10;

// Types
interface User {
  id: string;
  password: string;
  // Add other user properties
}

// interface JWTPayload {
//   user: Omit<User, 'password'>;  // Exclude password from JWT
// }

// Password hashing functions
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function generateToken(user: User): Promise<string> {
  // Create a new user object without the password
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { password, ...userWithoutPassword } = user;


  const jwt = await new SignJWT({ user: userWithoutPassword })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime('1h')
    .sign(SECRET);
  
  return jwt;
}

// export async function verifyToken(token: string): Promise<JWTPayload | null> {
//   try {
//     const { payload } = await jwtVerify(token, SECRET, {
//       issuer: ISSUER,
//       audience: AUDIENCE,
//     });
//     return payload as JWTPayload;
//   } catch (error) {
//     return null;
//   }
// }



export function destroyAuthCookie(res: NextResponse) {
  
    res.cookies.set("token", '', {
        httpOnly: true,
        maxAge: 0,
        path: "/",
        secure: false,
        sameSite: "strict",
      });
  
}



