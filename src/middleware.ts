import { NextRequest, NextResponse } from "next/server";

export function middleware (req: NextRequest) {
    const refreshToken = req.cookies.get('refreshToken')?.value;
    const grace = req.cookies.get('grace')?.value;
    const res = NextResponse.next();

    if(!refreshToken && !grace) {
        res.cookies.set('unauthorized', '1');
    }

    return res;
}

export const config = {
    matcher: ['/my'],
};