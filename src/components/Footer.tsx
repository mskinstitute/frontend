import Link from 'next/link';
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck, Star } from 'lucide-react';
import InstallAppButton from '@/components/InstallAppButton';
import { SocialIconPills, GoogleGIcon } from '@/components/SocialLinks';
import { BUSINESS_CONFIG } from '@/config/business';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white border-t border-primary-light no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-28 md:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Col 1: Brand & Accreditation */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpg"
                alt="MSK Institute Logo"
                width={36}
                height={36}
                loading="lazy"
                className="w-9 h-9 object-contain rounded-lg bg-white shadow-sm group-hover:scale-105 transition-transform"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                MSK<span className="text-secondary font-black">.</span>Institute
              </span>
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              Leading computer training academy in Shikohabad for software engineering, Python, web development, and digital literacy.
            </p>
            <div className="space-y-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-xs font-semibold text-gray-200 border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                ISO 9001:2015 Certified Center
              </div>
              <div>
                <InstallAppButton variant="header" className="!bg-white/10 !text-white !border-white/20 hover:!bg-secondary hover:!border-secondary" />
              </div>
            </div>

            {/* Social Media & Trust Channels */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-secondary">
                Follow & Connect
              </span>
              <SocialIconPills variant="light" />
            </div>
          </div>

          {/* Col 2: Programs & Admissions (Highest Priority for Prospective Students) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider uppercase text-secondary">
              Programs & Admissions
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/courses" className="hover:text-white transition-colors duration-150 flex items-center justify-between group">
                  <span>All Courses</span>
                  <span className="text-[10px] text-gray-400 group-hover:text-secondary transition-colors">Catalog</span>
                </Link>
              </li>
              <li>
                <Link href="/learning-paths" className="hover:text-white transition-colors duration-150 flex items-center justify-between group">
                  <span>Learning Paths</span>
                  <span className="text-[10px] text-gray-400 group-hover:text-secondary transition-colors">Roadmaps</span>
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors duration-150 flex items-center justify-between group">
                  <span>Student Projects</span>
                  <span className="text-[10px] text-gray-400 group-hover:text-secondary transition-colors">Showcase</span>
                </Link>
              </li>
              <li>
                <Link href="/live" className="hover:text-white transition-colors duration-150 flex items-center gap-2">
                  <span>Live Classes & Schedule</span>
                  <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded leading-none uppercase">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/live-batches" className="hover:text-white transition-colors duration-150">
                  Upcoming Batches
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-white transition-colors duration-150 flex items-center gap-2">
                  <span>Campuses & Locations</span>
                  <span className="bg-secondary text-primary text-[10px] font-black px-1.5 py-0.5 rounded leading-none">Hub</span>
                </Link>
              </li>
              <li>
                <Link href="/verify-certificate" className="hover:text-white transition-colors duration-150 flex items-center gap-1.5">
                  <span>Verify Certificates</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors duration-150">
                  Book Free Demo Class
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Tools (Priority for Learners) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider uppercase text-secondary">
              Resources & Tools
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/mock-test" className="hover:text-white transition-colors duration-150 flex items-center gap-2">
                  <span>Free Online Mock Tests</span>
                  <span className="bg-secondary text-primary text-[9px] font-black px-1.5 py-0.5 rounded leading-none uppercase">All Tests</span>
                </Link>
              </li>
              <li>
                <Link href="/mock-test/ccc" className="hover:text-white transition-colors duration-150 flex items-center gap-2">
                  <span>NIELIT CCC Mock Test</span>
                  <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded leading-none uppercase">Free</span>
                </Link>
              </li>
              <li>
                <Link href="/career-finder" className="hover:text-white transition-colors duration-150 flex items-center gap-2">
                  <span>Course & Career Finder</span>
                  <span className="bg-secondary text-white text-[9px] font-bold px-1.5 py-0.5 rounded leading-none">Quiz</span>
                </Link>
              </li>
              <li>
                <Link href="/study-material" className="hover:text-white transition-colors duration-150">
                  Study Material Hub
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-white transition-colors duration-150 flex items-center gap-2">
                  <span>All MSK Tools</span>
                  <span className="bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">Hub</span>
                </Link>
              </li>
              <li>
                <Link href="/shortcuts" className="hover:text-white transition-colors duration-150 flex items-center gap-2">
                  <span>Keyboard Shortcuts</span>
                  <span className="bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">New</span>
                </Link>
              </li>
              <li>
                <Link href="/tools/typing" className="hover:text-white transition-colors duration-150 flex items-center gap-2">
                  <span>TypeQuest Speed Lab</span>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">Typing</span>
                </Link>
              </li>
              <li>
                <Link href="/playground" className="hover:text-white transition-colors duration-150 flex items-center gap-2">
                  <span>MSK Code Playground</span>
                  <span className="bg-emerald-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">Code</span>
                </Link>
              </li>
              <li>
                <Link href="/study-material?type=tutorial" className="hover:text-white transition-colors duration-150">
                  Interactive Tutorials
                </Link>
              </li>
              <li>
                <Link href="/study-material?type=cheatsheet" className="hover:text-white transition-colors duration-150">
                  Quick Cheatsheets
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Institute & Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider uppercase text-secondary">
              Institute & Contact
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors duration-150">
                  About MSK Institute
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors duration-150 flex items-center gap-2">
                  <span>Careers & Internships</span>
                  <span className="bg-secondary text-primary text-[10px] font-black px-1.5 py-0.5 rounded leading-none">Hiring</span>
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-white transition-colors duration-150">
                  Publications & Blogs
                </Link>
              </li>
              <li className="pt-2 border-t border-white/10 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">
                  Gali No. 3, Near Gyan Jyoti School,<br />
                  Shikohabad, UP-283135
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                <a href="tel:+918393042166" className="text-xs hover:text-white transition-colors">
                  +91 83930 42166
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                <a href="mailto:mskshikohabad@gmail.com" className="text-xs hover:text-white transition-colors truncate">
                  mskshikohabad@gmail.com
                </a>
              </li>
              <li className="pt-2">
                <a
                  href={BUSINESS_CONFIG.socialLinks.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-amber-300 font-bold transition-all hover:scale-105"
                  title="Verify 128+ student ratings on Google Reviews"
                >
                  <GoogleGIcon className="w-3.5 h-3.5" />
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-white">4.9 ★</span>
                    <span className="text-gray-300 font-normal">(128+ Google Reviews)</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-secondary ml-0.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal / Policy Bar */}
        <div className="mt-12 pt-8 border-t border-primary-light flex flex-col lg:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2">
            <span>&copy; {currentYear} MSK Institute. All rights reserved.</span>
            <span className="hidden sm:inline text-gray-600">•</span>
            <Link href="/privacy-policy" className="hover:text-secondary transition-colors underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/terms" className="hover:text-secondary transition-colors underline-offset-4 hover:underline">
              Terms of Service
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/disclaimer" className="hover:text-secondary transition-colors underline-offset-4 hover:underline">
              Disclaimer
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/contact" className="hover:text-secondary transition-colors underline-offset-4 hover:underline">
              Contact Us
            </Link>
          </div>
          <p className="text-gray-400 text-center lg:text-right font-medium">
            Shikohabad&apos;s Leading Computer & Coding Academy
          </p>
        </div>
      </div>
    </footer>
  );
}
