import { validateStatusParams } from "@/lib";
import { getGameStatus } from "@/services";
import { ApiResponse, GameStatusResponse } from "@/types";
import { ERROR_CODES, ERROR_MESSAGES } from "@/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const userId = request.headers.get('userId');

        const { isValid, errors, data } = validateStatusParams(searchParams, userId);
        if (!isValid || !data) {
            return NextResponse.json<ApiResponse<null>>(
                { data: null, error: { code: ERROR_CODES.VALIDATION_ERROR, message: errors?.join("; ") ?? ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR] } },
                { status: 400 }
            );
        }

        const { boardSize, date } = data;

        const status = await getGameStatus(date, boardSize, userId!);

        return NextResponse.json<ApiResponse<GameStatusResponse>>({ data: status });
    } catch (error) {
        console.error("Error fetching status:", error);
        return NextResponse.json<ApiResponse<null>>(
            { data: null, error: { code: ERROR_CODES.INTERNAL_SERVER_ERROR, message: ERROR_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR] } },
            { status: 500 }
        );
    }
}
