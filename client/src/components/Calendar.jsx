import React, { useState } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, subMonths, addMonths } from 'date-fns';
import styled from 'styled-components';


function Calendar() {
	const [currentMonth , setCurrentMonth] = useState(new Date());
	const [todos , setTodos] = useState({});
	const [selectedDate , setSelectedDate] = useState(null);
	const [isAddingTodo , setIsAddingTodo] = useState(false);

	const monthStart=startOfMonth(currentMonth);
	const monthEnd=endOfMonth(monthStart);

	const startDate=startOfWeek(monthStart);
	
	const endDate=endOfWeek(monthEnd);

	let dates=[];
	let days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

	dates.push(
        <DaysRow key="days">
            {days.map(day=> <DayBox key={day}>{day}</DayBox>)}
        </DaysRow>
   )

	let dateRows=[];

	let daysToAdd=startDate;

	while (daysToAdd <= endDate) {
		// Check if the day belongs to the current month
		const isCurrentMonth=daysToAdd >= monthStart && daysToAdd <= monthEnd;

		dateRows.push(
			<DateBox
				key={daysToAdd.toString()}
				onClick={() => setSelectedDate(daysToAdd)}
				isActive={isCurrentMonth}
			>
				{format(daysToAdd,"d")}
				{todos[format(daysToAdd,"yyyy-MM-dd")]?.map(todo =>
					todo.completed ? null :
					todo.text + " "
			  )}
		   </DateBox>
	   );

	   // If the row is complete (7 days), push it into 'dates' and create a new row
	   if(dateRows.length === 7){
		   dates.push(
			   <DateRow key={dateRows[0].toString()}>
				   {dateRows}
			   </DateRow>
		   );
		   dateRows = []; // Reset the row
	   }

	   daysToAdd=addDays(daysToAdd ,1);
   }
   
   // Push the last incomplete week into 'dates'
   if(dateRows.length > 0){
       dates.push(
           <DateRow key={dateRows[0].toString()}>
               {dateRows}
           </DateRow>
       );
   }

   const prevMonth=()=>setCurrentMonth(subMonths(currentMonth ,1));
   const nextMonth=()=>setCurrentMonth(addMonths(currentMonth ,1));

   const handleAddTodo=(e)=>{
	   e.preventDefault();
	   const text=e.target.todo.value.trim();
	   if(text){
		   const newTodo={
			   text,
			   completed:false
		   };
		   setTodos(prevTodos=>{
			   return{
				   ...prevTodos,
				   [selectedDate]: [...(prevTodos[selectedDate] || []), newTodo]
			   };
		   });
	   }
	   e.target.reset();
   };

    const handleToggleTodo=(date,index)=>{
        setTodos(prevTodos=>{
            return{
                ...prevTodos,
                [date]: prevTodos[date].map((todo,i)=>{
                    if(i===index){
                        return{
                            ...todo,
                            completed:!todo.completed
                        };
                    }
                    return todo;
                })
            };
        });
    };

	return (
       <CalendarContainer>
           <Header>
               <Button onClick={prevMonth}>Prev</Button>
               <h2>{format(currentMonth,"MMMM yyyy")}</h2> 
               <Button onClick={nextMonth}>Next</Button>
               <Button onClick={() => setIsAddingTodo(!isAddingTodo)}>+</Button>
           </Header>

           {dates}

           {isAddingTodo && (
                <form onSubmit={handleAddTodo}>
                    <input type="text" name="todo" placeholder="Add a todo..." />
                    <button type="submit">Add</button>
                </form>
            )}

           {selectedDate && (
               <DetailContainer>
                   <h3>{format(selectedDate,"MMMM d, yyyy")}</h3>

                   {todos[format(selectedDate,"yyyy-MM-dd")]?.map((todo,index)=>(
                       <div key={index}>
                           <input type="checkbox" checked={todo.completed} onChange={()=>handleToggleTodo(format(selectedDate,"yyyy-MM-dd"),index)} />
                           {todo.text}
                       </div>
                   ))}
               </DetailContainer>    
           )}
       </CalendarContainer>    
 );
};

export default Calendar;

const DetailContainer = styled.div`
	width: 700px;  
	margin-top: 20px; 
	border-radius: 5px; 
	background-color: #f8f9fa;
	padding: 10px;
	box-sizing: border-box;

	& > div {
		margin-bottom :10 px ;

		input[type="checkbox"] {
			margin-right :10 px 
		}
	}
`;
const CalendarContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Header = styled.div`
    display: flex;
    width: 840px;
    justify-content: space-between;
`;

const Button = styled.button`
    background-color: #f8f9fa;
    border-radius: 5px; 
`;

const DateRow = styled.div`
	display:flex; 
	width : 840px; 
	justify-content : space-between; 
`;

const DateBox = styled.div`
	width: 120px;
	height: 120px;
	border: 1px solid black;
	display: flex;
	justify-content: flex-start; 
	align-items: flex-start; 
	padding-left: 10px; 
	padding-top: 10px; 

	font-size : large ;

	background-color:${props => props.isActive ? "#f8f9fa" : "#e9ecef"};
	color:${props => props.isActive ? "black" : "#ced4da"};
	cursor:${props => props.isActive ? "pointer" : "default"};

	position:relative ;
`;

const DaysRow=styled(DateRow)`
	height :30px ;
`;

const DayBox=styled.div`
	width: 120px;
	height :30px !important; 
	border: 1px solid black;
	display: flex;
	justify-content: flex-start; 
	align-items: flex-start; 
	padding-left: 45px; 
	padding-top: 6px;

	font-size : large ;
	font-weight:bold ;

	background-color:#f8f9fa;
	color:black;
	cursor:pointer;

	position:relative ;
`;