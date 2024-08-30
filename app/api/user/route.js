
import { connectToDB } from '@/libs/mongoDB'; 
import User from "@/app/models/UserSchema";
import { NextResponse } from 'next/server';
// Assuming you have a helper function
export const POST = async (req,res)=>{
  const {code,score}= await req.json()
  // console.log(code,score)
 
//   console.log(score)


  const userData = await User.findOne({code})
//   console.log("your Data is ",typeof(userData.score))

  const {trials :previousTrials} = userData
//   console.log("your type is ",typeof(previousTrials))
 
  const updatedScore = Number(score) + Number(userData.score)
  const updatedTrials = [...previousTrials,score]
//   console.log("yourUpdatedTrials is ",updatedTrials)

  const totalPoints = updatedTrials.reduce((acc,curr)=>acc+curr ,0)
  //  const filter = {_id : ids}
   
  
  //  const user = await User.findOne ({score}) 
  //   const deposits = user.deposits
  //   for(let i=0 ; i<deposits.length;i++){
  //       deposits[i] = parseInt(deposits[i])
  //   }
  // const credit = user.credit
  //     const totalDepositsArray = [...deposits,amountDeposited]
  //     const totalCredit = totalDepositsArray.reduce((acc,curr)=>acc+curr ,0)
  //    const update = {deposits : totalDepositsArray,
  //    credit :totalCredit
     
  //    }
  //    console.log(credit)
  //    console.log(deposits)
    
   
  try {
      await connectToDB()
      await User.findOneAndUpdate({ code }, { score: totalPoints, trials: updatedTrials } ,{ new: true })
      return NextResponse.json({message : "Score has been updated"})
  } catch (error) {
      return NextResponse.json({message : error})
  }
  }