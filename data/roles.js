// Predefined job roles with similar/related roles
const JOB_ROLES = {
    // Software & Engineering
    "Software Engineer": ["Software Developer", "Full Stack Developer", "Backend Developer", "Frontend Developer", "Web Developer", "Application Developer", "Junior Developer"],
    "Software Developer": ["Software Engineer", "Full Stack Developer", "Application Developer", "Web Developer", "Junior Developer", "Programmer"],
    "Full Stack Developer": ["Software Engineer", "Web Developer", "Frontend Developer", "Backend Developer", "Full Stack Engineer"],
    "Frontend Developer": ["Frontend Engineer", "UI Developer", "Web Developer", "React Developer", "JavaScript Developer"],
    "Backend Developer": ["Backend Engineer", "Server-Side Developer", "API Developer", "Software Engineer"],
    "Web Developer": ["Frontend Developer", "Full Stack Developer", "Web Designer", "UI Developer"],
    "Mobile Developer": ["iOS Developer", "Android Developer", "React Native Developer", "Flutter Developer", "Mobile Engineer"],
    "iOS Developer": ["Mobile Developer", "Swift Developer", "Apple Developer", "Mobile Engineer"],
    "Android Developer": ["Mobile Developer", "Kotlin Developer", "Mobile Engineer"],
    "DevOps Engineer": ["Site Reliability Engineer", "Platform Engineer", "Cloud Engineer", "Infrastructure Engineer", "Systems Engineer"],
    "Cloud Engineer": ["DevOps Engineer", "AWS Engineer", "Azure Engineer", "Cloud Architect", "Infrastructure Engineer"],
    "QA Engineer": ["Test Engineer", "Quality Assurance Analyst", "Software Tester", "Automation Engineer", "SDET"],
    "Data Engineer": ["Data Developer", "ETL Developer", "Big Data Engineer", "Data Pipeline Engineer", "Analytics Engineer"],
    
    // Data & Analytics
    "Data Analyst": ["Business Analyst", "Data Scientist", "Analytics Analyst", "BI Analyst", "Reporting Analyst", "Insights Analyst"],
    "Data Scientist": ["Machine Learning Engineer", "Data Analyst", "AI Engineer", "Research Scientist", "Applied Scientist"],
    "Business Analyst": ["Data Analyst", "Business Intelligence Analyst", "Systems Analyst", "Product Analyst", "Operations Analyst"],
    "Business Intelligence Analyst": ["BI Developer", "Data Analyst", "Reporting Analyst", "Analytics Specialist"],
    "Machine Learning Engineer": ["ML Engineer", "AI Engineer", "Data Scientist", "Deep Learning Engineer", "Applied ML Engineer"],
    
    // Product & Design
    "Product Manager": ["Associate Product Manager", "Product Owner", "Technical Product Manager", "Product Analyst", "Program Manager"],
    "Project Manager": ["Program Manager", "Scrum Master", "Delivery Manager", "Project Coordinator", "Technical Project Manager"],
    "UX Designer": ["UI Designer", "Product Designer", "UX Researcher", "Interaction Designer", "Visual Designer"],
    "UI Designer": ["UX Designer", "Visual Designer", "Product Designer", "Web Designer", "Graphic Designer"],
    "Product Designer": ["UX Designer", "UI Designer", "Design Lead", "Visual Designer"],
    "Graphic Designer": ["Visual Designer", "Brand Designer", "Creative Designer", "Marketing Designer"],
    
    // Marketing & Sales
    "Marketing Coordinator": ["Marketing Specialist", "Marketing Associate", "Digital Marketing Coordinator", "Marketing Assistant"],
    "Digital Marketing Specialist": ["Marketing Specialist", "SEO Specialist", "Social Media Manager", "Content Marketing Specialist", "Growth Marketing"],
    "Content Writer": ["Copywriter", "Content Specialist", "Technical Writer", "Content Strategist", "Blog Writer"],
    "Social Media Manager": ["Social Media Specialist", "Community Manager", "Digital Marketing Specialist", "Content Creator"],
    "Sales Representative": ["Sales Associate", "Account Executive", "Business Development Representative", "Inside Sales", "Sales Coordinator"],
    "Account Executive": ["Sales Representative", "Account Manager", "Business Development", "Sales Executive"],
    "Business Development Representative": ["BDR", "SDR", "Sales Development Representative", "Inside Sales", "Lead Generation Specialist"],
    
    // Finance & Accounting
    "Financial Analyst": ["Finance Analyst", "FP&A Analyst", "Investment Analyst", "Business Analyst", "Junior Analyst"],
    "Accountant": ["Staff Accountant", "Junior Accountant", "Accounting Associate", "Bookkeeper", "Accounts Payable"],
    "Investment Banking Analyst": ["IB Analyst", "Financial Analyst", "M&A Analyst", "Corporate Finance Analyst"],
    "Auditor": ["Internal Auditor", "External Auditor", "Staff Auditor", "Audit Associate"],
    
    // HR & Operations
    "Human Resources Coordinator": ["HR Coordinator", "HR Assistant", "People Operations Coordinator", "Recruiting Coordinator", "HR Generalist"],
    "Recruiter": ["Talent Acquisition Specialist", "HR Recruiter", "Technical Recruiter", "Sourcer", "Recruiting Coordinator"],
    "Operations Coordinator": ["Operations Associate", "Operations Analyst", "Business Operations", "Project Coordinator"],
    
    // Consulting
    "Consultant": ["Associate Consultant", "Business Consultant", "Management Consultant", "Strategy Consultant", "Junior Consultant"],
    "Management Consultant": ["Strategy Consultant", "Business Consultant", "Associate Consultant", "Consulting Analyst"],
    
    // Customer Service
    "Customer Success Manager": ["Customer Success Associate", "Account Manager", "Client Success Manager", "Customer Experience Manager"],
    "Customer Support Specialist": ["Customer Service Representative", "Support Specialist", "Help Desk", "Technical Support"],
    
    // Research & Science
    "Research Analyst": ["Research Associate", "Market Research Analyst", "Junior Analyst", "Research Assistant"],
    "Research Scientist": ["Scientist", "Research Associate", "Lab Scientist", "R&D Scientist"],
    
    // Cybersecurity
    "Security Analyst": ["Cybersecurity Analyst", "Information Security Analyst", "SOC Analyst", "Security Engineer"],
    "Cybersecurity Analyst": ["Security Analyst", "Information Security Analyst", "Security Engineer", "Penetration Tester"],
    
    // Healthcare IT
    "Healthcare Analyst": ["Health Data Analyst", "Clinical Analyst", "Healthcare Business Analyst", "Medical Data Analyst"]
};

// Get all unique role names for autocomplete
const ALL_ROLES = [...new Set([
    ...Object.keys(JOB_ROLES),
    ...Object.values(JOB_ROLES).flat()
])].sort();

// Function to get similar roles
function getSimilarRoles(role) {
    const normalizedRole = role.toLowerCase().trim();
    
    // Direct match
    for (const [key, values] of Object.entries(JOB_ROLES)) {
        if (key.toLowerCase() === normalizedRole) {
            return values;
        }
    }
    
    // Partial match
    for (const [key, values] of Object.entries(JOB_ROLES)) {
        if (key.toLowerCase().includes(normalizedRole) || normalizedRole.includes(key.toLowerCase())) {
            return [key, ...values];
        }
    }
    
    // Check if it's in the values
    for (const [key, values] of Object.entries(JOB_ROLES)) {
        if (values.some(v => v.toLowerCase() === normalizedRole)) {
            return [key, ...values.filter(v => v.toLowerCase() !== normalizedRole)];
        }
    }
    
    return [];
}

// Function to search roles for autocomplete
function searchRoles(query) {
    if (!query || query.length < 2) return [];
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return ALL_ROLES.filter(role => 
        role.toLowerCase().includes(normalizedQuery)
    ).slice(0, 10);
}
