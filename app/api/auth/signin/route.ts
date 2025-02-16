import { NextRequest, NextResponse } from 'next/server';
import {prisma} from "@/prisma/prismaClient";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";



export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    
  
    // console.log(body)
    const body = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const { email, password } = body;
  
    // 2. Find user
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        // Add other fields you need, but exclude sensitive data
      }
    });

    console.log("user ======",user)
    // 3. Verify credentials
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 4. Generate token and create response
    try {
      const  token = await generateToken(user);

      const response = NextResponse.json(
        {message:`Bienvenu ${user.email}`},
        { status: 200 }
      );

      

      response.cookies.set("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        secure: false,
        sameSite: "strict",
      });

      return response;

    } catch (tokenError) {
      console.log("Token generation error",tokenError);
      return NextResponse.json(
        { message: "Authentication error" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.log("Sign-in error:",error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } 
}