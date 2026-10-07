# Hari Sharma - Personal Portfolio 🚀

A modern, high-performance, and visually striking personal portfolio website built to showcase my projects, skills, and experience as a Data Science & Full-Stack Developer.

## 🎨 Features
- **Cyberpunk / Premium Aesthetic:** Deep dark mode, neon glowing accents, glassmorphism, and custom geometric clip-paths.
- **Interactive 3D Graphics:** Real-time WebGL rendering using Three.js and React Three Fiber to create an immersive dynamic Hero section.
- **Smooth Animations:** Buttery-smooth scroll animations, page transitions, and interactive micro-interactions powered by Framer Motion and Lenis.
- **Dynamic Routing:** Multi-page layout (Home, About, Skills, Projects, Experience, Contact) built with React Router.
- **Responsive Design:** Completely fluid and fully optimized for mobile, tablet, and desktop devices.

## 🛠️ Tech Stack
- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion & Lenis (Smooth Scrolling)
- **3D Rendering:** Three.js & `@react-three/fiber`
- **Icons:** Lucide React & React Icons
- **Routing:** React Router v6

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/harix28/Fullstack-Dev.git
   cd Fullstack-Dev/portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser to view the application.

## 📂 Project Structure
```text
src/
├── assets/         # Static assets (images, icons)
├── components/     # Reusable UI components
│   ├── animations/ # Smooth scroll wrapper
│   ├── navigation/ # Navbar and Footer
│   ├── sections/   # Major page sections (Hero, Skills, Projects, etc.)
│   └── three/      # WebGL 3D Canvas components
├── config/         # Global configuration (Profile data, links)
├── data/           # Structured mock data (Projects, Skills, Experience)
├── pages/          # React Router page views
├── App.tsx         # Main application layout and routes
└── main.tsx        # React DOM entry point
```

## 📝 Customization
You can easily customize the content of the portfolio by editing the files inside the `src/config/` and `src/data/` directories:
- `src/config/profile.ts` - Update your personal info, bio, and social links.
- `src/data/skills.ts` - Update your technical skills.
- `src/data/projects.ts` - Update your portfolio projects.

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
