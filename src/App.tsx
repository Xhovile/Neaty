import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, FileEdit, FileText, LogOut, GraduationCap, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Student, Mark, User, Page } from './types';
import { DEMO_STUDENTS, DEMO_MARKS } from './constants';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import MarksEntry from './components/MarksEntry';
import ReportCard from './components/ReportCard';
import AIChatbot from './components/AIChatbot';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [students, setStudents] = useState<Student[]>(DEMO_STUDENTS);
  const [marks, setMarks] = useState<Mark[]>(DEMO_MARKS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    const savedStudents = localStorage.getItem('edureport_students');
    const savedMarks = localStorage.getItem('edureport_marks');
    const savedUser = localStorage.getItem('edureport_user');

    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedMarks) setMarks(JSON.parse(savedMarks));
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('edureport_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('edureport_marks', JSON.stringify(marks));
  }, [marks]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('edureport_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('edureport_user');
    }
  }, [user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('Dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('Login');
  };

  const addStudent = (newStudent: Omit<Student, 'id'>) => {
    const student: Student = {
      ...newStudent,
      id: Math.random().toString(36).substr(2, 9),
    };
    setStudents([...students, student]);
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    setMarks(marks.filter(m => m.studentId !== id));
  };

  const saveMarks = (newMark: Omit<Mark, 'id'>) => {
    const mark: Mark = {
      ...newMark,
      id: Math.random().toString(36).substr(2, 9),
    };
    // Update existing or add new
    const existingIdx = marks.findIndex(m => m.studentId === mark.studentId && m.subjectId === mark.subjectId);
    if (existingIdx > -1) {
      const updatedMarks = [...marks];
      updatedMarks[existingIdx] = mark;
      setMarks(updatedMarks);
    } else {
      setMarks([...marks, mark]);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Students', label: 'Students', icon: Users },
    { id: 'MarksEntry', label: 'Marks Entry', icon: FileEdit },
    { id: 'ReportCards', label: 'Report Cards', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-100 transition-all duration-300 shadow-2xl ${isSidebarOpen ? 'w-72' : 'w-20'}`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 flex items-center gap-4 border-b border-gray-50">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100 shrink-0">
              <GraduationCap size={24} />
            </div>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-black text-xl tracking-tight text-blue-600"
              >
                EduReport
              </motion.span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 mt-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as Page)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${currentPage === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-gray-400 hover:bg-gray-50 hover:text-blue-600'}`}
              >
                <item.icon size={20} className={`${currentPage === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                {isSidebarOpen && <span className="font-bold text-sm">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-gray-50">
            <div className={`flex items-center gap-3 p-3 rounded-2xl bg-gray-50 mb-4 ${!isSidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-black shrink-0">
                {user.username.charAt(0).toUpperCase()}
              </div>
              {isSidebarOpen && (
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-gray-800 truncate">{user.username}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.role}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all group ${!isSidebarOpen && 'justify-center'}`}
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              {isSidebarOpen && <span className="font-bold text-sm">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 md:px-8 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">School System</p>
              <p className="text-sm font-bold text-gray-800">EduReport Pro v1.0</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentPage === 'Dashboard' && <Dashboard students={students} marks={marks} />}
              {currentPage === 'Students' && <Students students={students} onAddStudent={addStudent} onDeleteStudent={deleteStudent} />}
              {currentPage === 'MarksEntry' && <MarksEntry students={students} onSaveMarks={saveMarks} />}
              {currentPage === 'ReportCards' && <ReportCard students={students} marks={marks} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* AI Assistant */}
      <AIChatbot />
    </div>
  );
}
