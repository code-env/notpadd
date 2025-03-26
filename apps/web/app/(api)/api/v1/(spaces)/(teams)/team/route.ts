import { NextResponse } from "next/server";
import { AccountType, db, MemberRole } from "@workspace/db";
import { getCurrentUser } from "@/lib/current-user";



export async function POST(req:Request){
    try {
        const {name} = await req.json()
        const user = await getCurrentUser()
        if(!user){
            return new NextResponse("Unauthorized", {status:401})
        }

        if(!name){
            return new NextResponse("Name is required", {status:400})
        }


        const getuserteams = await db.member.findMany({
            where:{
                userId:user.id,
                role:MemberRole.Owner
            }
        })

        if (getuserteams.length === 1 && user.accounttype === AccountType.Free){
            return new NextResponse("You have reached the maximum number of teams allowed for a free account", {status:403})
        }

        if (getuserteams.length === 3 && user.accounttype === AccountType.Basic){
            return new NextResponse("You have reached the maximum number of teams allowed for a Basic Account", {status:403})
        }

       const team =  await db.team.create({
                data:{
                    name,
                    creatorId:user.id,
                    membersLifeTimeCount:1,
                    }
                }
        )

        await db.member.create({
            data:{
                teamId:team.id,
                role:MemberRole.Owner,
                userId:user.id

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
        const user = await getCurrentUser()
        if(!user){
            return new NextResponse("Unauthorized", {status:401})
        }

        const teams = await db.team.findMany({
            where: {
                OR: [
                    { creatorId: user.id },
                    { members: { some: { userId: user.id } } }
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

export async function DELETE(req:Request, {params}:{
    params: Promise<{ teamId: string }>} ){
    try {
        const {teamId} = await params
        const user = await getCurrentUser()
        if(!user){
            return new NextResponse("Unauthorized", {status:401})
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

        if(team.creatorId !== user.id){
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