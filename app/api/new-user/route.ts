import { NextResponse } from "next/server";
import { createUser } from "@/services";
import { ApiResponse } from "@/types";
import { ERROR_CODES, ERROR_MESSAGES } from "@/constants";

export async function PUT(): Promise<NextResponse> {
    try {
        const userId = await createUser();
        return NextResponse.json<ApiResponse<{ userId: string }>>({ data: { userId } });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json<ApiResponse<null>>(
            { data: null, error: { code: ERROR_CODES.USER_CREATION_FAILED, message: ERROR_MESSAGES[ERROR_CODES.USER_CREATION_FAILED] } },
            { status: 500 }
        );
    }
}
