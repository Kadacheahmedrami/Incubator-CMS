// pages/api/auth/logout.js

import {  NextResponse } from 'next/server';
import { destroyAuthCookie } from '@/lib/auth';

export async function POST() {


    const response =  NextResponse.json(
      {message : "logged out succefuly"},
      {status : 200}
    )

    destroyAuthCookie(response)


    return response

}
