// DOM Elements
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const jobTitleInput = document.getElementById('jobTitle');
const roleSuggestions = document.getElementById('roleSuggestions');
const countrySelect = document.getElementById('country');
const citySelect = document.getElementById('city');
const searchBtn = document.getElementById('searchBtn');
const similarRolesSection = document.getElementById('similarRoles');
const similarRolesList = document.getElementById('similarRolesList');
const analyzeBtn = document.getElementById('analyzeBtn');
const analysisResults = document.getElementById('analysisResults');

// Tab Switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Job Title Autocomplete
jobTitleInput.addEventListener('input', (e) => {
    const query = e.target.value;
    const suggestions = searchRoles(query);
    
    if (suggestions.length > 0 && query.length >= 2) {
        roleSuggestions.innerHTML = suggestions
            .map(role => `<div class="suggestion-item">${role}</div>`)
            .join('');
        roleSuggestions.classList.add('show');
    } else {
        roleSuggestions.classList.remove('show');
    }
    
    // Show similar roles
    const similar = getSimilarRoles(query);
    if (similar.length > 0 && query.length >= 3) {
        similarRolesList.innerHTML = similar
            .slice(0, 6)
            .map(role => `<span class="tag" data-role="${role}">${role}</span>`)
            .join('');
        similarRolesSection.classList.remove('hidden');
    } else {
        similarRolesSection.classList.add('hidden');
    }
});

// Click on suggestion
roleSuggestions.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-item')) {
        jobTitleInput.value = e.target.textContent;
        roleSuggestions.classList.remove('show');
        
        // Update similar roles
        const similar = getSimilarRoles(e.target.textContent);
        if (similar.length > 0) {
            similarRolesList.innerHTML = similar
                .slice(0, 6)
                .map(role => `<span class="tag" data-role="${role}">${role}</span>`)
                .join('');
            similarRolesSection.classList.remove('hidden');
        }
    }
});

// Click on similar role tag
similarRolesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag')) {
        jobTitleInput.value = e.target.dataset.role;
    }
});

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.form-group')) {
        roleSuggestions.classList.remove('show');
    }
});

// Country -> City Population
countrySelect.addEventListener('change', (e) => {
    const country = e.target.value;
    const cities = getCitiesForCountry(country);
    
    citySelect.innerHTML = '<option value="">Select City/Province</option>';
    
    if (cities.length > 0) {
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
        citySelect.disabled = false;
    } else {
        citySelect.disabled = true;
    }
});

