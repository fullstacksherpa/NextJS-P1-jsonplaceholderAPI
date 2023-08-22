import getUser from "@/lib/getUser"
import getUserPosts from "@/lib/getUserPosts"
import getAllUsers from "@/lib/getAllUsers"
import { Suspense } from "react"
import UserPosts from "./components/UserPosts"
import type { Metadata } from 'next'

import { notFound} from 'next/navigation'


type Params = {
    params: {
        userId: string
    }
}

export async function generateMetadata({ params: { userId } }: Params): Promise<Metadata> {
    const userData: Promise<User> = getUser(userId)
    const user: User = await userData

    if (!user.name){
        return {
            title: 'user Not Found'
        }
    }

    return {
        title: user.name,
        description: `This is the page of ${user.name}`
    }

}

export default async function UserPage({ params: { userId } }: Params) {
    const userData: Promise<User> = getUser(userId)
    const userPostsData: Promise<Post[]> = getUserPosts(userId)

    // If not progressively rendering with Suspense, use Promise.all
    //const [user, userPosts] = await Promise.all([userData, userPostsData])

    const user = await userData

    if(!user.name)  notFound()

    return (
        <>
            <h2>{user.name}</h2>
            <br />
            <Suspense fallback={<h2>Loading...</h2>}>
                {/* @ts-expect-error Server Component */}
                <UserPosts promise={userPostsData} />
            </Suspense>
        </>
    )
}


// generating static path for nextjs static site generation. fetching all the user data and transforming the data into an array of object containing userID properties.


export async function generateStaticParams(){
    //it called the getAllUsers() function. userData variable is declared as a promise that should eventually resolve to an array of User object.
    const userData: Promise<User[]> = getAllUsers()
    const users = await userData

    return users.map(user =>({
        userId: user.id.toString()
      
    }))
   
}

// the purpose of this code is likely to generate an array of object with unique userId properites, which can then be used as dynamic parameters when generating static pages in a nextjs application.
