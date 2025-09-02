## 1. zergio88-site 

Personal website created with Next.js, React, and Tailwind CSS. Currently in the initial layout stage, it will be the portfolio where I'll showcase my projects, experience, and contact information.


---

### 2. Technology Stack

Technologies:

- [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/docs)
- [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/docs/getting-started.html)
- [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/docs/)
- [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/docs)
- [![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/docs)
- [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://docs.github.com/)
- [![VSCode](https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/docs)


---

### 3. Folder structure


```mermaid
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

```

---

### 4. How to run the project locally

##### 🚀 Installation and execution

```bash
# Clone the repository
git clone https://github.com/Zergio88/zergio88-site.git

# Enter the project
cd zergio88-site

# Install dependencies
npm install

# Run in development
npm run dev

```


---

### 5. Link to the Vercel site

🌍 **Visit the live site:** [zergio88.site](https://zergio88.site)


---