// Build Search Query and Open Google
searchBtn.addEventListener('click', () => {
    const jobTitle = jobTitleInput.value.trim();
    
    if (!jobTitle) {
        alert('Please enter a job title');
        return;
    }
    
    // Get selected experience levels
    const experienceLevels = Array.from(document.querySelectorAll('input[name="experience"]:checked'))
        .map(cb => cb.value);
    
    // Get selected job board (single selection with radio)
    const selectedJobBoard = document.querySelector('input[name="jobBoard"]:checked');
    
    if (!selectedJobBoard) {
        alert('Please select a job board');
        return;
    }
    
    const jobBoard = selectedJobBoard.value;
    
    // Get location
    const country = countrySelect.value;
    const city = citySelect.value;
    
    // Get time filter
    const timeFilter = document.getElementById('timeFilter').value;
    
    // Build the search query
    const searchQuery = buildSearchQuery(jobTitle, experienceLevels, jobBoard, country, city, timeFilter);
    
    // Open Google search
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}${timeFilter ? `&tbs=qdr:${timeFilter}` : ''}`;
    window.open(googleUrl, '_blank');
});

// Build search query string (single job board)
function buildSearchQuery(jobTitle, experienceLevels, jobBoard, country, city, timeFilter) {
    let query = '';
    
    // Add job title in quotes
    query += `"${jobTitle}" `;
    
    // Add site operator for single job board
    query += `site:${jobBoard} `;
    
    // Add experience level keywords
    if (experienceLevels.length > 0) {
        const expKeywords = experienceLevels.map(exp => `"${exp}"`).join(' OR ');
        query += `(${expKeywords}) `;
    }
    
    // Add location
    if (city) {
        query += `"${city}" `;
    } else if (country && country !== 'Remote') {
        query += `"${country}" `;
    }
    
    if (country === 'Remote') {
        query += '"remote" ';
    }
    
    return query.trim();
}

// Resume Analyzer
analyzeBtn.addEventListener('click', async () => {
    await handleResumeAction('analyze');
});

// Generate Resume Button
const generateBtn = document.getElementById('generateBtn');
generateBtn.addEventListener('click', async () => {
    await handleResumeAction('generate');
});

// API calls are now proxied through Netlify serverless function
// The API key is stored securely in Netlify environment variables

// Global variable to store resume data for download
let currentResumeData = null;

// Unified handler for analyze and generate
async function handleResumeAction(action) {
    const resumeText = getResumeText();
    const targetJob = document.getElementById('targetJob').value.trim();
    const jobDescription = document.getElementById('jobDescription').value.trim();
    
    if (!resumeText) {
        alert('Please provide your resume (paste text or upload file)');
        return;
    }
    
    if (!targetJob) {
        alert('Please enter a target job title');
        return;
    }
    
    if (!jobDescription) {
        alert('Please paste the job description for accurate tailoring');
        return;
    }
    
    // Save model preference to localStorage
    const selectedModel = document.getElementById('modelSelect')?.value;
    if (selectedModel) {
        localStorage.setItem('preferred_model', selectedModel);
    }
    
    const btn = action === 'analyze' ? analyzeBtn : generateBtn;
    const originalText = btn.textContent;
    
    // Show loading state
    btn.disabled = true;
    analyzeBtn.disabled = true;
    generateBtn.disabled = true;
    btn.textContent = action === 'analyze' ? '🔄 Analyzing...' : '🔄 Generating...';
    analysisResults.classList.add('hidden');
    document.getElementById('generatedResumeSection').classList.add('hidden');
    
    try {
        if (action === 'analyze') {
            const analysis = await analyzeResumeEnhanced(resumeText, targetJob, jobDescription);
            displayEnhancedAnalysis(analysis);
        } else {
            const result = await generateTailoredResume(resumeText, targetJob, jobDescription);
            displayEnhancedAnalysis(result.analysis);
            displayGeneratedResume(result.resume, result.changes, targetJob);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    } finally {
        btn.disabled = false;
        analyzeBtn.disabled = false;
        generateBtn.disabled = false;
        btn.textContent = originalText;
    }
}

// Get resume text from active input method
function getResumeText() {
    const activeMethod = document.querySelector('.input-method.active');
    if (activeMethod.id === 'pasteMethod') {
        return document.getElementById('resumeText').value.trim();
    }
    // For file methods, text is stored in data attribute after parsing
    return activeMethod.dataset.resumeText || '';
}

// Input Method Tabs
document.querySelectorAll('.method-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.input-method').forEach(m => m.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.method + 'Method').classList.add('active');
    });
});

// File Upload Handling
function setupFileUpload(dropAreaId, fileInputId, fileInfoId) {
    const dropArea = document.getElementById(dropAreaId);
    const fileInput = document.getElementById(fileInputId);
    const fileInfo = document.getElementById(fileInfoId);
    
    if (!dropArea || !fileInput) return;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('dragover'));
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('dragover'));
    });
    
    dropArea.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length) handleFile(files[0], fileInfo, dropAreaId);
    });
    
    dropArea.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) handleFile(fileInput.files[0], fileInfo, dropAreaId);
    });
}

async function handleFile(file, fileInfoEl, methodId) {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.txt')) {
        alert('Please upload a PDF, DOCX, DOC, or TXT file');
        return;
    }
    
    fileInfoEl.classList.remove('hidden');
    fileInfoEl.innerHTML = `
        <span class="file-name">📄 ${file.name}</span>
        <span class="remove-file" onclick="removeFile('${methodId}', '${fileInfoEl.id}')">✕</span>
    `;
    
    // For TXT files, read directly
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const text = await file.text();
        document.querySelector(`#${methodId.replace('DropArea', 'Method')}`).dataset.resumeText = text;
    } else {
        // For PDF/DOCX, we'll need to extract text - store file reference
        // Note: Full PDF parsing would require a library like pdf.js
        // For now, prompt user to paste text for PDF/DOCX
        const method = document.querySelector(`#${methodId.replace('DropArea', 'Method')}`);
        method.dataset.resumeText = '';
        
        // Show message to paste text from PDF
        fileInfoEl.innerHTML += `
            <div style="margin-top: 10px; padding: 10px; background: #fef3c7; border-radius: 6px; font-size: 0.85rem;">
                <strong>📋 PDF/DOCX detected:</strong> Please open the file and copy-paste the text into the "Paste Text" tab for best results, or the AI will attempt to process it.
            </div>
        `;
        
        // Try to read as text anyway (works for some formats)
        try {
            const text = await file.text();
            if (text && text.length > 100) {
                method.dataset.resumeText = text;
            }
        } catch (e) {
            console.log('Could not read file as text');
        }
    }
}

