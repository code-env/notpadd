import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";



export async function PUT(req:Request, {params}:{params:{projectId:string, userId:string}}){
    try {
        const {projectId, userId} = params
        const {title, description} = await req.json()

        if(!projectId) return new NextResponse("Project not found", {status:400})
        
        const UpdateProject = await db.project.update({
            where:{
                id:projectId,
                userId:userId
            },
           data:{
            title:title,
            description:description,

           } 
        })

        if(!UpdateProject) return new NextResponse("Something happened while updating projce", {status:403})
        return new NextResponse("Project update sucessfully", {status:200})

    } catch (error:any) {

        console.error(error.message)
        return new NextResponse("Internal server error", {status:500})
        
    }
}

export async function DELETE(req:Request, {params}:{params:{projectId:string, userId: string}}){
    try {
        const {projectId, userId} = params

        if(!projectId) return new NextRequest("project id required")

        const deleteproject = await db.project.delete({
            where:{
                id:projectId,
                userId:userId
            }
        })

        if(!deleteproject) return new NextResponse("An error occured while deleting project", {status:400} )

       return new NextResponse("Project Deleted Successfully", {status:200}) 
        
        
    } catch (error:any) {

        console.error(error.message)
        return new NextResponse("Internal Server Error", {status:500})
        
    }

}
