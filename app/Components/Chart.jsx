"use client"
import React, { PureComponent, useEffect, useState } from 'react';
import { LineChart,ComposedChart,Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer ,AreaChart, Area} from 'recharts';
const Chart = ({code}) => {
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
    const currentStudent = students?.find(student => student.code == code)
   console.log(currentStudent)
   const trials=currentStudent?.trials.filter((trial,index)=> trial.index <=6)
 console.log(trials)
 const data = currentStudent?.trials.slice(-5).map((trial, index) => {
    return { name: `Trial ${index + 1}`, Points: trial ,Max:100};
  });
    // console.log(data1)
    // const data = [
    //     {
    //       name: 'Page A',
    //       uv: 4000,
    //       pv: 2400,
    //       amt: 2400,
    //     },
    //     {
    //       name: 'Page B',
    //       uv: 3000,
    //       pv: 1398,
    //       amt: 2210,
    //     },
    //     {
    //       name: 'Page C',
    //       uv: 2000,
    //       pv: 9800,
    //       amt: 2290,
    //     },
    //     {
    //       name: 'Page D',
    //       uv: 2780,
    //       pv: 3908,
    //       amt: 2000,
    //     },
    //     {
    //       name: 'Page E',
    //       uv: 1890,
    //       pv: 4800,
    //       amt: 2181,
    //     },
    //     {
    //       name: 'Page F',
    //       uv: 2390,
    //       pv: 3800,
    //       amt: 2500,
    //     },
    //     {
    //       name: 'Page G',
    //       uv: 3490,
    //       pv: 4300,
    //       amt: 2100,
    //     },
    //   ];
      
    
      
      
  return (
    <div className=' w-full h-full flex justify-center items-center'>


<ResponsiveContainer  height="100%">
        <LineChart
          width={550}
          height={400}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Points" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="Max" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={550}
          height={400}
          data={data}
          margin={{
            top: 5,
            right: 20,
            bottom: 5,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" scale="band" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Points" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="Max" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>


    </div>
  

  )
}

export default Chart