function removeFile(methodId, fileInfoId) {
    document.getElementById(fileInfoId).classList.add('hidden');
    document.getElementById(fileInfoId).innerHTML = '';
    const method = document.querySelector(`#${methodId.replace('DropArea', 'Method')}`);
    if (method) method.dataset.resumeText = '';
}

// Initialize file upload areas
document.addEventListener('DOMContentLoaded', () => {
    setupFileUpload('fileDropArea', 'resumeFile', 'fileInfo');
    setupFileUpload('linkedinDropArea', 'linkedinFile', 'linkedinFileInfo');
    
    // Load saved model preference
    const savedModel = localStorage.getItem('preferred_model');
    if (savedModel && document.getElementById('modelSelect')) {
        document.getElementById('modelSelect').value = savedModel;
    }
});

// Enhanced Resume Analysis - Optimized for Llama 3.3
async function analyzeResumeEnhanced(resumeText, targetJob, jobDescription) {
    const systemPrompt = `You are a world-class ATS (Applicant Tracking System) expert and career coach with 15+ years of experience helping candidates land jobs at top companies.

YOUR TASK: Analyze a resume against a specific job description and provide precise, actionable feedback.

ANALYSIS FRAMEWORK:
1. KEYWORD EXTRACTION: Identify ALL technical skills, tools, methodologies, and soft skills from the job description
2. KEYWORD MATCHING: Compare JD keywords against resume - categorize as found/missing/partial
3. ATS SCORING: Calculate realistic scores based on:
   - Keywords (40%): How many JD keywords appear in resume
   - Formatting (20%): ATS-friendly structure, no tables/graphics
   - Relevance (25%): Experience alignment with role requirements
   - Impact (15%): Quantified achievements, metrics, results

4. Be SPECIFIC - mention exact keywords, exact sections, exact improvements
5. For students/new grads, consider projects and coursework as valid experience

OUTPUT FORMAT: You MUST respond with ONLY valid JSON (no markdown, no explanation before/after):
{
    "atsScore": {
        "overall": <number 0-100>,
        "keywords": <number 0-100>,
        "formatting": <number 0-100>,
        "relevance": <number 0-100>,
        "impact": <number 0-100>
    },
    "keywordAnalysis": {
        "found": ["exact keywords from JD that ARE in resume"],
        "missing": ["exact keywords from JD that are NOT in resume - CRITICAL"],
        "partial": ["keywords that are similar but not exact match"]
    },
    "suggestedTitles": ["Job Title 1", "Job Title 2", "Job Title 3"],
    "improvements": [
        {
            "type": "critical|important|nice-to-have",
            "area": "Section Name",
            "issue": "Specific problem",
            "fix": "Exact action to take"
        }
    ],
    "strengths": ["What's already good about this resume"]
}`;

    const userPrompt = `TASK: Perform a comprehensive ATS analysis for this job application.

===== TARGET POSITION =====
${targetJob}

===== JOB DESCRIPTION (extract ALL keywords from this) =====
${jobDescription}

===== CANDIDATE'S RESUME =====
${resumeText}

===== INSTRUCTIONS =====
1. Extract every skill, technology, qualification from the JD
2. Check which ones appear in the resume (exact or similar)
3. Calculate realistic ATS scores (be honest, not inflated)
4. List the MOST CRITICAL missing keywords that would get the resume rejected
5. Provide 3-5 specific, actionable improvements

Remember: Output ONLY the JSON object, nothing else.`;

    const response = await callOpenAI(systemPrompt, userPrompt);
    return parseJSONResponse(response);
}

