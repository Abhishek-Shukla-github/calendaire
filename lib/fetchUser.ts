import { clerkClient, currentUser } from "@clerk/nextjs/server";
import {db} from "./prisma";

export const FetchUser = async () => {
    const user = await currentUser();
    
    if(!user) return null;

    try{
        const loggedInUser = await db?.user.findUnique({
            where:{
                clerkUserId: user.id
            }
        });

        if(loggedInUser) return loggedInUser
        else{
            const name = `${user.firstName} ${user.lastName}`
            //create and save an inital username
            await clerkClient().users.updateUser(user.id, {
                username: name.split(" ").join("-") + user.id.slice(-4)
            })

            const newUser = await db.user.create({
                data: {
                    clerkUserId: user.id,
                    name,
                    imageUrl: user.imageUrl,
                    email: user.emailAddresses[0].emailAddress,
                    username: name.split(" ").join("-") + user.id.slice(-4)
                }
            })
            return newUser;
        }
    }
    catch(err){
        console.log(err)
    }
}