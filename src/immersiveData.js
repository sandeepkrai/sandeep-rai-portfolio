export const profile = {
  name: 'Sandeep Kumar Rai',
  role: 'Software Development Engineer',
  location: 'Bengaluru, Karnataka, India',
  phone: '+91 9369204281',
  email: 'raisandeep.dev@gmail.com',
  linkedin: 'https://www.linkedin.com/in/rai-sandeep/',
  statement: 'I build reliable distributed systems, observability platforms, and AI-powered automations that turn operational complexity into clear, useful software.',
}

export const impactMetrics = [
  { value: '10x', label: 'faster production debugging' },
  { value: '12h → 40m', label: 'monthly reporting automated' },
  { value: '5x', label: 'faster on-call investigation' },
  { value: '4K', label: 'daily customers supported' },
]

export const experiences = [
  {
    id: 'microsoft-sde', index: '01', organization: 'Microsoft', role: 'Software Development Engineer',
    period: 'July 2025 — Present', location: 'Onsite · Bengaluru', theme: 'signal', accent: '#5fe0c3',
    lead: 'Making complex production systems observable, explainable, and easier to operate.',
    points: [
      'Designed and implemented an end-to-end observability system with 5 telemetry and alerting components across 3+ repositories.',
      'Reduced production debugging time from hours to minutes, approximately a 10x improvement, while enabling proactive issue detection before customer escalation.',
      'Led a team-wide AI tooling adoption initiative with M3-level engagement.',
      'Built an end-to-end automation system that reduced monthly team reporting from about 12 hours to 30–40 minutes by removing manual collection and analysis.',
    ],
    tags: ['.NET', 'Azure', 'Observability', 'Agentic automation'],
  },
  {
    id: 'amazon', index: '02', organization: 'Amazon', role: 'SDE Intern',
    period: 'January 2025 — June 2025', location: 'Remote', theme: 'vault', accent: '#ffb951',
    lead: 'Strengthening payment data systems through privacy engineering and disciplined delivery.',
    points: [
      'Implemented General Data Protection Regulation compliance for the payments system within a strict three-month timeline.',
      'Implemented Data Subject Access Request compliance for the dataset owned by the team.',
    ],
    tags: ['Payments', 'GDPR', 'DSAR', 'Data systems'],
  },
  {
    id: 'microsoft-intern', index: '03', organization: 'Microsoft', role: 'Software Engineering Intern',
    period: 'May 2024 — July 2024', location: 'Bengaluru, Karnataka', theme: 'waves', accent: '#6bbdff',
    lead: 'Finding meaningful signals inside hundreds of seasonal and predictable false alarms.',
    points: [
      'Quickly understood the team’s project requirements and developed 2 machine-learning models for outlier detection.',
      'Reduced on-call engineers’ investigation time by 5x across hundreds of noisy alerts.',
    ],
    tags: ['Machine learning', 'Outlier detection', 'Telemetry'],
  },
  {
    id: 'baylink', index: '04', organization: 'Baylink', role: 'Software Development Engineer · Part-time',
    period: 'July 2023 — March 2024', location: 'Manipal, Karnataka', theme: 'routes', accent: '#ff7189',
    lead: 'Leading a small product team while building systems used in the real world every day.',
    points: [
      'Managed a team of 2 people to develop the official website and Flutter mobile application.',
      'Built for scale while the product was already handling around 4,000 customers daily.',
    ],
    tags: ['Team leadership', 'Flutter', 'Web development'],
  },
  {
    id: 'digital-india', index: '05', organization: 'Digital India Corporation',
    context: 'Ministry of Electronics and Information Technology', role: 'Software Development Engineer Intern',
    period: 'June 2023 — July 2023', location: 'Delhi, India', theme: 'grid', accent: '#ff9860',
    lead: 'Contributing to API Setu, the platform connecting India’s public digital services.',
    points: [
      'Enhanced the API Setu website with editing, management, and API publishing features aligned with OpenAPI 3.0 specifications.',
      'Collaborated with a mentor and a two-member team using Next.js, NestJS, and MongoDB to deliver project requirements.',
    ],
    tags: ['Next.js', 'NestJS', 'MongoDB', 'OpenAPI 3.0'],
    certificate: 'https://drive.google.com/file/d/12ICWIkYLpSxBcB4Tr21nxLoXgcTHhHkT/view?usp=sharing',
  },
  {
    id: 'intel', index: '06', organization: 'Intel Corporation', role: 'Project Intern',
    period: 'May 2023 — June 2023', location: 'Remote', theme: 'neural', accent: '#4ed5eb',
    lead: 'Optimizing computer vision models for high-performance inference.',
    points: [
      'Developed a high-performance convolutional neural network for the Fashion MNIST dataset using PyTorch and Intel optimizations.',
      'Achieved 94.3% model accuracy.',
    ],
    tags: ['PyTorch', 'CNN', 'Intel optimization'],
    certificate: 'https://drive.google.com/file/d/13rRWEFxU6DlYWS_mKsTcmwrFTzmgJEK6/view?usp=sharing',
  },
]

export const education = {
  institution: 'Manipal Institute of Technology, Manipal',
  degree: 'B.Tech · Computer and Communication Engineering', period: 'May 2021 — May 2025',
  location: 'Karnataka, India', cgpa: '8.6',
  highlights: [
    'Received the Achiever Scholarship, awarded to the top 5% of students based on annual academic performance.',
    'Awarded a ₹50,000 per year scholarship from Schneider Electric for academic excellence and dedication.',
  ],
}

export const project = {
  name: 'Groot', subtitle: 'A sustainable urban mobility solution', period: 'February 2023',
  description: 'A gamified mobility product designed to reduce carbon emissions, minimize congestion, and improve the quality of urban life.',
  details: [
    'Designed around inclusivity, affordability, and accessibility.',
    'Integrated augmented reality and open-source APIs into the mobility experience.',
  ],
  tags: ['Flutter', 'ARCore', 'Node.js', 'MongoDB'],
  link: 'https://github.com/sandeepkrai/Manipal_Hackathon_FluterApp',
}

export const achievements = [
  { place: '01', title: 'TAPMI National Hackathon', result: 'First position', prize: '₹40,000' },
  { place: '01', title: 'eSamudaay Hackathon', result: 'Team lead · First position', prize: '₹25,000' },
  { place: '06', title: 'Manipal Hackathon (M#)', result: 'Top 6 teams', prize: '₹10,000' },
  { place: '5%', title: 'Schneider Electric Scholar', result: 'Academic excellence', prize: '₹50,000 scholarship' },
]

export const skills = [
  '.NET', 'Distributed Systems', 'Agentic Automations', 'Microsoft Azure', 'AWS',
  'Low-Level Design', 'High-Level Design', 'Algorithms', 'Java', 'C++', 'C#', 'Python',
]