import { AuthResponse, RegisterUserData, TokensResponse } from "@model/platzi-api";
import serverFetchWrapper from "@utils/server-fetch-wrapper";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST (req: Request) {
    const { email, password, keepMeLoggedIn } = (await req.json()) as RegisterUserData;
    const url = `${BASE_URL}/auth/login`;

    const response = await serverFetchWrapper<TokensResponse>({
        url,
        method: 'POST',
        body: { email, password }
    });

    if(!response.success) {
        return NextResponse.json<AuthResponse>(
            { success: false, error: response.error },
            { status: response.status }  
        );
    }

    const res = NextResponse.json<AuthResponse>(
        { success: true, token: response.data.access_token },
        { status: response.status }
    );

    res.cookies.set('refreshToken', response.data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: keepMeLoggedIn ? 60 * 60 * 24 * 30 : undefined,
    });

    res.cookies.set('grace', '1', {
        httpOnly: false,
        sameSite: 'strict',
        path: './',
        maxAge: 5,
    });

    return res;
}

