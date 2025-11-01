import { LogoutResponse } from "@model/platzi-api";
import { NextResponse } from "next/server";

export async function GET () {
    const res = NextResponse.json<LogoutResponse>(
        { success: true},
    );

    res.cookies.delete('refreshToken');

    return res;
}