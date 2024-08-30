import React, { PureComponent, useEffect, useState } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';



const PieCharts = ({code}) => {
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
  return { name: `Trial ${index + 1}`, value:trial};
});
// console.log(data1)
    // const data = [
    //     { name: 'Group A', value: 400 },
    //     { name: 'Group B', value: 300 },
    //     { name: 'Group C', value: 300 },
    //     { name: 'Group D', value: 200 },
    //   ];
      
      const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
      
      const RADIAN = Math.PI / 180;
      const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        return (
          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
      };
  return (
    <div className='w-full h-full'> 
 
    <ResponsiveContainer width="100%" height="100%">
    <PieChart width={800} height={800} className='' >
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
       
      >
        {data?.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  </ResponsiveContainer></div>
   
  )
}

export default PieCharts
