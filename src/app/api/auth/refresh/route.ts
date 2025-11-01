import { AuthResponse, RefreshTokensData, TokensResponse } from "@model/platzi-api";
import serverFetchWrapper from "@utils/server-fetch-wrapper";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST (req: NextRequest) {
    const refreshToken = req.cookies.get('refreshToken')?.value;
    const { keepMeLoggedIn } = (await req.json()) as RefreshTokensData;

    if(!refreshToken) {
        return NextResponse.json<AuthResponse>(
            { success: false, error: 'AuthorizationError: Токен не найден' },
            { status: 401 }
        );
    }

    const url = `${BASE_URL}/auth/refresh-token`;
    const response = await serverFetchWrapper<TokensResponse>({
        url,
        method: 'POST',
        body: { refreshToken }
    });

    if(!response.success) {
        return NextResponse.json<AuthResponse>(
            { success: false, error: response.error },
            { status: 401 }
        );
    }

    const res = NextResponse.json<AuthResponse>(
        { success: true, token: response.data.access_token},
        { status: response.status }
    );

    res.cookies.set('refreshToken', response.data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: keepMeLoggedIn ? 60 * 60 * 24 * 30 : undefined,        
    });

    return res;
}

