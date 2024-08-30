
import { connectToDB } from '@/libs/mongoDB'; 
import User from "@/app/models/UserSchema";
import { NextResponse } from 'next/server';
// Assuming you have a helper function
export const POST = async (req,res)=>{
  const {code,quiz}= await req.json()
   console.log(code,quiz)
 
//   console.log(score)


  const userData = await User.findOne({code})
//   console.log("your Data is ",typeof(userData.score))

  const {quizzes:previousQuizzes} = userData
//   console.log("your type is ",typeof(previousTrials))
 
  // const updatedScore = Number(score) + Number(userData.score)
  // const updatedTrials = [...previousTrials,score]

  const quizFound = previousQuizzes.find(quiz => quiz.id === quiz.id)
 

  const updatedQuizzes =  [...previousQuizzes, quiz];
//   console.log("yourUpdatedTrials is ",updatedTrials)

  // const totalPoints = updatedTrials.reduce((acc,curr)=>acc+curr ,0)
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
      await User.findOneAndUpdate({ code }, {  quizzes: updatedQuizzes } ,{ new: true })
      return NextResponse.json({message : "Score has been updated"})
  } catch (error) {
      return NextResponse.json({message : error})
  }
  }

  // export const PUT = async (userId, quiz) => {
  //   try {
  //     const user = await User.findById(userId);
  
  //     if (!user) {
  //       throw new Error("User not found");
  //     }
  
  //     // Check if the quizId already exists in the quizzes array
  //     const quizIndex = user.quizzes.findIndex((quiz) => quiz.id === quiz.id);
  
  //     // If the quiz doesn't exist, add it to the array
  //     if (quizIndex === -1) {
  //       user.quizzes.push({ quiz });
  //       await user.save();
  //       return "Quiz added successfully";
  //     } else {
  //       return "Quiz already exists";
  //     }
  //   } catch (error) {
  //     console.error("Error updating user quizzes:", error);
  //     throw error;
  //   }
  // }