# 🎯 Professional Portfolio Website

A modern, responsive portfolio showcasing my development expertise and diverse professional background. Built with Angular and Tailwind CSS, featuring interactive components, contact forms, and a comprehensive skills showcase.

<img width="1249" height="920" alt="initial_capture" src="https://github.com/user-attachments/assets/1f8b6389-a848-45de-bb8c-c3ba32c4ac90" />


## ✨ Key Features

### 🚀 **Core Functionality**
- **Fully Responsive Design** - Perfect on desktop, tablet, and mobile
- **Interactive Contact Form** - Powered by Formspree with validation and error handling
- **Dynamic Project Showcase** - Interactive filtering by status (Planning/In-Development/Completed)
- **Skills Visualization** - Categorized expertise in Frontend, Backend, Databases, and Tools
- **Professional Timeline** - Experience showcase including military service and community involvement

### 🎨 **User Experience**
- **Smooth Animations** - Subtle hover effects and transitions throughout
- **Accessibility First** - WCAG compliant with proper ARIA labels and keyboard navigation
- **Fast Loading** - Optimized builds with Angular CLI and Tailwind CSS
- **Professional Typography** - Carefully chosen font stacks and responsive text scaling

### 🛠 **Technical Highlights**
- **Full-Stack Architecture** - Angular frontend + Node.js API backend
- **Component-Based Architecture** - Modular, maintainable Angular components
- **Data-Driven Content** - JSON-based content management for easy updates
- **Modern Development Stack** - Latest Angular with RxJS observables and reactive forms

## 🖥️ Screenshots

### Bird Gallery
<img width="505" height="671" alt="photography" src="https://github.com/user-attachments/assets/4d39ce35-a264-47d0-bc91-7b4cf401ce0a" />


## 🔧 Tech Stack

### Frontend Framework
- **Angular 17+** - Modern web framework with TypeScript
- **Tailwind CSS** - Utility-first CSS framework
- **RxJS** - Reactive programming library

### Backend & API
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Formspree** - Contact form handling service

### Development Tools
- **Angular CLI** - Project scaffolding and build tools
- **TypeScript** - Type-safe JavaScript development
- **ESLint** - Code linting and formatting
- **Git** - Version control

### Infrastructure
- **Vercel** - Frontend deployment platform
- **Railway/Render** - Backend API hosting
- **Formspree** - Serverless form handling

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── components/           # Angular components
│   │   │   ├── header/          # Navigation header
│   │   │   ├── about/           # Introduction section
│   │   │   ├── skills/          # Technical skills showcase
│   │   │   ├── experience/      # Professional experience
│   │   │   ├── projects/        # Portfolio projects
│   │   │   ├── gallery/         # Photography gallery
│   │   │   ├── contact/         # Contact form section
│   │   │   └── footer/          # Site footer
│   │   ├── services/            # Angular services
│   │   │   └── api.service.ts   # HTTP client service
│   │   └── assets/               # Static assets
│   │       └── images/          # Portfolio images
├── backend/
│   ├── data/                    # JSON data files
│   │   ├── skills.json         # Skills data
│   │   ├── experience.json     # Experience data
│   │   └── projects.json       # Projects data
│   ├── package.json             # Backend dependencies
│   └── server.js                # Express server
└── public/                      # Static assets
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** package manager
- **Angular CLI** (install globally)

```bash
npm install -g @angular/cli
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

### Development Setup

1. **Start the backend API** (in a separate terminal)
```bash
cd backend
npm start
```

2. **Start the Angular development server**
```bash
ng serve
```

3. **Open your browser**
Navigate to `http://localhost:4200`

The application will automatically reload when you save changes to your source files.

## 🔗 Configuration

### Contact Form Setup

1. Create a free account at [Formspree.io](https://formspree.io)
2. Create a new form and note your form ID
3. Update the form endpoint in `contact.component.ts`:

```typescript
// Replace YOUR_FORM_ID with your actual Formspree form ID
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
```

### Customizing Content

Edit the JSON files in `backend/data/` to personalize:

- **Skills** - Update technologies and proficiency levels
- **Experience** - Modify work history and projects
- **Projects** - Add or edit portfolio projects with status filtering

## 📱 Components Overview

### Header Navigation
- Responsive navigation with smooth scroll links
- Mobile hamburger menu with slide-out animation
- Fixed positioning with backdrop blur effect

### Skills Section
- Interactive skill cards with hover animations
- Categorized expertise (Frontend, Backend, Database, Tools)
- Proficiency indicators and technology icons

### Experience Timeline
- Chronological professional experience display
- Distinguished military service and community involvement
- Interactive timeline with hover effects

### Projects Showcase
- Grid-based project display with status filtering
- Category-based filtering (Planning/In-Development/Completed)
- Tech stack tags and external links

### Contact Integration
- Professional contact form with validation
- Formspree-powered email delivery
- Success/error state management
- Multiple contact method options

## 🔥 Build & Deployment

### Development Build

```bash
ng build
```

### Production Build

```bash
ng build --prod
```

### Frontend Deployment

Deploy the `dist/` folder to platforms like:
- **Vercel** (recommended for Angular)
- **Netlify**
- **GitHub Pages**

### Backend Deployment

Deploy the backend to:
- **Railway**
- **Render**
- **Heroku**
- **AWS EC2/DigitalOcean**

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Angular Team** for the excellent framework
- **Tailwind CSS** for the utility-first approach
- **Formspree** for hassle-free form handling
- **Open source community** for inspiration and tools

---

**Built with ❤️ using Angular & Tailwind CSS**

*Replace all [SCREENSHOT PLACEHOLDER] tags with actual screenshots of your portfolio* 🎨
