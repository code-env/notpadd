import SuperImage from "@/components/modal/image"
import { auth } from "@clerk/nextjs/server"
import { db } from "@workspace/db"
import { buttonVariants } from "@workspace/ui/components/button"
import { Users } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Teams",
  description: "All the teams you are a member of",
}

const Teams = async () => {
  const { userId } = await auth()

  if (!userId) return

  const teams = await db.team.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: true,
    },
  })

  if (teams.length === 0) return redirect("/new")

  return (
    <div className="min-h-screen flex justify-center py-10 w-full">
      <div className="max-w-lg w-full h-fit flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold text-center">Teams</h1>
        <div className="flex flex-col divide-y border">
          {teams.map(team => (
            <div key={team.id} className="flex justify-between items-center p-4">
              <div className="flex items-center gap-2">
                {team.imageUrl ? (
                  <SuperImage
                    src={team.imageUrl}
                    alt={team.name}
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                <div>
                  <h2 className="font-bold">{team.name}</h2>
                  <p className="text-sm text-gray-500">{team.members.length} members</p>
                </div>
              </div>
              <Link className={buttonVariants({ variant: "secondary" })} href={`/t/${team.id}`}>
                View
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Teams
