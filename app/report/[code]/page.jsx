
"use client"

import Chart from '@/app/Components/Chart'
// import PieChart from '@/app/Components/Pie'
import PieCharts from '@/app/Components/PieCharts'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

const ReportPage = ({params}) => {
 const [students, setStudents] = useState([])
    useEffect(() => {
      const getStudentInfo = async () => {
        try {
          const response = await fetch("/api/user/getUsers", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const data = await response.json()
         setStudents(data)
        
        } catch (error) {
          console.log(error)
      }
      }
      getStudentInfo()
    }, [])
    console.log(students)
   const currentStudent = students?.find(student => student.code == params.code)
   console.log(currentStudent)
   const score = currentStudent?.score
   const trials = currentStudent?.trials
   const myCode = currentStudent?.code



   const reportRef = useRef(null)

   const handlePrint = () => {
    // Capture the current page content
    const originalContent = document.body.innerHTML;

    // Hide all content except the certificate element
    const reportElement = reportRef.current;
    document.body.innerHTML = reportElement.outerHTML;

    // Trigger browser's print dialog
    window.print();

    // Restore original content
    document.body.innerHTML = originalContent;
  };
  return (
    
    <div className='mx-auto relative mt-16 bg-white   max-w-[1300px] gap-4 px-6 pt-12  h-full flex flex-col justify-center  ' ref={reportRef}>
      {/* <button className='absolute top-5 right-5 font-bold text-theme'>Print</button> */}
      <Image src="/hero-img.svg" alt="progression" width={100} height={100} className='absolute top-10 left-10 ' />
      <h1 className='text-3xl text-theme font-bold underline w-full text-center'>Progression Monitoring Report</h1>
      <Image src="/print.svg" alt="progression" width={35} height={30} className='absolute top-10 right-10 cursor-pointer exclude-from-print'onClick={handlePrint} />
     <div className='grid grid-cols-5 w-full items-center   gap-3 px-3 h-[400px] '> 
      <div className=' text-xl   flex  flex-col gap-3 col-span-3  text-theme font-bold   '>


<div className='w-full grid  grid-cols-3'><h2 className='col-span-1'>Student Name :</h2> <span className='col-span-2  text-themeYellow'>{currentStudent?.fullName}</span></div>
<div className='w-full grid grid-cols-3'><h2 className='col-span-1'>Student Code :</h2> <span className='col-span-2 text-themeYellow'>{params.code}</span></div>
<div className='w-full grid grid-cols-3'><h2 className='col-span-1'>Grade :</h2> <span className='col-span-2 text-themeYellow'>6 A</span></div>
<div className='w-full grid grid-cols-3'><h2 className='col-span-1'>Test Attemps :</h2> <span className='col-span-2 text-themeYellow'>{trials?.length}</span></div>
<div className='w-full grid grid-cols-3'><h2 className='col-span-1'>Total Points :</h2> <span className='col-span-2 text-themeYellow'>{score}</span></div>
<div className='w-full grid grid-cols-3'><h2 className='col-span-1'>Percentage :</h2> <span className='col-span-2 text-themeYellow'>{Math.ceil(score/trials?.length)}%</span></div>

</div>
<div className=' col-span-2 h-[450px] '>
  <PieCharts  code={myCode}/></div>
</div>
      <div className='h-[600px] w-full  '>
            <Chart code={myCode} />
        </div>
    </div>
  )
} 

export default ReportPage
