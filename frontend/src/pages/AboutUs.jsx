import React from 'react'
import {
  Atom,
  Zap,
  Paintbrush,
  Server,
  Braces,
  Layers,
  Route,
  Component,
  Palette,
  Database,
  Sparkles,
} from 'lucide-react';



const techStack = [
  { name: 'React', icon: <Atom className="inline mr-2 text-cyan-300" /> },
  { name: 'Vite', icon: <Zap className="inline mr-2 text-yellow-300" /> },
  { name: 'Tailwind CSS', icon: <Paintbrush className="inline mr-2 text-sky-300" /> },
  { name: 'shadcn/ui', icon: <Component className="inline mr-2 text-pink-300" /> },
  { name: 'Radix UI', icon: <Layers className="inline mr-2 text-purple-300" /> },
  { name: 'Backend: Node.js', icon: <Server className="inline mr-2 text-green-300" /> },
  { name: 'Express', icon: <Braces className="inline mr-2 text-gray-300" /> },
  { name: 'Icons: Lucide React', icon: <Sparkles className="inline mr-2 text-blue-300" /> },
  { name: 'State Management: Zustand', icon: <Database className="inline mr-2 text-orange-300" /> },
  { name: 'Routing: React Router DOM', icon: <Route className="inline mr-2 text-red-300" /> },
  { name: 'Other: Modern CSS, Glassmorphism, Responsive Design', icon: <Palette className="inline mr-2 text-indigo-300" /> },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen px-4 py-12 flex flex-col items-center  text-white">
      <div className="w-full max-w-4xl glass rounded-3xl shadow-2xl p-10 backdrop-blur-md bg-white/10 border border-blue-400/20">
        <h1 className="text-5xl font-extrabold mb-10 text-blue-300 text-center tracking-tight drop-shadow-lg">About Us</h1>
        {/* About Website */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-blue-200">About This Website</h2>
          <p className="text-blue-100 mb-2 text-lg">
            Eventara is a modern event management and ticketing platform designed for hackathons, live shows, and conferences. It allows organizers to create, manage, and promote events, while attendees can discover, book, and enjoy seamless event experiences.
          </p>
        </section>
        {/* Tech Stack */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-blue-200">Tech Stack</h2>
          <ul className="list-none text-blue-100 space-y-2 text-lg pl-0">
            {techStack.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                {item.icon}
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </section>
        {/* Privacy & Policies */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-3 text-blue-200">Privacy & Policies</h2>
          <ul className="list-disc list-inside text-blue-100 space-y-1 text-lg pl-4">
            <li>Your data is used solely for event management and ticketing purposes.</li>
            <li>We do not share your personal information with third parties.</li>
            <li>All payments are processed securely through trusted gateways.</li>
            <li>Cookies are used only to enhance your browsing experience.</li>
            <li>By using this website, you agree to our terms and privacy policy.</li>
          </ul>
        </section>
        {/* About Me & Contributor */}
        <section className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          {/* Vivek Kumar Singh */}
          <div className="flex-1 bg-blue-900/40 rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg hover:scale-[1.03] transition-transform duration-200">
            <p className="text-xl font-bold text-white mb-2">Vivek Kumar Singh</p>
            <p className="text-blue-100 mb-4 font-semibold text-center">Final Year Student, Computer Science Engineer & Full Stack Developer</p>
            <p className="text-blue-100 text-center leading-relaxed">
              Passionate about building modern web applications, UI/UX, and solving real-world problems with technology. Focused on building web applications with strength in backend development, databases, and secure systems. Enjoys turning real-world challenges into scalable solutions and thrives in collaborative, tech-driven environments. Always eager to learn and collaborate!
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutUs
