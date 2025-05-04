"use client";
import { useState, useEffect } from 'react';
import { Sun, Moon, MessageSquare, Trophy, CheckCircle, Plus, X, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Comment = {
  id: number;
  user: string;
  text: string;
  likes: number;
  time: string;
};

type Milestone = {
  id: number;
  title: string;
  completed: boolean;
};

type Goal = {
  id: number;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  owner: string;
  team: string;
  comments: Comment[];
  milestones: Milestone[];
  color: string;
};



// Demo data
const initialGoals = [
  {
    id: 1,
    title: "Launch New Website",
    description: "Complete redesign and launch of company website",
    progress: 65,
    dueDate: "2025-06-15",
    owner: "Alex Chen",
    team: "Marketing",
    comments: [
      { id: 1, user: "Taylor Kim", text: "Homepage looks great! Can we add more product images?", likes: 3, time: "2 days ago" },
      { id: 2, user: "Jordan Lee", text: "SEO optimization complete - all meta tags are in place.", likes: 1, time: "1 day ago" }
    ],
    milestones: [
      { id: 1, title: "Wireframes Complete", completed: true },
      { id: 2, title: "Design Approval", completed: true },
      { id: 3, title: "Content Upload", completed: true },
      { id: 4, title: "Testing Phase", completed: false },
      { id: 5, title: "Launch", completed: false }
    ],
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: 2,
    title: "Q2 Sales Targets",
    description: "Reach $1.2M in new business for Q2",
    progress: 42,
    dueDate: "2025-06-30",
    owner: "Sam Rodriguez",
    team: "Sales",
    comments: [
      { id: 1, user: "Morgan Smith", text: "West region is outperforming projections by 12%", likes: 5, time: "3 days ago" }
    ],
    milestones: [
      { id: 1, title: "$300K", completed: true },
      { id: 2, title: "$600K", completed: true },
      { id: 3, title: "$900K", completed: false },
      { id: 4, title: "$1.2M", completed: false }
    ],
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: 3,
    title: "Mobile App Development",
    description: "Build and launch v1 of customer mobile app",
    progress: 20,
    dueDate: "2025-08-30",
    owner: "Jesse Park",
    team: "Product",
    comments: [
      { id: 1, user: "Robin Cho", text: "API integration is taking longer than expected. We might need another sprint.", likes: 0, time: "1 day ago" }
    ],
    milestones: [
      { id: 1, title: "Requirements Gathered", completed: true },
      { id: 2, title: "Design Phase", completed: true },
      { id: 3, title: "Frontend Development", completed: false },
      { id: 4, title: "Backend Integration", completed: false },
      { id: 5, title: "Testing", completed: false },
      { id: 6, title: "App Store Submission", completed: false }
    ],
    color: "from-rose-500 to-pink-600"
  }
];

export default function GoalTracker() {
  const [darkMode, setDarkMode] = useState(false);
  const [goals, setGoals] = useState(initialGoals);
  const [newComment, setNewComment] = useState('');
  const [activeCommentGoalId, setActiveCommentGoalId] = useState<number | null>(null);
  const [expandedGoalId, setExpandedGoalId] = useState<number | null>(null);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    dueDate: '',
    team: '',
    owner: ''
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
  const toggleMilestone = (goalId:number, milestoneId:number) => {
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
  const addComment = (goalId:number) => {
    if (!newComment.trim()) return;
    
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          comments: [
            ...goal.comments,
            {
              id: goal.comments.length + 1,
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
  const likeComment = (goalId:number, commentId:number) => {
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
      id: goals.length + 1,
      title: newGoal.title,
      description: newGoal.description || "No description provided",
      progress: 0,
      dueDate: newGoal.dueDate || "Not set",
      owner: newGoal.owner || "Unassigned",
      team: newGoal.team || "No team",
      comments: [],
      milestones: [],
      color: colorOptions[Math.floor(Math.random() * colorOptions.length)]
    };
    
    setGoals([...goals, newGoalObject]);
    setNewGoal({
      title: '',
      description: '',
      dueDate: '',
      team: '',
      owner: ''
    });
    setShowAddGoal(false);
  };

  // Toggle goal expansion
  const toggleGoalExpansion = (goalId:number) => {
    setExpandedGoalId(expandedGoalId === goalId ? null : goalId);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`py-4 px-6 flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="flex items-center">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: 0 }}
          >
            <Trophy className={`w-8 h-8 ${darkMode ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
          </motion.div>
          <h1 className="text-2xl font-bold">GoalSync</h1>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Team Goals Dashboard</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddGoal(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-lg"
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
                className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${goal.color} p-4 text-white`}>
                  <h3 className="text-xl font-bold">{goal.title}</h3>
                  <p className="opacity-80 text-sm">{goal.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="p-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{goal.progress}% Complete</span>
                    <span className="text-sm">{goal.dueDate}</span>
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
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Owner: {goal.owner}</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Team: {goal.team}</span>
                </div>

                {/* Toggle Button */}
                <button 
                  onClick={() => toggleGoalExpansion(goal.id)}
                  className={`w-full flex items-center justify-center py-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  {expandedGoalId === goal.id ? 
                    <ChevronUp className="w-5 h-5" /> : 
                    <ChevronDown className="w-5 h-5" />
                  }
                </button>

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
                    <div className="mb-4">
                      <h4 className="font-bold mb-2">Milestones</h4>
                      <div className="space-y-2">
                        {goal.milestones.map(milestone => (
                          <motion.div 
                            key={milestone.id}
                            whileHover={{ x: 5 }}
                            className="flex items-center"
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
                                  className={`w-5 h-5 mr-2 ${milestone.completed ? 
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
                      <h4 className="font-bold mb-2">Comments</h4>
                      <div className="space-y-3 mb-3">
                        {goal.comments.map(comment => (
                          <div 
                            key={comment.id} 
                            className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                          >
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{comment.user}</span>
                              <span className="text-xs opacity-70">{comment.time}</span>
                            </div>
                            <p className="text-sm mb-2">{comment.text}</p>
                            <button 
                              onClick={() => likeComment(goal.id, comment.id)}
                              className="flex items-center text-xs opacity-70 hover:opacity-100"
                            >
                              <Heart className="w-3 h-3 mr-1" fill={comment.likes > 0 ? "currentColor" : "none"} />
                              {comment.likes}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Comment */}
                      {activeCommentGoalId === goal.id ? (
                        <div className="mt-3">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className={`w-full p-2 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:ring-2 focus:ring-${goal.color.split('-')[1]}-500 focus:outline-none`}
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
                            <button
                              onClick={() => addComment(goal.id)}
                              className={`px-3 py-1 text-sm rounded text-white bg-gradient-to-r ${goal.color}`}
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveCommentGoalId(goal.id)}
                          className="flex items-center text-sm opacity-70 hover:opacity-100"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Add Comment
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

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
                <button onClick={() => setShowAddGoal(false)}>
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    className={`w-full p-2 rounded-lg text-gray-900 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:outline-none`}
                    placeholder="Goal title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    className={`w-full p-2 rounded-lg text-gray-900 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:outline-none`}
                    placeholder="Describe your goal"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newGoal.dueDate}
                      onChange={(e) => setNewGoal({...newGoal, dueDate: e.target.value})}
                      className={`w-full p-2 rounded-lg text-gray-900 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:outline-none`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Team</label>
                    <input
                      type="text"
                      value={newGoal.team}
                      onChange={(e) => setNewGoal({...newGoal, team: e.target.value})}
                      className={`w-full p-2 rounded-lg text-gray-900 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:outline-none`}
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
                    className={`w-full p-2 rounded-lg text-gray-900 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:outline-none`}
                    placeholder="Goal owner"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddGoal}
                    className="px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-md"
                  >
                    Create Goal
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}