// Generate Tailored Resume - Optimized for Llama 3.3
async function generateTailoredResume(resumeText, targetJob, jobDescription) {
    // Get selected sections
    const sections = Array.from(document.querySelectorAll('input[name="sections"]:checked'))
        .map(cb => cb.value);
    const resumeLength = document.getElementById('resumeLength').value;
    
    const systemPrompt = `You are a TOP-TIER professional resume writer who has helped 10,000+ candidates land jobs at FAANG, Fortune 500, and top startups. You specialize in creating ATS-beating resumes for students and new graduates.

YOUR MISSION: Transform the candidate's resume into a PERFECT one-page resume for the target job.

===== CRITICAL: ONE-PAGE CONSTRAINT =====
THE RESUME MUST FIT ON EXACTLY ONE PAGE. This is non-negotiable.
- Maximum 2-3 bullet points per experience (prioritize most impactful)
- Professional Summary: 2 sentences max
- Keep skills section to 2-3 lines total
- If candidate has 3+ experiences, include only top 2-3 most relevant
- For students: 2 experiences + 2 projects maximum
- Each bullet point: 1-2 lines maximum, no more

===== RESUME TRANSFORMATION RULES =====

1. KEYWORD INJECTION (Most Critical):
   - Extract EVERY skill, technology, tool, methodology from the job description
   - Naturally weave these EXACT keywords into the resume
   - Place most important keywords in: Summary, Skills, first bullet of each experience

2. BULLET POINT FORMULA (XYZ Formula):
   - Format: "Accomplished [X] as measured by [Y], by doing [Z]"
   - EVERY bullet must start with a POWER ACTION VERB: Led, Developed, Engineered, Implemented, Architected, Optimized, Spearheaded, Delivered, Launched, Automated
   - Include METRICS: percentages, dollar amounts, time saved, users impacted, team size
   - If original has no metrics, estimate reasonable ones based on context
   - KEEP BULLETS CONCISE: Max 20 words per bullet

3. PROFESSIONAL SUMMARY:
   - 2 sentences MAX (40-50 words total)
   - Include: Years of experience (or "Recent graduate"), top 3-4 skills matching JD, career goal aligned with role
   - MUST contain 3+ keywords from JD

4. SKILLS SECTION:
   - Combine all skills into 2-3 compact lines
   - Use bullet separators (•) between skills
   - Put JD-matching skills FIRST

5. ATS OPTIMIZATION:
   - Use standard section headers: "PROFESSIONAL SUMMARY", "SKILLS", "EXPERIENCE", "EDUCATION", "PROJECTS"
   - No tables, columns, graphics, icons
   - Dates format: "Mon Year - Mon Year" (abbreviated month)

6. PRESERVE ACCURACY:
   - Keep company names, school names, dates EXACTLY as provided
   - Only enhance descriptions, don't fabricate experience
   - Projects count as valid experience for students

===== OUTPUT FORMAT =====
Respond with ONLY this JSON structure (no other text):
{
    "analysis": {
        "atsScore": {
            "overall": <85-95 for optimized resume>,
            "keywords": <score>,
            "formatting": <score>,
            "relevance": <score>,
            "impact": <score>
        },
        "keywordAnalysis": {
            "found": ["keywords now in resume"],
            "missing": ["any still missing"],
            "partial": []
        },
        "suggestedTitles": ["3 job titles this resume matches"],
        "improvements": [],
        "strengths": ["what makes this resume strong now"]
    },
    "resume": {
        "name": "Candidate Full Name",
        "contact": {
            "email": "email from resume",
            "phone": "phone from resume",
            "linkedin": "linkedin URL if provided",
            "location": "City, State/Province"
        },
        "summary": "Compelling 2-3 sentence summary packed with JD keywords...",
        "skills": {
            "technical": ["Most relevant technical skills from JD first"],
            "tools": ["Tools and technologies"],
            "soft": ["Relevant soft skills"]
        },
        "experience": [
            {
                "title": "Job Title",
                "company": "Company Name (keep exact)",
                "location": "City, State",
                "dates": "Month Year - Month Year",
                "bullets": [
                    "POWERFUL bullet with action verb + metrics + JD keywords",
                    "Another impactful achievement"
                ]
            }
        ],
        "education": [
            {
                "degree": "Degree Name",
                "school": "School Name (keep exact)",
                "location": "City, State",
                "dates": "Graduation date",
                "gpa": "GPA if 3.0+",
                "relevant": ["Relevant coursework, honors, activities"]
            }
        ],
        "projects": [
            {
                "name": "Project Name",
                "technologies": "Tech stack used",
                "dates": "When",
                "bullets": ["What you built + impact + keywords"]
            }
        ],
        "certifications": ["Any certifications"]
    },
    "changes": [
        {"type": "added", "description": "Specific change made"},
        {"type": "improved", "description": "What was enhanced"}
    ]
}`;

    const userPrompt = `===== TRANSFORMATION REQUEST =====

TARGET ROLE: ${targetJob}

===== JOB DESCRIPTION (Extract ALL keywords) =====
${jobDescription}

===== ORIGINAL RESUME (Transform this) =====
${resumeText}

===== REQUIREMENTS =====
- Sections to include: ${sections.join(', ')}
- Page limit: ${resumeLength} page(s)
- Make this resume score 85%+ on ATS systems
- Include ALL possible keywords from the JD
- Transform weak bullets into powerful achievement statements

Generate the complete optimized resume as JSON only.`;

    const response = await callOpenAI(systemPrompt, userPrompt, 4500);
    return parseJSONResponse(response);
}

