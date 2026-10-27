"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggle = () => {
    if (dark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDark(true);
    }
  };

  return (
    <button onClick={toggle} className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700">
      <span className="flex items-center gap-2">
        {dark ? <Moon size={16} /> : <Sun size={16} />}
        {dark ? "Dark Mode" : "Light Mode"}
      </span>
      <div className={`w-8 h-4 rounded-full relative transition-colors ${dark ? 'bg-blue-600' : 'bg-gray-300'}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${dark ? 'left-4.5' : 'left-0.5'}`}></div>
      </div>
    </button>
  );
}