# 🎓 Student Job Search Tool

A job search tool designed specifically for students and new graduates to find entry-level positions, internships, and co-op opportunities.

**Live Demo:** [Coming Soon - Deploy to Netlify]

## ✨ Features

### 🔍 Smart Job Search
- **Multiple Job Boards**: Search across LinkedIn, Indeed, Glassdoor, Lever, Greenhouse, and Workday simultaneously
- **Location Filtering**: Filter by country AND city/province (Canada, US, UK, Australia, Germany, India)
- **Experience Level Filters**: Checkboxes for New Grad, Entry Level, Internship, Co-op, Junior, and 0-2 Years
- **Time Filters**: Search jobs posted in the last 24 hours, week, or month
- **Similar Role Suggestions**: Type a job title and get suggestions for similar roles you might qualify for

### 📄 AI-Powered Resume Analyzer
- **Job Title Suggestions**: AI analyzes your resume and suggests the best job titles to search for
- **ATS Score**: Get a compatibility score (0-100) with breakdown for keywords, formatting, relevance, and quantification
- **Missing Keywords**: Discover critical keywords missing from your resume, categorized by importance
- **Improvement Suggestions**: Specific, actionable feedback prioritized by impact
- **Bullet Point Rewrites**: Get AI-improved versions of your bullet points with explanations

## 🚀 Getting Started

### Local Development
1. Clone this repository
2. Open `index.html` in your browser
3. No build step required!

### Deploy to Netlify
1. Push to GitHub
2. Connect your repo to Netlify
3. Deploy automatically!

## 🔑 API Key Setup

For the Resume Analyzer/Generator feature, you'll need an **OpenRouter API key** (free tier available):

1. Go to [OpenRouter.ai](https://openrouter.ai/keys)
2. Create an account (Google/GitHub sign-in available)
3. Generate a new API key (starts with `sk-or-v1-`)
4. Paste it in the Resume Analyzer tab

### Supported AI Models
| Model | Best For |
|-------|----------|
| **Llama 3.3 70B** | Best quality, comprehensive analysis |
| Llama 3.1 70B | Great quality, slightly faster |
| Llama 3.1 8B | Fastest, good for quick checks |
| Claude 3.5 Sonnet | Excellent writing quality |
| GPT-4o Mini | OpenAI's fast model |
| Gemini Pro 1.5 | Google's latest model |

**Note:** Your API key is stored locally in your browser and is never sent to any server except OpenRouter's API.

## 📁 Project Structure

```
Job-Search-Tool/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # Main JavaScript logic
├── data/
│   ├── roles.js        # Predefined job roles & similar roles
│   └── locations.js    # Country/city data
├── netlify.toml        # Netlify configuration
└── README.md           # This file
```

## 🛠️ Tech Stack

- **HTML5** - Structure
- **CSS3** - Styling with CSS Variables & Flexbox/Grid
- **Vanilla JavaScript** - No frameworks, lightweight & fast
- **OpenAI API** - Resume analysis (GPT-4o-mini)
- **Google Search** - Job aggregation via site: operators

## 💡 How the Job Search Works

The tool uses Google's `site:` search operators to search job boards one at a time:

```
"Software Engineer" site:glassdoor.com/job-listing ("new grad" OR "entry level") "Toronto"
```

### Supported Job Boards (Verified URLs)

| Job Board | Site Operator |
|-----------|---------------|
| LinkedIn | `site:linkedin.com/jobs` |
| Indeed | `site:indeed.com/viewjob` |
| Glassdoor | `site:glassdoor.com/job-listing` |
| Lever | `site:jobs.lever.co` |
| Greenhouse | `site:boards.greenhouse.io` |
| Workday | `site:myworkdayjobs.com` |
| BuiltIn | `site:builtin.com/job` |
| ZipRecruiter | `site:ziprecruiter.com/jobs` |
| SimplyHired | `site:simplyhired.com/job` |
| Dice | `site:dice.com/job-detail` |
| Monster | `site:monster.com/job-openings` |
| Wellfound | `site:wellfound.com/jobs` |
| Robert Half | `site:roberthalf.com/job` |
| SmartRecruiters | `site:smartrecruiters.com/jobs` |
| iCIMS | `site:icims.com/jobs` |
| Jobvite | `site:jobvite.com/jobs` |

This approach:
- ✅ No API keys needed for job search
- ✅ Always up-to-date results
- ✅ Free and unlimited searches
- ✅ Works with verified job board URLs

## 🎯 Roadmap / Future Features

- [ ] Save favorite searches
- [ ] Export resume analysis as PDF
- [ ] More job boards (Wellfound, Y Combinator, etc.)
- [ ] Interview preparation tips
- [ ] Salary estimation
- [ ] Company research integration

## 🙏 Inspiration

Inspired by [Brian's Job Search](https://briansjobsearch.com/) - thank you Brian!

## 📝 License

MIT License - Feel free to use and modify!

---

Built with ❤️ for students, by students 🎓
