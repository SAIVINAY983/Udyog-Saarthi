import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, CheckCircle, ArrowLeft, BookOpen } from 'lucide-react';
import api from '../api';

export default function TrainingCourse({ highContrast, simpleMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Mock course data
  const course = {
    id: id,
    title: "Basic Computer Skills for the Workplace",
    description: "Learn the fundamentals of operating a computer, using email, and basic data entry.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    content: "In this module, you will learn how to turn on a computer, use a mouse, navigate the desktop, and open basic applications like Notepad and Web Browsers. We will also cover typing basics which are essential for any data entry role."
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Create progress record (started)
      await api.post('/progress', { training_module_id: id });
      // In a real app we'd have a separate endpoint to mark it complete, 
      // but our controller logic currently increments readiness on every POST.
      // So hitting it again simulates completion.
      await api.post('/progress', { training_module_id: id });
      
      setCompleted(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Failed to update progress', err);
      alert('Error updating progress.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 animate-fade-in">
      <button 
        onClick={() => navigate('/dashboard')}
        className={`flex items-center gap-2 font-bold opacity-60 hover:opacity-100 transition-all ${highContrast ? 'text-yellow-300' : 'text-gray-600'}`}
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className={`p-10 rounded-[3rem] shadow-2xl ${highContrast ? 'border-2 border-yellow-300 bg-black' : 'bg-white border border-gray-100'}`}>
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-4 rounded-2xl ${highContrast ? 'bg-yellow-300 text-black' : 'bg-green-50 text-[#128807]'}`}>
            <BookOpen size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tight">{course.title}</h1>
        </div>
        
        <p className="text-xl opacity-70 font-medium mb-10 italic">
          {course.description}
        </p>

        <div className="aspect-video bg-black rounded-[2rem] overflow-hidden mb-10 shadow-inner relative">
          <video 
            src={course.videoUrl} 
            controls 
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80"
          ></video>
        </div>

        <div className="space-y-6 mb-12">
          <h2 className="text-2xl font-black">Module Content</h2>
          <p className="text-lg leading-relaxed opacity-80">{course.content}</p>
        </div>

        <div className="border-t-2 border-gray-100 pt-10 flex justify-end">
          {completed ? (
            <div className="flex items-center gap-3 px-8 py-4 bg-green-50 text-[#128807] rounded-2xl font-black text-xl">
              <CheckCircle size={28} /> Module Completed!
            </div>
          ) : (
            <button 
              onClick={handleComplete}
              disabled={loading}
              className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black text-xl shadow-2xl transition transform hover:scale-105 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#128807] text-white shadow-green-200'}`}
            >
              {loading ? 'Saving...' : 'Mark as Complete'} <CheckCircle size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
