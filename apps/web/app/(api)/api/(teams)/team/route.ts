import { NextResponse } from "next/server";
import { db, MemberRole } from "@workspace/db";
import { currentUser } from "@clerk/nextjs/server";



export async function POST(req:Request){
    try {
        const {name} = await req.json()
        const user = await currentUser()
        if(!user){
            return new NextResponse("Unauthorized", {status:401})
        }

        const userdata = await db.user.findUnique({
            where:{
                id:user.id
            }
        })

        if(!userdata){
            return new NextResponse("User not found", {status:404})
        }


        if(!name){
            return new NextResponse("Name is required", {status:400})
        }


       const team =  await db.team.create({
                data:{
                    name,
                    creatorId:userdata.id
                }
        })

        await db.member.create({
            data:{
                teamId:team.id,
                role:MemberRole.Owner,
                userId:userdata.id

            }
        })

        return new NextResponse("Team created successfully", {status:201})   
        
    } catch (error:any) {
        console.error(error.message)
        return new NextResponse("Internal server error", {status:500})
        
    }
}

export async function GET(req:Request){
    try {
        const user = await currentUser()
        if(!user){
            return new NextResponse("Unauthorized", {status:401})
        }

        const userdata = await db.user.findUnique({
            where:{
                id:user.id
            }
        })

        if(!userdata){
            return new NextResponse("User not found", {status:404})
        }

        const teams = await db.team.findMany({
            where: {
                OR: [
                    { creatorId: userdata.id },
                    { members: { some: { userId: userdata.id } } }
                ]
            },
            include: {
                members: true
            }
        });
        
        return new NextResponse(JSON.stringify(teams), {status:200})
        
    } catch (error:any) {
        console.error(error.message)
        return new NextResponse("Internal server error", {status:500})
        
    }
}

export async function DELETE(req:Request, {params}: {params: {teamId: string}}){
    try {
        const {teamId} = params
        const user = await currentUser()
        if(!user){
            return new NextResponse("Unauthorized", {status:401})
        }

        const userdata = await db.user.findUnique({
            where:{
                id:user.id
            }
        })

        if(!userdata){
            return new NextResponse("User not found", {status:404})
        }

        if(!teamId){
            return new NextResponse("TeamId is required", {status:400})
        }

        const team = await db.team.findUnique({
            where:{
                id:teamId
            }
        })

        if(!team){
            return new NextResponse("Team not found", {status:404})
        }

        if(team.creatorId !== userdata.id){
            return new NextResponse("Unauthorized", {status:401})
        }

        await db.team.delete({
            where:{
                id:teamId
            }
        })

        return new NextResponse("Team deleted successfully", {status:200})
        
    } catch (error:any) {
        console.error(error.message)
        return new NextResponse("Internal server error", {status:500})
        
    }
}