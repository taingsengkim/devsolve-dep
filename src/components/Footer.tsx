
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiGithub,
  FiMail,
  FiMapPin,
  FiPhone,
  FiLinkedin,
  FiYoutube,
  FiSend,
} from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";

import { mockFooterData } from "@/lib/types/footer/mock-data";
import type { NavLinkItem, SocialLinkItem } from "@/lib/types/footer/type";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  const renderSocialIcon = (platform: SocialLinkItem["platform"]) => {
    switch (platform) {
      case "github":
        return <FiGithub className="w-4 h-4" />;
      case "twitter":
        return <FaXTwitter className="w-3.5 h-3.5" />;
      case "linkedin":
        return <FiLinkedin className="w-4 h-4" />;
      case "youtube":
        return <FiYoutube className="w-4 h-4" />;
      case "email":
        return <FiMail className="w-4 h-4" />;
    }
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
                  alt={`${mockFooterData.brandName} Logo`}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Dev<span className="text-blue-600">Solve</span>
              </span>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed pr-2">
              {mockFooterData.description}
            </p>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">
              Social Media
            </p>

            <div className="flex items-center gap-2.5">
              {mockFooterData.socials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  {renderSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              {mockFooterData.platformNav.title}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {mockFooterData.platformNav.links.map((link) => (
                <FooterLink key={link.id} item={link} />
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              {mockFooterData.resourcesNav.title}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {mockFooterData.resourcesNav.links.map((link) => (
                <FooterLink key={link.id} item={link} />
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Contact Us
            </h3>

            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-gray-600">
                  {mockFooterData.contact.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <a
                  href={`tel:${mockFooterData.contact.phone.replace(/\s+/g, "")}`}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {mockFooterData.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <a
                  href={`mailto:${mockFooterData.contact.email}`}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {mockFooterData.contact.email}
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
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
            SUPPORTED BY
          </p>

          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            {mockFooterData.sponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center w-full md:w-auto gap-2"
              >
                <img
                  src={sponsor.logoSrc}
                  alt={`${sponsor.name} Logo`}
                  className="h-12 sm:h-14 w-auto object-contain hover:scale-105 transition-transform duration-200"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {currentYear} {mockFooterData.brandName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {mockFooterData.legalNav.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="hover:text-blue-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ item }: { item: NavLinkItem }) {
  return (
    <li>
      <Link
        href={item.href}
        className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
      >
        {item.label}
      </Link>
    </li>
  );
}












