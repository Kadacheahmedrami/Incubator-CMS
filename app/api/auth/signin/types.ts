import { Prisma } from "@prisma/client";


export type SignInData = {
    email: string;
    password: string;
  };

  export const requiredSignInFields: (keyof SignInData)[] = [
    "email",
    "password"

  ];

  export type User = Prisma.$UserPayload

  
  export type SignInResult =
  {
    user: User;
    token: string;

  }