zergio88-site 

1. Personal website created with Next.js, React, and Tailwind CSS. Currently in the initial layout stage, it will be the portfolio where I'll showcase my projects, experience, and contact information.

2. Technology Stack

Technologies:
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)


3. Folder structure

flowchart TD
    A[ZERGIO88-SITE] --> B[.next]
    A --> C[node_modules]
    A --> D[public]
    A --> E[src]
    
    E --> E1[app]
    E1 --> E2[locale]
    E1 --> E3[contact]
    E1 --> E4[test]
    E1 --> E5[page.tsx]
    E1 --> E6[layout.tsx]
    E1 --> E7[globals.css]

    E --> F[components]
    F --> F1[NavBar.tsx]

    E --> G[i18n]
    E --> H[messages]
    E --> I[middleware.ts]

    A --> J[README.md]
    A --> K[package.json]
    A --> L[tsconfig.json]


4. How to run the project locally

## 🚀 Installation and execution

```bash
# Clone the repository
git clone https://github.com/Zergio88/zergio88-site.git

# Enter the project
cd zergio88-site

# Install dependencies
npm install

# Run in development
npm run dev

5. **Link to the Vercel site**

```Markdown
🌍 **Visit the live site:** [miportfolio.vercel.app](https://zergio88.site)