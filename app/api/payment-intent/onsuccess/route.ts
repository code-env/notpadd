import { NextResponse } from "next/server";


export async function GET(req:Request){
    const data = await req.json

    console.log("data here", data)
    return new NextResponse("messag here",{status:200} )
}