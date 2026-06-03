import { getArchiveData } from "@/services/archive/archive";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const userId= req.headers.get("userId");

    if(!userId){
        return NextResponse.json(
            {error: "Missing userId"},
            {status: 400}
        );
    }

    const archive= await getArchiveData(userId);

    return NextResponse.json(archive);
}