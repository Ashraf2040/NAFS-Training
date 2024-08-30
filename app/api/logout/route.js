

import { NextRequest, NextResponse } from "next/server";




export const GET= async()=>{

    try {

        const response =  NextResponse.json({
            message:"Log out successful",
            success:true
        })
         
        response.cookies.set("token","",{
            httpOnly:true,expires:new Date(0)
        })
        return response
    } catch (error) {
        return NextResponse.json({error : error.message},{status:500})
    }
}