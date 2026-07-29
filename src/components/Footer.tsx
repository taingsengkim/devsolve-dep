"use client";

import React, { useState } from "react";
import {
  FiGithub,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTwitter,
  FiLinkedin,
  FiYoutube,
  FiSend,
} from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <footer className="w-full bg-white text-gray-600 pt-16 pb-4 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/devsolve.png"
                  alt="DevSolve Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Dev<span className="text-blue-600">Solve</span>
              </span>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed pr-2">
              DevSolve is a bug bounty platform that connects organizations with
              ethical hackers to identify and resolve security vulnerabilities
              through responsible disclosure, collaboration, and rewards.
            </p>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">
              Social Media
            </p>

            <div className="flex items-center gap-2.5">
              <SocialLink href="#" icon={<FiGithub className="w-4 h-4" />} label="GitHub" />
              <SocialLink href="#" icon={<FaXTwitter className="w-3.5 h-3.5" />} label="Twitter" />
              <SocialLink href="#" icon={<FiLinkedin className="w-4 h-4" />} label="LinkedIn" />
              <SocialLink href="#" icon={<FiYoutube className="w-4 h-4" />} label="YouTube" />
              <SocialLink href="#" icon={<FiMail className="w-4 h-4" />} label="Email" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/programs">Programs</FooterLink>
              <FooterLink href="/activity">Hacker Activity</FooterLink>
              <FooterLink href="/leaderboard">Leaderboard</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5 text-sm">
              <FooterLink href="/support">Support Center</FooterLink>
              <FooterLink href="/docs">Documentation</FooterLink>
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Contact Us
            </h3>

            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-gray-600">
                  #40, Street 273, Sangkat Boeung Kak Ti Mouy,<br />Khan Toul Kork, Phnom Penh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <a
                  href="tel:+85515338826"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  +855 15 33 88 26
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <a
                  href="mailto:ipos.istad@gmail.com"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  ipos.istad@gmail.com
                </a>
              </li>
            </ul>

            <div className="mt-4">
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-3 py-2 text-sm bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 flex-shrink-0"
                  >
                    <FiSend className="w-3.5 h-3.5" />
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="py-10 text-center border-t border-gray-200">
          <p className="text-xs font-bold text-gray-00 uppercase tracking-widest mb-8">
            SUPPORTED BY
          </p>

          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center justify-center w-full md:w-auto gap-2">
              <img
                src="/istad.png"
                alt="ISTAD Logo"
                className="h-12 sm:h-14 w-auto object-contain hover:scale-105 transition-transform duration-200"
              />
            </div>

            <div className="flex flex-col items-center justify-center w-full md:w-auto gap-2">
              <img
                src="/Logo_MPTC.png"
                alt="MPTC Logo"
                className="h-12 sm:h-14 w-auto object-contain hover:scale-105 transition-transform duration-200"
              />
            </div>

            <div className="flex flex-col items-center justify-center w-full md:w-auto gap-2">
              <img
                src="/CBRD-Logo-Final.png"
                alt="CBRD Logo"
                className="h-12 sm:h-14 w-auto object-contain hover:scale-105 transition-transform duration-200"
              />
            </div>
          </div>

         
        </div>

        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {currentYear} DevSolve. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all duration-200"
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
      >
        {children}
      </a>
    </li>
  );
}