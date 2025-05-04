"use client";
import { useState, useEffect } from 'react';
import { Sun, Moon, MessageSquare, Trophy, CheckCircle, Plus, X, Heart, ChevronDown, ChevronUp, AlertCircle, Bell, Settings, LogOut, Calendar, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


type Comment = {
  id: string;
  user: string;
  text: string;
  likes: number;
  time: string;
};

type Milestone = {
  id: string;
  title: string;
  completed: boolean;
};

type Goal = {
  id: string;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  owner: string;
  team: string;
  comments: Comment[];
  milestones: Milestone[];
  color: string;
  priority: 'high' | 'medium' | 'low';
  
};

// Generate unique IDs
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Demo data
const initialGoals: Goal[] = [
  {
    id: generateId(),
    title: "Launch New Website",
    description: "Complete redesign and launch of company website",
    progress: 65,
    dueDate: "2025-06-15",
    owner: "Alex Chen",
    team: "Marketing",
    comments: [
      { id: generateId(), user: "Taylor Kim", text: "Homepage looks great! Can we add more product images?", likes: 3, time: "2 days ago" },
      { id: generateId(), user: "Jordan Lee", text: "SEO optimization complete - all meta tags are in place.", likes: 1, time: "1 day ago" }
    ],
    milestones: [
      { id: generateId(), title: "Wireframes Complete", completed: true },
      { id: generateId(), title: "Design Approval", completed: true },
      { id: generateId(), title: "Content Upload", completed: true },
      { id: generateId(), title: "Testing Phase", completed: false },
      { id: generateId(), title: "Launch", completed: false }
    ],
    color: "from-purple-500 to-indigo-600",
    priority: 'high'
  },
  {
    id: generateId(),
    title: "Q2 Sales Targets",
    description: "Reach $1.2M in new business for Q2",
    progress: 42,
    dueDate: "2025-06-30",
    owner: "Sam Rodriguez",
    team: "Sales",
    comments: [
      { id: generateId(), user: "Morgan Smith", text: "West region is outperforming projections by 12%", likes: 5, time: "3 days ago" }
    ],
    milestones: [
      { id: generateId(), title: "$300K", completed: true },
      { id: generateId(), title: "$600K", completed: true },
      { id: generateId(), title: "$900K", completed: false },
      { id: generateId(), title: "$1.2M", completed: false }
    ],
    color: "from-emerald-500 to-teal-600",
    priority: 'medium'
  },
  {
    id: generateId(),
    title: "Mobile App Development",
    description: "Build and launch v1 of customer mobile app",
    progress: 20,
    dueDate: "2025-08-30",
    owner: "Jesse Park",
    team: "Product",
    comments: [
      { id: generateId(), user: "Robin Cho", text: "API integration is taking longer than expected. We might need another sprint.", likes: 0, time: "1 day ago" }
    ],
    milestones: [
      { id: generateId(), title: "Requirements Gathered", completed: true },
      { id: generateId(), title: "Design Phase", completed: true },
      { id: generateId(), title: "Frontend Development", completed: false },
      { id: generateId(), title: "Backend Integration", completed: false },
      { id: generateId(), title: "Testing", completed: false },
      { id: generateId(), title: "App Store Submission", completed: false }
    ],
    color: "from-rose-500 to-pink-600",
    priority: 'high'
  }
];

export default function GoalTracker() {
  const [darkMode, setDarkMode] = useState(false);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [newComment, setNewComment] = useState('');
  const [activeCommentGoalId, setActiveCommentGoalId] = useState<string | null>(null);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('goals');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    dueDate: '',
    team: '',
    owner: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  // Toggle dark mode with animation
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Toggle milestone completion
  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(milestone => {
          if (milestone.id === milestoneId) {
            return { ...milestone, completed: !milestone.completed };
          }
          return milestone;
        });
        
        // Calculate new progress based on completed milestones
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);
        
        return {
          ...goal,
          milestones: updatedMilestones,
          progress: newProgress
        };
      }
      return goal;
    }));
  };

  // Add a new comment
  const addComment = (goalId: string) => {
    if (!newComment.trim()) return;
    
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          comments: [
            ...goal.comments,
            {
              id: generateId(),
              user: "You",
              text: newComment,
              likes: 0,
              time: "Just now"
            }
          ]
        };
      }
      return goal;
    }));
    
    setNewComment('');
    setActiveCommentGoalId(null);
  };

  // Like a comment
  const likeComment = (goalId: string, commentId: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          comments: goal.comments.map(comment => {
            if (comment.id === commentId) {
              return { ...comment, likes: comment.likes + 1 };
            }
            return comment;
          })
        };
      }
      return goal;
    }));
  };

  // Add a new goal
  const handleAddGoal = () => {
    if (!newGoal.title.trim()) return;
    
    const colorOptions = [
      "from-purple-500 to-indigo-600",
      "from-emerald-500 to-teal-600",
      "from-rose-500 to-pink-600",
      "from-amber-500 to-orange-600",
      "from-blue-500 to-cyan-600"
    ];
    
    const newGoalObject = {
      id: generateId(),
      title: newGoal.title,
      description: newGoal.description || "No description provided",
      progress: 0,
      dueDate: newGoal.dueDate || "Not set",
      owner: newGoal.owner || "Unassigned",
      team: newGoal.team || "No team",
      comments: [],
      milestones: [],
      color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
      priority: newGoal.priority
    };
    
    setGoals([...goals, newGoalObject]);
    setNewGoal({
      title: '',
      description: '',
      dueDate: '',
      team: '',
      owner: '',
      priority: 'medium'
    });
    setShowAddGoal(false);
  };

  // Toggle goal expansion
  const toggleGoalExpansion = (goalId: string) => {
    setExpandedGoalId(expandedGoalId === goalId ? null : goalId);
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority: string) => {
    switch(priority) {
      case 'high':
        return darkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800';
      case 'medium':
        return darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
      case 'low':
        return darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800';
      default:
        return darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800';
    }
  };

  // Mock notifications
  const notifications = [
    { id: 1, message: "Website project milestone due tomorrow", time: "1 hour ago" },
    { id: 2, message: "Sam Rodriguez commented on Q2 Sales", time: "3 hours ago" },
    { id: 3, message: "New goal created: Customer Satisfaction Survey", time: "Yesterday" },
  ];

  // Side navigation items
  const navItems = [
    { icon: <Trophy className="w-5 h-5" />, label: "Goals", active: activeView == 'goals' },
    { icon: <Calendar className="w-5 h-5" />, label: "Calendar", active: activeView == 'calendar' },
    { icon: <Users className="w-5 h-5" />, label: "Teams", active: false },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", active: false },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`py-3 px-6 flex justify-between items-center ${darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white shadow-lg`}>
        <div className="flex items-center">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: 0 }}
          >
            <Trophy className="w-8 h-8 text-yellow-300 mr-3" />
          </motion.div>
          <h1 className="text-2xl font-bold">GoalSync</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 relative"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                3
              </span>
            </motion.button>
            
            {notificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute right-0 w-72 mt-2 py-2 rounded-lg shadow-lg z-50 ${darkMode ? 'bg-gray-800' : 'bg-white text-gray-800'}`}
              >
                <h4 className="px-4 py-2 text-sm font-semibold border-b border-gray-200 dark:border-gray-700">
                  Notifications
                </h4>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`px-4 py-3 hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b border-gray-200 dark:border-gray-700`}
                    >
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs opacity-70 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full hover:bg-white hover:bg-opacity-20`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
          
          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">
            AN
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex min-h-[calc(100vh-128px)]">
        {/* Sidebar */}
        <motion.div 
          initial={{ width: "240px" }}
          animate={{ width: sidebarOpen ? "240px" : "64px" }}
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 overflow-hidden`}
        >
          <div className="p-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className={`flex items-center justify-center w-full p-2 rounded-lg mb-6 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {sidebarOpen ? (
                <span className="flex items-center"><ChevronUp className="w-5 h-5 mr-2" /> Collapse</span>
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            
            <nav>
              <ul className="space-y-1">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <motion.a
                      whileHover={{ x: 5 }}
                      href="#"
                      className={`flex items-center p-3 rounded-lg ${item.active 
                        ? `bg-gradient-to-r from-purple-500 to-indigo-600 text-white` 
                        : `${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}`}
                    >
                      {item.icon}
                      {sidebarOpen && <span className="ml-3">{item.label}</span>}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>
            
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`mt-auto pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-8`}
              >
                <button className={`flex items-center p-3 rounded-lg w-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <LogOut className="w-5 h-5" />
                  <span className="ml-3">Logout</span>
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <main className="flex-grow px-6 py-8">
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Team Goals Dashboard</h2>
              <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Track, manage, and collaborate on team objectives
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddGoal(true)}
              className="flex items-center px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Goal
            </motion.button>
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {goals.map(goal => (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800 hover:shadow-indigo-500/20' : 'bg-white hover:shadow-indigo-500/40'} hover:shadow-xl transition-shadow duration-300`}
                >
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${goal.color} p-4 text-white relative`}>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold">{goal.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadgeColor(goal.priority)}`}>
                        {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                      </span>
                    </div>
                    <p className="opacity-80 text-sm mt-2">{goal.description}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="p-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{goal.progress}% Complete</span>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-sm">{goal.dueDate}</span>
                      </div>
                    </div>
                    <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-3 rounded-full bg-gradient-to-r ${goal.color}`}
                      />
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="px-4 pb-2 flex justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white text-xs font-semibold mr-2">
                        {goal.owner.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{goal.owner}</span>
                    </div>
                    <span className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-2 py-1 rounded-full text-xs`}>
                      {goal.team}
                    </span>
                  </div>

                  {/* Toggle Button */}
                  <motion.button 
                    whileHover={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                    onClick={() => toggleGoalExpansion(goal.id)}
                    className={`w-full flex items-center justify-center py-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                  >
                    {expandedGoalId === goal.id ? 
                      <ChevronUp className="w-5 h-5" /> : 
                      <ChevronDown className="w-5 h-5" />
                    }
                  </motion.button>

                  {/* Expanded Content */}
                  {expandedGoalId === goal.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 pb-4"
                    >
                      {/* Milestones */}
                      <div className="mb-6">
                        <h4 className="font-bold mb-3">Milestones</h4>
                        <div className="space-y-3">
                          {goal.milestones.map(milestone => (
                            <motion.div 
                              key={milestone.id}
                              whileHover={{ x: 5 }}
                              className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                              <button 
                                onClick={() => toggleMilestone(goal.id, milestone.id)}
                                className="focus:outline-none"
                              >
                                <motion.div
                                  animate={milestone.completed ? { scale: [1, 1.2, 1] } : {}}
                                  transition={{ duration: 0.3 }}
                                >
                                  <CheckCircle 
                                    className={`w-5 h-5 mr-3 ${milestone.completed ? 
                                      `text-${goal.color.split('-')[1]}-500` : 
                                      darkMode ? 'text-gray-600' : 'text-gray-400'}`} 
                                    fill={milestone.completed ? "currentColor" : "none"} 
                                  />
                                </motion.div>
                              </button>
                              <span className={milestone.completed ? "line-through opacity-70" : ""}>
                                {milestone.title}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Comments */}
                      <div>
                        <h4 className="font-bold mb-3">Discussion</h4>
                        <div className="space-y-3 mb-4">
                          {goal.comments.map(comment => (
                            <motion.div 
                              key={comment.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                            >
                              <div className="flex justify-between mb-1">
                                <div className="flex items-center">
                                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold mr-2">
                                    {comment.user.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <span className="font-medium">{comment.user}</span>
                                </div>
                                <span className="text-xs opacity-70">{comment.time}</span>
                              </div>
                              <p className="text-sm mb-2 ml-7">{comment.text}</p>
                              <button 
                                onClick={() => likeComment(goal.id, comment.id)}
                                className="flex items-center text-xs opacity-70 hover:opacity-100 ml-7"
                              >
                                <Heart className="w-3 h-3 mr-1" fill={comment.likes > 0 ? "currentColor" : "none"} />
                                {comment.likes > 0 && comment.likes}
                              </button>
                            </motion.div>
                          ))}
                        </div>

                        {/* Add Comment */}
                        {activeCommentGoalId === goal.id ? (
                          <div className="mt-3">
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className={`w-full p-3 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:ring-2 focus:ring-${goal.color.split('-')[1]}-500 focus:outline-none`}
                              placeholder="Write a comment..."
                              rows={2}
                            />
                            <div className="flex justify-end mt-2 space-x-2">
                              <button
                                onClick={() => setActiveCommentGoalId(null)}
                                className={`px-3 py-1 text-sm rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                              >
                                Cancel
                              </button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => addComment(goal.id)}
                                className={`px-4 py-1 text-sm rounded text-white bg-gradient-to-r ${goal.color}`}
                              >
                                Post
                              </motion.button>
                            </div>
                          </div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setActiveCommentGoalId(goal.id)}
                            className={`flex items-center text-sm p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} w-full justify-center`}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Add Comment
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className={`py-4 px-6 ${darkMode ? 'bg-gradient-to-r from-violet-900 to-purple-900' : 'bg-gradient-to-r from-violet-600 to-purple-600'} text-white shadow-inner`}>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Trophy className="w-5 h-5 mr-2 text-yellow-300" />
            <span>GoalSync © 2025</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-purple-200 transition-colors">Help</a>
            <a href="#" className="hover:text-purple-200 transition-colors">Privacy</a>
            <a href="#" className="hover:text-purple-200 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-md rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Add New Goal</h3>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddGoal(false)}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    className={`w-full p-3 rounded-lg text-gray-900 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:outline-none`}
                    placeholder="Goal title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    className={`w-full p-3 rounded-lg text-gray-900 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:outline-none`}
                    placeholder="Describe your goal"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <div className="flex space-x-4 mt-2">
                    {['low', 'medium', 'high'].map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setNewGoal({...newGoal, priority: priority as 'high' | 'medium' | 'low'})}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          newGoal.priority === priority
                            ? priority === 'high'
                              ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                              : priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                              : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                            : darkMode
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newGoal.dueDate}
                      onChange={(e) => setNewGoal({...newGoal, dueDate: e.target.value})}
                      className={`w-full p-3 rounded-lg text-gray-900 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:outline-none`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Team</label>
                    <input
                      type="text"
                      value={newGoal.team}
                      onChange={(e) => setNewGoal({...newGoal, team: e.target.value})}
                      className={`w-full p-3 rounded-lg text-gray-900 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:outline-none`}
                      placeholder="Team name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Owner</label>
                  <input
                    type="text"
                    value={newGoal.owner}
                    onChange={(e) => setNewGoal({...newGoal, owner: e.target.value})}
                    className={`w-full p-3 rounded-lg text-gray-900 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:outline-none`}
                    placeholder="Goal owner"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddGoal}
                    className="px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-lg font-medium"
                  >
                    Create Goal
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* No data overlay - shown when there are no goals */}
      {goals.length === 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-8 rounded-xl shadow-xl max-w-md text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
            >
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-indigo-500" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">No Goals Yet</h3>
            <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Create your first goal to start tracking progress with your team
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddGoal(true)}
              className="px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2 inline-block" />
              Create First Goal
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
}