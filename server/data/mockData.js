// Minimal mock data used by lightweight API endpoints for development
const mockTasks = [
  {
    id: 'task_001',
    issueId: '1',
    title: 'Document Pothole Dimensions',
    description: 'Measure and photograph the pothole at MG Road for the repair crew.',
    steps: ['Navigate to location', 'Measure pothole width & depth', 'Photograph with reference object', 'Upload measurements', 'Confirm submission'],
    estimatedTime: '20 min',
    credits: 150,
    difficulty: 'easy',
    status: 'open',
    beforeImageUrl: 'https://picsum.photos/640/400?random=11',
    afterImageUrl: 'https://picsum.photos/640/400?random=21',
    category: 'road',
    location: 'MG Road, Bangalore',
    lat: 12.9753,
    lng: 77.6063,
  },
  {
    id: 'task_002',
    issueId: '5',
    title: 'Clear Debris Around Burst Pipe',
    description: 'Help clear debris and redirect pedestrian traffic while repair crew works.',
    steps: ['Arrive at location', 'Check in with repair crew', 'Set up safety cones', 'Guide pedestrians', 'Confirm completion'],
    estimatedTime: '45 min',
    credits: 250,
    difficulty: 'medium',
    status: 'open',
    beforeImageUrl: 'https://picsum.photos/640/400?random=12',
    afterImageUrl: 'https://picsum.photos/640/400?random=22',
    category: 'water',
    location: 'Whitefield Main Road, Bangalore',
    lat: 12.9698,
    lng: 77.7499,
  },
]

const mockAnalytics = {
  totalIssues: 1847,
  resolvedIssues: 1284,
  resolutionRate: 69.5,
  activeVolunteers: 3429,
  citiesCount: 47,
  totalCredits: 892340,
  avgResolutionDays: 4.2,
  thisMonth: { issues: 234, resolved: 189, volunteers: 312 },
  categoryBreakdown: [
    { category: 'Road', count: 432, resolved: 318 },
    { category: 'Electricity', count: 287, resolved: 198 },
  ],
  monthlyTrend: [
    { month: 'Sep', issues: 142, resolved: 98 },
    { month: 'Oct', issues: 178, resolved: 134 },
    { month: 'Nov', issues: 201, resolved: 156 },
    { month: 'Dec', issues: 165, resolved: 142 },
    { month: 'Jan', issues: 219, resolved: 178 },
    { month: 'Feb', issues: 234, resolved: 189 },
  ],
}

module.exports = { mockTasks, mockAnalytics }
