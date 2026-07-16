import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const HomePage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black p-4">
    <div className="text-left">
      <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white">Idraki Muhamad</h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mt-2">Front-End Architect at RHB</p>
      <p className="text-md text-gray-500 mt-1">Previously: CGC, Maybank</p>
      <div className="flex space-x-6 mt-6">
        <a href="https://github.com/idrakimuhamad" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">GitHub</a>
        <a href="https://www.linkedin.com/in/idraki-muhamad-24671940/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">LinkedIn</a>
        <a href="mailto:idrakimuhamad@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Email</a>
        <a href="/#resume" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Resume</a>
      </div>
    </div>
  </div>
);

const experiences = [
  {
    role: "AVP, Front-End Architect",
    company: "RHB Banking Group · Full-time",
    duration: "Jun 2022 – Present · 4 yrs 2 mos",
    description: "Building universal application with React-Native. Spear head the RHB new mobile banking app.",
    project: {
      name: "RHB Mobile Banking",
      linkText: "RHB Mobile Banking – Apps on Google Play",
    }
  },
  {
    role: "Technical Lead, Front-End",
    company: "CGC Malaysia",
    duration: "Aug 2021 – May 2022 · 10 mos",
    description: "Part of the CGC’s digital transformation team in transforming how CGC works for the digital world, and digitalize and improve customer experience with CGC’s product and services."
  },
  {
    role: "AVP, Front-End Core Engineering Lead",
    company: "Maybank · Full-time",
    duration: "Oct 2019 – Aug 2021 · 1 yr 11 mos",
    description: "As a Front-End Architect/Developer/PR dictator/Problem solvers, I Involved with the development of Maybank latest breakthrough, MAE by Maybank2u. In charge mostly with the app user experience and transition apart from some modules, also lead by example for other developer involved by help out with difficulties involved during the project.",
    project: {
      name: "MAE by Maybank2u",
      description: "Life's about to get even easier. Sort out your spending, savings, cravings and more with MAE! It also comes with your favourite Maybank2u banking features."
    }
  },
  {
    role: "Senior Manager, Senior Front-End Developer",
    company: "RHB Banking Group",
    duration: "Nov 2017 – Oct 2019 · 2 yrs",
    location: "Kuala Lumpur, Malaysia",
    description: "Making React, React Native and Angular part of traditional banking."
  },
  {
    role: "JavaScript Architect",
    company: "Syntronic - A Global Design House",
    duration: "Nov 2015 – Oct 2017 · 2 yrs",
    location: "Kuala Lumpur, Malaysia",
    description: "Tech lead specialized in frontend development and design, with React, React Native, and Angular."
  },
  {
    role: "Senior Developer",
    company: "Yoozrr Technologies",
    duration: "Apr 2015 – Oct 2015 · 7 mos",
    location: "Malaysia",
    description: "Full stack developer. Work with Node.js, Angular.js, React, MongoDB."
  },
  {
    role: "Merchant Technical Engineer",
    company: "PayPal",
    duration: "Jul 2013 – Mar 2015 · 1 yr 9 mos",
    description: "Engage with PayPal's merchant in integrating PayPal product and APIs as well as delivering solution to their problem."
  },
  {
    role: "Front-End Designer/Developer",
    company: "BIZY Multimedia Sdn Bhd",
    duration: "Jun 2011 – Mar 2012 · 10 mos",
    description: "Responsible with the look and feel of the develop system as well as providing training for the team and some of the system module's backend including SQL and Sharepoint."
  },
  {
    role: "Application Consultant",
    company: "CRN Solutions Sdn Bhd",
    duration: "Feb 2011 – Jun 2011 · 5 mos",
    description: "Provide training to client. Develop Sharepoint based system."
  }
];

const educations = [
  {
    institution: "Universiti Teknologi MARA",
    degree: "Master of Information Technology, Management",
    duration: "2012 – 2013",
    grade: "3.38"
  },
  {
    institution: "University Malaya",
    degree: "Bachelor Degree Computer Science, Software Engineering",
    duration: "2006 – 2010"
  }
];

const ResumePage = () => (
  <div className="bg-white dark:bg-black min-h-screen print:bg-white">
    <header className="p-4 sm:p-6 md:p-8 print:p-0">
      <a href="/#" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors print:hidden">Home</a>
    </header>
    <main className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 font-sans text-black dark:text-white print:text-black print:max-w-full print:p-0">
      <div className="border-b border-gray-300 dark:border-gray-700 print:border-black pb-4">
        <h1 className="text-4xl font-bold">Idraki Muhamad</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 print:text-black">Front-End Architect at RHB Banking Group</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 print:text-black">Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur, Malaysia</p>
      </div>

      <div className="mt-6 space-y-2 text-sm">
        <a href="mailto:idrakimuhamad@gmail.com" className="block">idrakimuhamad@gmail.com</a>
        <a href="https://github.com/idrakimuhamad" className="block">github.com/idrakimuhamad</a>
        <a href="https://www.linkedin.com/in/idraki-muhamad-24671940/" className="block">linkedin.com/in/idraki-muhamad-24671940</a>
      </div>
      
      <section className="mt-8">
        <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-700 print:border-black pb-2">Experience</h2>
        <div className="mt-6 space-y-6">
          {experiences.map((exp, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold">{exp.role}</h3>
              <p className="text-md text-gray-700 dark:text-gray-300 print:text-black">{exp.company}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 print:text-black">{exp.duration} {exp.location && `· ${exp.location}`}</p>
              <p className="mt-2 text-sm">{exp.description}</p>
              {exp.project && (
                <div className="mt-2 text-sm bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md print:bg-gray-50 print:p-0">
                  <p className="font-semibold">{exp.project.name}</p>
                  <p className="text-gray-600 dark:text-gray-400 print:text-black">{exp.project.description || exp.project.linkText}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-700 print:border-black pb-2">Education</h2>
        <div className="mt-4 space-y-4">
          {educations.map((edu, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold">{edu.institution}</h3>
              <p className="text-md text-gray-700 dark:text-gray-300 print:text-black">{edu.degree}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 print:text-black">{edu.duration}</p>
              {edu.grade && <p className="text-sm text-gray-500 dark:text-gray-400 print:text-black">Grade: {edu.grade}</p>}
            </div>
          ))}
        </div>
      </section>

    </main>
  </div>
);


const App = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    // Set initial route
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  switch (route) {
    case '#resume':
      return <ResumePage />;
    default:
      return <HomePage />;
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