// Call OpenRouter API via Netlify serverless function (API key is secured server-side)
async function callOpenAI(systemPrompt, userPrompt, maxTokens = 2000) {
    const model = document.getElementById('modelSelect')?.value || 'meta-llama/llama-3.3-70b-instruct';
    
    // Use Netlify serverless function to proxy the API call
    const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: maxTokens,
            top_p: 0.9
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

// Parse JSON from AI response
function parseJSONResponse(content) {
    let jsonContent = content;
    if (content.includes('```json')) {
        jsonContent = content.split('```json')[1].split('```')[0];
    } else if (content.includes('```')) {
        jsonContent = content.split('```')[1].split('```')[0];
    }
    return JSON.parse(jsonContent.trim());
}

// Display Enhanced Analysis
function displayEnhancedAnalysis(analysis) {
    // ATS Score Circle
    const score = analysis.atsScore.overall;
    const scoreClass = score >= 75 ? 'high' : score >= 50 ? 'medium' : 'low';
    const scoreCircle = document.getElementById('atsScoreCircle');
    scoreCircle.className = `score-circle-large ${scoreClass}`;
    scoreCircle.innerHTML = `
        <span class="score-value">${score}</span>
        <span class="score-label">ATS Score</span>
    `;
    
    // Score Breakdown
    const breakdown = analysis.atsScore;
    document.getElementById('scoreBreakdown').innerHTML = `
        <div class="score-item">
            <div class="score-item-label">Keywords Match</div>
            <div class="score-item-bar"><div class="score-item-fill" style="width: ${breakdown.keywords}%"></div></div>
            <div class="score-item-value">${breakdown.keywords}%</div>
        </div>
        <div class="score-item">
            <div class="score-item-label">Formatting</div>
            <div class="score-item-bar"><div class="score-item-fill" style="width: ${breakdown.formatting}%"></div></div>
            <div class="score-item-value">${breakdown.formatting}%</div>
        </div>
        <div class="score-item">
            <div class="score-item-label">Relevance</div>
            <div class="score-item-bar"><div class="score-item-fill" style="width: ${breakdown.relevance}%"></div></div>
            <div class="score-item-value">${breakdown.relevance}%</div>
        </div>
        <div class="score-item">
            <div class="score-item-label">Impact & Metrics</div>
            <div class="score-item-bar"><div class="score-item-fill" style="width: ${breakdown.impact}%"></div></div>
            <div class="score-item-value">${breakdown.impact}%</div>
        </div>
    `;
    
    // Keyword Stats
    const kw = analysis.keywordAnalysis;
    document.getElementById('keywordStats').innerHTML = `
        <div class="keyword-stat">
            <div class="keyword-stat-value">${kw.found?.length || 0}</div>
            <div class="keyword-stat-label">Keywords Found</div>
        </div>
        <div class="keyword-stat">
            <div class="keyword-stat-value" style="color: #dc2626;">${kw.missing?.length || 0}</div>
            <div class="keyword-stat-label">Missing Keywords</div>
        </div>
        <div class="keyword-stat">
            <div class="keyword-stat-value" style="color: #d97706;">${kw.partial?.length || 0}</div>
            <div class="keyword-stat-label">Partial Matches</div>
        </div>
    `;
    
    // Keyword Tags
    let keywordHtml = '';
    if (kw.found?.length > 0) {
        keywordHtml += `<div class="keyword-match-section"><h4>✅ Found in Resume</h4>${kw.found.map(k => `<span class="keyword-tag found">${k}</span>`).join('')}</div>`;
    }
    if (kw.missing?.length > 0) {
        keywordHtml += `<div class="keyword-match-section"><h4>❌ Missing - Add These!</h4>${kw.missing.map(k => `<span class="keyword-tag missing">${k}</span>`).join('')}</div>`;
    }
    if (kw.partial?.length > 0) {
        keywordHtml += `<div class="keyword-match-section"><h4>⚠️ Partial Match - Strengthen</h4>${kw.partial.map(k => `<span class="keyword-tag partial">${k}</span>`).join('')}</div>`;
    }
    document.getElementById('keywordMatch').innerHTML = keywordHtml;
    
    // Suggested Titles
    document.getElementById('suggestedTitles').innerHTML = `
        <div class="tags">${analysis.suggestedTitles?.map(t => `<span class="tag">${t}</span>`).join('') || ''}</div>
    `;
    
    // Improvements
    const impHtml = analysis.improvements?.map(imp => `
        <div class="change-item">
            <span class="change-type ${imp.type === 'critical' ? 'removed' : 'improved'}">${imp.type}</span>
            <strong>${imp.area}</strong>
            <p class="change-description">${imp.issue}</p>
            <p style="color: #059669; margin-top: 6px;">✅ ${imp.fix}</p>
        </div>
    `).join('') || '<p>No critical improvements needed!</p>';
    document.getElementById('improvements').innerHTML = impHtml;
    
    analysisResults.classList.remove('hidden');
    analysisResults.scrollIntoView({ behavior: 'smooth' });
}

// Display Generated Resume
function displayGeneratedResume(resume, changes, targetJob) {
    const preview = document.getElementById('resumePreview');
    
    // Store for downloads
    currentResumeData = {
        resume: resume,
        targetJob: targetJob
    };
    
    // Build resume HTML with strict one-page formatting
    let html = `
        <div class="resume-document" id="resumeDocument">
            <div class="resume-header-section">
                <h1 class="resume-name">${resume.name || 'Your Name'}</h1>
                <div class="contact-info">
                    ${[resume.contact?.email, resume.contact?.phone, resume.contact?.location, resume.contact?.linkedin].filter(Boolean).join(' | ')}
                </div>
            </div>
    `;
    
    // Professional Summary
    if (resume.summary) {
        html += `
            <div class="resume-section">
                <div class="section-title">PROFESSIONAL SUMMARY</div>
                <p class="summary-text">${resume.summary}</p>
            </div>
        `;
    }
    
    // Skills - Compact inline format
    if (resume.skills) {
        html += `<div class="resume-section"><div class="section-title">SKILLS</div><div class="skills-grid">`;
        if (resume.skills.technical?.length > 0) {
            html += `<div class="skill-row"><span class="skill-label">Technical:</span> <span class="skill-items">${resume.skills.technical.join(' • ')}</span></div>`;
        }
        if (resume.skills.tools?.length > 0) {
            html += `<div class="skill-row"><span class="skill-label">Tools:</span> <span class="skill-items">${resume.skills.tools.join(' • ')}</span></div>`;
        }
        if (resume.skills.soft?.length > 0) {
            html += `<div class="skill-row"><span class="skill-label">Soft Skills:</span> <span class="skill-items">${resume.skills.soft.join(' • ')}</span></div>`;
        }
        html += `</div></div>`;
    }
    
    // Experience
    if (resume.experience?.length > 0) {
        html += `<div class="resume-section"><div class="section-title">EXPERIENCE</div>`;
        resume.experience.forEach(exp => {
            html += `
                <div class="experience-entry">
                    <div class="entry-header">
                        <span class="entry-title">${exp.title}</span>
                        <span class="entry-dates">${exp.dates}</span>
                    </div>
                    <div class="entry-subheader">
                        <span class="entry-company">${exp.company}</span>
                        <span class="entry-location">${exp.location || ''}</span>
                    </div>
                    <ul class="entry-bullets">
                        ${exp.bullets?.map(b => `<li>${b}</li>`).join('') || ''}
                    </ul>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    // Education
    if (resume.education?.length > 0) {
        html += `<div class="resume-section"><div class="section-title">EDUCATION</div>`;
        resume.education.forEach(edu => {
            html += `
                <div class="education-entry">
                    <div class="entry-header">
                        <span class="entry-title">${edu.degree}</span>
                        <span class="entry-dates">${edu.dates}</span>
                    </div>
                    <div class="entry-subheader">
                        <span class="entry-company">${edu.school}</span>
                        <span class="entry-location">${edu.location || ''}</span>
                    </div>
                    ${edu.gpa ? `<div class="edu-detail">GPA: ${edu.gpa}</div>` : ''}
                    ${edu.relevant?.length > 0 ? `<div class="edu-detail">${edu.relevant.join(', ')}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }
    
    // Projects
    if (resume.projects?.length > 0) {
        html += `<div class="resume-section"><div class="section-title">PROJECTS</div>`;
        resume.projects.forEach(proj => {
            html += `
                <div class="project-entry">
                    <div class="entry-header">
                        <span class="entry-title">${proj.name}</span>
                        <span class="entry-dates">${proj.dates || ''}</span>
                    </div>
                    <div class="entry-subheader">
                        <span class="entry-tech">${proj.technologies || ''}</span>
                    </div>
                    <ul class="entry-bullets">
                        ${proj.bullets?.map(b => `<li>${b}</li>`).join('') || ''}
                    </ul>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    // Certifications
    if (resume.certifications?.length > 0) {
        html += `<div class="resume-section"><div class="section-title">CERTIFICATIONS</div>`;
        html += `<p class="cert-list">${resume.certifications.join(' | ')}</p></div>`;
    }
    
    html += `</div>`; // Close resume-document
    
    preview.innerHTML = html;
    
    // Display changes
    const changesHtml = changes?.map(c => `
        <div class="change-item">
            <span class="change-type ${c.type}">${c.type}</span>
            <p class="change-description">${c.description}</p>
        </div>
    `).join('') || '';
    document.getElementById('changesList').innerHTML = changesHtml;
    
    // Show section
    document.getElementById('generatedResumeSection').classList.remove('hidden');
    
    // Setup copy and download buttons
    setupResumeActions(resume, targetJob);
}

// Generate filename in format: Name_JobTitle_Date
function generateFilename(resume, targetJob, extension) {
    const name = (resume.name || 'Resume').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    const job = (targetJob || 'Job').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `${name}_${job}_${date}.${extension}`;
}

// Setup copy and download functionality
function setupResumeActions(resume, targetJob) {
    // Copy button
    document.getElementById('copyResumeBtn').onclick = () => {
        const text = document.getElementById('resumePreview').innerText;
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copyResumeBtn');
            btn.textContent = '✓ Copied!';
            setTimeout(() => btn.textContent = '📋 Copy Text', 2000);
        });
    };
    
    // Download PDF button using html2pdf
    document.getElementById('downloadPdfBtn').onclick = () => {
        const element = document.getElementById('resumeDocument');
        const filename = generateFilename(resume, targetJob, 'pdf');
        
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true,
                letterRendering: true
            },
            jsPDF: { 
                unit: 'in', 
                format: 'letter', 
                orientation: 'portrait'
            },
            pagebreak: { mode: 'avoid-all' }
        };
        
        // Show loading
        const btn = document.getElementById('downloadPdfBtn');
        const originalText = btn.textContent;
        btn.textContent = '⏳ Generating...';
        btn.disabled = true;
        
        html2pdf().set(opt).from(element).save().then(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }).catch(err => {
            console.error('PDF Error:', err);
            btn.textContent = originalText;
            btn.disabled = false;
            alert('Error generating PDF. Please try again.');
        });
    };
    
    // Download Word button
    document.getElementById('downloadWordBtn').onclick = () => {
        const filename = generateFilename(resume, targetJob, 'doc');
        downloadAsWord(resume, filename);
    };
}

