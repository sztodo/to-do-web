import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import taskService from '../services/taskService';
import { Task } from '../types/interfaces';
import './Calendar.css';

const Calendar: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskService.getAllTasks();
        setTasks(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPreviousMonthDays = (date: Date): number => {
    const firstDay = getFirstDayOfMonth(date);
    return firstDay === 0 ? 0 : firstDay;
  };

  const renderCalendarHeader = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const prevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };
    
    const nextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };
    
    return (
      <div className="calendar-header">
        <button onClick={prevMonth} className="month-nav">◀</button>
        <h2>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
        <button onClick={nextMonth} className="month-nav">▶</button>
      </div>
    );
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  const handleDayClick = (date: Date) => {
    const tasksOnDay = getTasksForDate(date);
    if (tasksOnDay.length === 1) {
      navigate(`/tasks/${tasksOnDay[0].id}`);
    } else if (tasksOnDay.length > 1) {
      // If multiple tasks, navigate to dashboard with filter
      navigate('/dashboard', { state: { date: date.toISOString().split('T')[0] } });
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentMonth);
    const previousMonthDays = getPreviousMonthDays(currentMonth);
    
    // Render days of week header
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Render day names
    const dayNamesElements = dayNames.map(day => (
      <div key={`header-${day}`} className="calendar-day-header">{day}</div>
    ));
    
    // Render previous month placeholder days
    for (let i = 0; i < previousMonthDays; i++) {
      days.push(<div key={`prev-${i}`} className="calendar-day placeholder"></div>);
    }
    
    // Render current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const tasksForDay = getTasksForDate(date);
      const today = new Date();
      
      // Check if the current day is today
      const isToday = isSameDay(date, today);

      // Generate dots for tasks
      const taskDots = tasksForDay.length > 0 ? (
        <div className="task-dots">
          {tasksForDay.map((task, index) => (
            <div 
              key={`${task.id}-${index}`} 
              className={`task-dot ${task.isCompleted ? 'completed' : 'active'}`}
              title={task.title}
            ></div>
          ))}
        </div>
      ) : null;
      
      days.push(
        <div 
          key={`day-${i}`} 
          className={`calendar-day ${isToday ? 'today' : ''}`}
          onClick={() => handleDayClick(date)}
        >
          <div className="day-number">{i}</div>
          {taskDots}
        </div>
      );
    }
    
    return (
      <>
        {dayNamesElements}
        {days}
      </>
    );
  };

  if (loading) {
    return <div className="loading">Loading calendar...</div>;
  }

  return (
    <div className="calendar-container">
      {error && <div className="error-message">{error}</div>}
      
      <h1 className="calendar-title">Task Calendar</h1>
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="dot active-dot"></span> Active Tasks
        </div>
        <div className="legend-item">
          <span className="dot completed-dot"></span> Completed Tasks
        </div>
      </div>
      
      {renderCalendarHeader()}
      <div className="calendar-grid">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;