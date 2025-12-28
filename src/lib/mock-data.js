// Mock data untuk template uploader

export const mockTemplates = [
  {
    id: "1",
    name: "Modern Portfolio",
    description: "Clean and modern portfolio template dengan glass morphism design",
    author: {
      id: "user1",
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
    previewImage: "https://via.placeholder.com/400x300/7C3AED/ffffff?text=Modern+Portfolio",
    sections: [
      { type: "header", name: "Header", order: 1 },
      { type: "hero", name: "Hero Section", order: 2 },
      { type: "about", name: "About", order: 3 },
      { type: "projects", name: "Projects", order: 4 },
      { type: "footer", name: "Footer", order: 5 },
    ],
    tags: ["portfolio", "modern", "glass"],
    downloads: 1250,
    views: 3450,
    likes: 89,
  },
  {
    id: "2",
    name: "Professional CV",
    description: "Professional CV template dengan sections lengkap untuk experience dan education",
    author: {
      id: "user2",
      name: "Jane Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    },
    createdAt: "2025-01-14T14:20:00Z",
    updatedAt: "2025-01-14T14:20:00Z",
    previewImage: "https://via.placeholder.com/400x300/0D9488/ffffff?text=Professional+CV",
    sections: [
      { type: "header", name: "Header", order: 1 },
      { type: "about", name: "About", order: 2 },
      { type: "experience", name: "Experience", order: 3 },
      { type: "education", name: "Education", order: 4 },
      { type: "skills", name: "Skills", order: 5 },
      { type: "footer", name: "Footer", order: 6 },
    ],
    tags: ["cv", "professional", "resume"],
    downloads: 2100,
    views: 5200,
    likes: 156,
  },
  {
    id: "3",
    name: "Creative Showcase",
    description: "Bold dan creative template untuk showcase karya dan portfolio",
    author: {
      id: "user3",
      name: "Alex Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    createdAt: "2025-01-13T09:15:00Z",
    updatedAt: "2025-01-13T09:15:00Z",
    previewImage: "https://via.placeholder.com/400x300/F59E0B/ffffff?text=Creative+Showcase",
    sections: [
      { type: "hero", name: "Hero", order: 1 },
      { type: "projects", name: "Projects", order: 2 },
      { type: "skills", name: "Skills", order: 3 },
      { type: "footer", name: "Footer", order: 4 },
    ],
    tags: ["creative", "showcase", "bold"],
    downloads: 890,
    views: 2100,
    likes: 67,
  },
  {
    id: "4",
    name: "Minimalist Resume",
    description: "Simple dan elegant resume template dengan focus pada content",
    author: {
      id: "user1",
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    createdAt: "2025-01-12T16:45:00Z",
    updatedAt: "2025-01-12T16:45:00Z",
    previewImage: "https://via.placeholder.com/400x300/EF4444/ffffff?text=Minimalist+Resume",
    sections: [
      { type: "header", name: "Header", order: 1 },
      { type: "about", name: "About", order: 2 },
      { type: "experience", name: "Experience", order: 3 },
      { type: "education", name: "Education", order: 4 },
      { type: "footer", name: "Footer", order: 5 },
    ],
    tags: ["minimalist", "resume", "simple"],
    downloads: 1750,
    views: 4100,
    likes: 124,
  },
  {
    id: "5",
    name: "Tech Portfolio",
    description: "Tech-focused portfolio template dengan dark theme dan modern design",
    author: {
      id: "user4",
      name: "Sarah Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    createdAt: "2025-01-11T11:00:00Z",
    updatedAt: "2025-01-11T11:00:00Z",
    previewImage: "https://via.placeholder.com/400x300/3B82F6/ffffff?text=Tech+Portfolio",
    sections: [
      { type: "header", name: "Header", order: 1 },
      { type: "hero", name: "Hero", order: 2 },
      { type: "about", name: "About", order: 3 },
      { type: "skills", name: "Skills", order: 4 },
      { type: "projects", name: "Projects", order: 5 },
      { type: "footer", name: "Footer", order: 6 },
    ],
    tags: ["tech", "portfolio", "dark"],
    downloads: 980,
    views: 2800,
    likes: 92,
  },
  {
    id: "6",
    name: "Academic CV",
    description: "Academic CV template dengan sections untuk publications dan research",
    author: {
      id: "user2",
      name: "Jane Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    },
    createdAt: "2025-01-10T13:30:00Z",
    updatedAt: "2025-01-10T13:30:00Z",
    previewImage: "https://via.placeholder.com/400x300/10B981/ffffff?text=Academic+CV",
    sections: [
      { type: "header", name: "Header", order: 1 },
      { type: "about", name: "About", order: 2 },
      { type: "education", name: "Education", order: 3 },
      { type: "experience", name: "Experience", order: 4 },
      { type: "projects", name: "Publications", order: 5 },
      { type: "footer", name: "Footer", order: 6 },
    ],
    tags: ["academic", "cv", "research"],
    downloads: 650,
    views: 1800,
    likes: 45,
  },
];

export const mockUser = {
  id: "user1",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  createdAt: "2024-12-01T10:00:00Z",
  templates: mockTemplates.filter((t) => t.author.id === "user1"),
};

export const mockCategories = [
  { id: "all", name: "All Templates", count: mockTemplates.length },
  { id: "portfolio", name: "Portfolio", count: 2 },
  { id: "cv", name: "CV/Resume", count: 3 },
  { id: "creative", name: "Creative", count: 1 },
];

export const mockTags = [
  "portfolio",
  "modern",
  "glass",
  "cv",
  "professional",
  "resume",
  "creative",
  "showcase",
  "bold",
  "minimalist",
  "simple",
  "tech",
  "dark",
  "academic",
  "research",
];

// Helper functions
export function getTemplateById(id) {
  return mockTemplates.find((t) => t.id === id);
}

export function getUserTemplates(userId) {
  return mockTemplates.filter((t) => t.author.id === userId);
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Baru saja";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
  return formatDate(dateString);
}

