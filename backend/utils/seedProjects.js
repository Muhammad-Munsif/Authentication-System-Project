const Project = require('../models/Project');

const sampleProjects = [
  {
    title: 'AuthFlow Authentication System',
    description:
      'A secure authentication system with JWT tokens, OAuth2 integration, and multi-factor authentication support.',
    icon: 'fa-lock',
    status: 'active',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-30'),
    team: ['John Doe', 'Jane Smith', 'Mike Johnson'],
    tasks: [
      { id: 1, text: 'Design database schema', completed: true, priority: 'high' },
      { id: 2, text: 'Implement JWT authentication', completed: true, priority: 'high' },
      { id: 3, text: 'Create login/signup UI', completed: true, priority: 'medium' },
      { id: 4, text: 'Add OAuth2 providers', completed: false, priority: 'high' },
      { id: 5, text: 'Implement MFA', completed: false, priority: 'medium' },
      { id: 6, text: 'Write documentation', completed: false, priority: 'low' },
    ],
  },
  {
    title: 'E-commerce Platform',
    description:
      'Full-featured e-commerce platform with product management, shopping cart, payment integration, and order tracking.',
    icon: 'fa-shopping-cart',
    status: 'active',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-05-15'),
    team: ['Sarah Wilson', 'Tom Brown', 'Emily Davis'],
    tasks: [
      { id: 1, text: 'Setup product catalog', completed: true, priority: 'high' },
      { id: 2, text: 'Implement shopping cart', completed: true, priority: 'high' },
      { id: 3, text: 'Integrate payment gateway', completed: false, priority: 'high' },
      { id: 4, text: 'Create user dashboard', completed: false, priority: 'medium' },
      { id: 5, text: 'Add order tracking', completed: false, priority: 'medium' },
      { id: 6, text: 'Implement reviews system', completed: false, priority: 'low' },
    ],
  },
  {
    title: 'Mobile App Development',
    description:
      'Cross-platform mobile application for task management with real-time sync and push notifications.',
    icon: 'fa-mobile-alt',
    status: 'pending',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-06-30'),
    team: ['Alex Chen', 'Maria Garcia', 'David Kim'],
    tasks: [
      { id: 1, text: 'Design UI/UX mockups', completed: true, priority: 'high' },
      { id: 2, text: 'Setup React Native project', completed: true, priority: 'high' },
      { id: 3, text: 'Implement navigation', completed: false, priority: 'medium' },
      { id: 4, text: 'Add task management features', completed: false, priority: 'high' },
      { id: 5, text: 'Implement push notifications', completed: false, priority: 'medium' },
      { id: 6, text: 'Test on multiple devices', completed: false, priority: 'low' },
    ],
  },
  {
    title: 'AI Chatbot Integration',
    description:
      'Intelligent chatbot using OpenAI GPT-4 for customer support automation and lead generation.',
    icon: 'fa-robot',
    status: 'completed',
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-02-28'),
    team: ['Lisa Wang', 'Robert Taylor', 'Anna Martinez'],
    tasks: [
      { id: 1, text: 'Research AI models', completed: true, priority: 'high' },
      { id: 2, text: 'Setup OpenAI API', completed: true, priority: 'high' },
      { id: 3, text: 'Train custom model', completed: true, priority: 'high' },
      { id: 4, text: 'Integrate with website', completed: true, priority: 'medium' },
      { id: 5, text: 'Add analytics dashboard', completed: true, priority: 'low' },
      { id: 6, text: 'Deploy to production', completed: true, priority: 'high' },
    ],
  },
];

const seedProjectsForUser = async (userId) => {
  const docs = sampleProjects.map((p) => {
    const completed = p.tasks.filter((t) => t.completed).length;
    const progress = Math.round((completed / p.tasks.length) * 100);
    return { ...p, user: userId, progress };
  });
  return Project.insertMany(docs);
};

module.exports = { seedProjectsForUser };