// Download as Word document
function downloadAsWord(resume, filename) {
    // Build Word-compatible HTML
    let html = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>Resume</title>
            <style>
                @page { size: 8.5in 11in; margin: 0.5in; }
                body { 
                    font-family: 'Calibri', 'Arial', sans-serif; 
                    font-size: 11pt; 
                    line-height: 1.15;
                    color: #000;
                }
                h1 { 
                    font-size: 16pt; 
                    text-align: center; 
                    margin: 0 0 2pt 0; 
                    font-weight: bold;
                }
                .contact { 
                    text-align: center; 
                    font-size: 10pt; 
                    margin-bottom: 8pt;
                    color: #333;
                }
                .section-title { 
                    font-size: 11pt; 
                    font-weight: bold; 
                    text-transform: uppercase; 
                    border-bottom: 1pt solid #000; 
                    margin: 10pt 0 4pt 0; 
                    padding-bottom: 1pt;
                }
                .entry-header { margin-top: 4pt; }
                .job-title { font-weight: bold; }
                .dates { float: right; }
                .company { font-style: italic; }
                .location { float: right; font-style: italic; }
                ul { margin: 2pt 0 4pt 18pt; padding: 0; }
                li { margin-bottom: 1pt; }
                p { margin: 2pt 0; }
                .skills { margin: 2pt 0; }
                .skill-label { font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>${resume.name || 'Your Name'}</h1>
            <div class="contact">${[resume.contact?.email, resume.contact?.phone, resume.contact?.location, resume.contact?.linkedin].filter(Boolean).join(' | ')}</div>
    `;
    
    // Summary
    if (resume.summary) {
        html += `<div class="section-title">PROFESSIONAL SUMMARY</div><p>${resume.summary}</p>`;
    }
    
    // Skills
    if (resume.skills) {
        html += `<div class="section-title">SKILLS</div>`;
        if (resume.skills.technical?.length > 0) {
            html += `<p class="skills"><span class="skill-label">Technical:</span> ${resume.skills.technical.join(', ')}</p>`;
        }
        if (resume.skills.tools?.length > 0) {
            html += `<p class="skills"><span class="skill-label">Tools:</span> ${resume.skills.tools.join(', ')}</p>`;
        }
        if (resume.skills.soft?.length > 0) {
            html += `<p class="skills"><span class="skill-label">Soft Skills:</span> ${resume.skills.soft.join(', ')}</p>`;
        }
    }
    
    // Experience
    if (resume.experience?.length > 0) {
        html += `<div class="section-title">EXPERIENCE</div>`;
        resume.experience.forEach(exp => {
            html += `
                <div class="entry-header">
                    <span class="job-title">${exp.title}</span>
                    <span class="dates">${exp.dates}</span>
                </div>
                <div>
                    <span class="company">${exp.company}</span>
                    <span class="location">${exp.location || ''}</span>
                </div>
                <ul>${exp.bullets?.map(b => `<li>${b}</li>`).join('') || ''}</ul>
            `;
        });
    }
    
    // Education
    if (resume.education?.length > 0) {
        html += `<div class="section-title">EDUCATION</div>`;
        resume.education.forEach(edu => {
            html += `
                <div class="entry-header">
                    <span class="job-title">${edu.degree}</span>
                    <span class="dates">${edu.dates}</span>
                </div>
                <div>
                    <span class="company">${edu.school}</span>
                    <span class="location">${edu.location || ''}</span>
                </div>
                ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
                ${edu.relevant?.length > 0 ? `<p>${edu.relevant.join(', ')}</p>` : ''}
            `;
        });
    }
    
    // Projects
    if (resume.projects?.length > 0) {
        html += `<div class="section-title">PROJECTS</div>`;
        resume.projects.forEach(proj => {
            html += `
                <div class="entry-header">
                    <span class="job-title">${proj.name}</span>
                    <span class="dates">${proj.dates || ''}</span>
                </div>
                <div><span class="company">${proj.technologies || ''}</span></div>
                <ul>${proj.bullets?.map(b => `<li>${b}</li>`).join('') || ''}</ul>
            `;
        });
    }
    
    // Certifications
    if (resume.certifications?.length > 0) {
        html += `<div class="section-title">CERTIFICATIONS</div><p>${resume.certifications.join(' | ')}</p>`;
    }
    
    html += `</body></html>`;
    
    // Create blob and download
    const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
