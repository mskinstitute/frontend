'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  BookOpen,
  Home,
  Video,
  Search,
  Code2,
  PhoneCall,
  MapPin,
  Compass,
  Laptop,
  ChevronDown,
  Award,
  Building2,
  FileText,
  Newspaper,
  Briefcase,
  Keyboard,
} from 'lucide-react';

import InstallAppButton from '@/components/InstallAppButton';
import SearchModal from '@/components/SearchModal';
import { useLiveStatus } from '@/context/LiveStatusContext';
import { SocialIconPills } from '@/components/SocialLinks';

interface Announcement {
  id: string;
  icon: string;
  badge: string;
  text: string;
  active: boolean;
  link?: string;
  startDate?: string;
  endDate?: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const { isLiveNow } = useLiveStatus();

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const res = await fetch('/data/announcements.json');
        if (res.ok) {
          const data = await res.json();
          setAnnouncements(data);
        }
      } catch (err) {
        console.error('Failed to load announcements registry:', err);
      }
    }
    loadAnnouncements();
  }, []);

  // Global keyboard listener for Ctrl + K / Cmd + K to open search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter active announcements within date ranges dynamically
  const todayStr = new Date().toISOString().split('T')[0];
  const activeAnnouncements = announcements.filter(ann => {
    if (!ann.active) return false;
    if (ann.startDate && todayStr < ann.startDate) return false;
    if (ann.endDate && todayStr > ann.endDate) return false;
    return true;
  });

  interface DropdownItem {
    name: string;
    href: string;
    icon: typeof Home;
    description: string;
    badge?: string;
  }

  interface NavDropdown {
    id: string;
    name: string;
    icon: typeof Compass;
    items: DropdownItem[];
  }

  interface DirectLink {
    name: string;
    href: string;
    icon: typeof Home;
    badge?: string;
  }

  const directLinks: DirectLink[] = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Live', href: '/live', icon: Video, badge: isLiveNow ? 'LIVE' : undefined },
  ];

  const dropdownGroups: NavDropdown[] = [
    {
      id: 'explore',
      name: 'Explore',
      icon: Compass,
      items: [
        {
          name: 'Learning Roadmaps',
          href: '/learning-paths',
          icon: Compass,
          description: 'Step-by-step career pathways & tech stacks',
        },
        {
          name: 'Student Projects',
          href: '/projects',
          icon: Laptop,
          description: 'Real-world capstones built by MSK students',
        },
        {
          name: 'Live Batches',
          href: '/live',
          icon: Video,
          badge: isLiveNow ? 'LIVE' : undefined,
          description: 'Interactive batches with mentor doubt sessions',
        },
        {
          name: 'Code Playground',
          href: '/playground',
          icon: Code2,
          badge: 'IDE',
          description: 'Online Python, Web, C++ & SQL code compiler',
        },
        {
          name: 'Study Material Hub',
          href: '/study-material',
          icon: FileText,
          description: 'Free cheatsheets, handbooks & PDF guides',
        },
        {
          name: 'Free Mock Tests',
          href: '/mock-test',
          icon: Award,
          badge: 'NEW',
          description: 'Timed skill tests with scorecard & WhatsApp share',
        },
        {
          name: 'Keyboard Shortcuts',
          href: '/shortcuts',
          icon: Keyboard,
          badge: 'NEW',
          description: 'Software cheatsheets & quick key references',
        },
      ],
    },
    {
      id: 'institute',
      name: 'Institute',
      icon: Building2,
      items: [
        {
          name: 'Branch Locations',
          href: '/locations',
          icon: MapPin,
          description: 'Shikohabad & regional offline training centers',
        },
        {
          name: 'Verify Certificate',
          href: '/verify-certificate',
          icon: Award,
          description: 'Instant student credential & QR verification',
        },
        {
          name: 'Tech Blogs & Insights',
          href: '/blogs',
          icon: Newspaper,
          description: 'Tech articles, tutorials & placement guides',
        },
        {
          name: 'About MSK Institute',
          href: '/about',
          icon: Building2,
          description: 'Our mission, faculty, heritage & track record',
        },
        {
          name: 'Careers at MSK',
          href: '/careers',
          icon: Briefcase,
          description: 'Join our team as trainer or student mentor',
        },
        {
          name: 'Contact & Helpline',
          href: '/contact',
          icon: PhoneCall,
          description: 'Helpline, admissions desk & student inquiry',
        },
      ],
    },
  ];

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // Single active accordion for mobile: starts null so both Explore & Institute start closed
  const [mobileActiveAccordion, setMobileActiveAccordion] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown and mobile menu on route change
  useEffect(() => {
    setOpenDropdown(null);
    setIsOpen(false);
    setMobileActiveAccordion(null);
  }, [pathname]);

  // Lock body & document scroll when mobile menu is open, restore when closed
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalBodyOverflow || '';
        document.documentElement.style.overflow = originalHtmlOverflow || '';
      };
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [isOpen]);

  // Automatically close mobile menu on screen resize to desktop (>=768px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseEnter = (menuId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(menuId);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  };

  const handleDropdownToggle = (menuId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown((prev) => (prev === menuId ? null : menuId));
  };

  const handleToggleMobileMenu = () => {
    setIsOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        // When opening mobile menu, ensure Explore & Institute are BOTH CLOSED initially
        setMobileActiveAccordion(null);
      }
      return nextState;
    });
  };

  const toggleMobileAccordion = (groupId: string) => {
    // If the tapped accordion is already open, close it. Otherwise open it (automatically closes the other).
    setMobileActiveAccordion((prev) => (prev === groupId ? null : groupId));
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const isDropdownActive = (group: NavDropdown) => {
    return group.items.some((item) => isActive(item.href));
  };

  return (
    <header className="sticky top-0 z-50 no-print shadow-sm">
      <nav className="bg-white border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpg"
                alt="MSK Institute Logo"
                width={40}
                height={40}
                fetchPriority="high"
                className="w-10 h-10 object-contain rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200"
              />
              <span className="text-xl font-bold tracking-tight text-primary">
                MSK<span className="text-secondary font-black">.</span>Institute
              </span>
            </Link>
          </div>

          {/* Universal Desktop & Laptop Search Trigger */}
          <div className="hidden md:flex items-center flex-1 max-w-[200px] lg:max-w-[260px] xl:max-w-xs mx-2 lg:mx-4 2xl:mx-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              type="button"
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-text-muted bg-surface hover:bg-slate-100 border border-border-subtle hover:border-slate-300 rounded-xl transition-all shadow-xs cursor-pointer group"
              aria-label="Search resources (Ctrl + K)"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors flex-shrink-0" />
                <span className="font-medium text-slate-500 group-hover:text-slate-800 truncate">
                  <span className="hidden xl:inline">Search courses, material...</span>
                  <span className="xl:hidden">Search...</span>
                </span>
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0 ml-1.5">
                <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-700 bg-white border border-slate-300 rounded shadow-xs group-hover:border-slate-400">
                  Ctrl
                </kbd>
                <span className="text-[10px] font-bold text-slate-400 px-0.5">+</span>
                <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-700 bg-white border border-slate-300 rounded shadow-xs group-hover:border-slate-400">
                  K
                </kbd>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div ref={navRef} className="hidden md:flex items-center gap-0.5 lg:gap-1 xl:gap-2">
            {/* Direct Links (Home, Courses & Live) */}
            {directLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              const isLive = link.badge === 'LIVE';
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-2 py-1.5 lg:px-2.5 lg:py-2 xl:px-3 text-xs lg:text-sm font-medium rounded-md whitespace-nowrap transition-colors duration-150 ${
                    active
                      ? 'text-secondary font-bold border-b-2 border-secondary rounded-none pb-1'
                      : isLive
                      ? 'text-slate-800 hover:text-red-600 hover:bg-red-50/60 font-semibold'
                      : 'text-text-muted hover:text-primary hover:bg-surface'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0 ${isLive && !active ? 'text-red-500' : ''}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="relative flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-extrabold rounded-full uppercase tracking-wider bg-red-100 text-red-600 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
                      <span>{link.badge}</span>
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Dropdown Groups */}
            {dropdownGroups.map((group) => {
              const GroupIcon = group.icon;
              const isOpen = openDropdown === group.id;
              const hasActiveItem = isDropdownActive(group);

              return (
                <div
                  key={group.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(group.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() => handleDropdownToggle(group.id)}
                    aria-expanded={isOpen}
                    className={`relative flex items-center gap-1.5 px-2 py-1.5 lg:px-2.5 lg:py-2 xl:px-3 text-xs lg:text-sm font-medium rounded-md whitespace-nowrap transition-all duration-150 cursor-pointer ${
                      hasActiveItem
                        ? 'text-secondary font-bold border-b-2 border-secondary rounded-none pb-1'
                        : isOpen
                        ? 'text-primary bg-surface font-semibold'
                        : 'text-text-muted hover:text-primary hover:bg-surface'
                    }`}
                  >
                    <GroupIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                    <span>{group.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-secondary' : 'text-text-muted/70'
                      }`}
                    />
                  </button>

                  {/* Desktop Dropdown Panel */}
                  {isOpen && (
                    <div
                      onMouseEnter={() => handleMouseEnter(group.id)}
                      onMouseLeave={handleMouseLeave}
                      className="absolute top-full left-0 mt-1.5 w-80 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto"
                    >
                      <div className="space-y-1">
                        {group.items.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const active = isActive(subItem.href);
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setOpenDropdown(null)}
                              className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-150 group ${
                                active
                                  ? 'bg-orange-50/80 text-secondary'
                                  : 'hover:bg-surface text-slate-800 hover:text-primary'
                              }`}
                            >
                              <div
                                className={`p-2 rounded-xl flex-shrink-0 transition-colors ${
                                  active
                                    ? 'bg-secondary text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-secondary'
                                }`}
                              >
                                <SubIcon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`text-xs lg:text-sm font-semibold truncate ${
                                      active
                                        ? 'text-secondary font-bold'
                                        : 'text-slate-800 group-hover:text-primary'
                                    }`}
                                  >
                                    {subItem.name}
                                  </span>
                                  {subItem.badge && (
                                    <span
                                      className={`relative flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-extrabold rounded-full uppercase tracking-wider ${
                                        subItem.badge === 'LIVE'
                                          ? 'bg-red-100 text-red-600'
                                          : 'bg-orange-100 text-secondary'
                                      }`}
                                    >
                                      {subItem.badge === 'LIVE' && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
                                      )}
                                      <span>{subItem.badge}</span>
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5">
                                  {subItem.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quick Demo CTA Button - Desktop & Tablet */}
            <Link
              href="/#book-demo"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-secondary-light text-white font-bold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap ml-1"
            >
              <span>Book Demo</span>
              <span className="text-[11px]">➔</span>
            </Link>
          </div>

          {/* Mobile top actions: Search icon, Book Demo button & Hamburger */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-md text-text-muted hover:text-primary hover:bg-surface focus:outline-none cursor-pointer"
              aria-label="Search resources"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/#book-demo"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary text-white rounded-full text-xs font-bold shadow-sm hover:bg-secondary-light active:scale-95 transition-all whitespace-nowrap"
              aria-label="Book Demo"
            >
              <span>Book Demo</span>
              <span className="text-[10px]">➔</span>
            </Link>
            <button
              onClick={handleToggleMobileMenu}
              className="p-2 rounded-md text-text-muted hover:text-primary hover:bg-surface focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel (Full-height App Drawer with independent scroll) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-white overflow-y-auto overscroll-contain animate-in fade-in slide-in-from-top-2 duration-200 border-t border-border-subtle shadow-2xl flex flex-col justify-between"
          style={{ height: 'calc(100dvh - 4rem)' }}
        >
          <div className="px-3 pt-3 pb-3 flex-1">
            {/* Search Input Box */}
            <button
              onClick={() => {
                setIsOpen(false);
                setIsSearchOpen(true);
              }}
              type="button"
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm text-text-muted bg-surface hover:bg-slate-100 border border-border-subtle rounded-xl cursor-pointer transition-all"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm truncate">Search courses, materials, blogs...</span>
              </span>
              <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-700 bg-white border border-slate-300 rounded shadow-xs">
                  Ctrl
                </kbd>
                <span className="text-[10px] font-bold text-slate-400 px-0.5">+</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-700 bg-white border border-slate-300 rounded shadow-xs">
                  K
                </kbd>
              </div>
            </button>

            {/* Direct Links */}
            <div className="space-y-1.5 mt-3">
              {directLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                const isLive = link.badge === 'LIVE';
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-secondary/10 text-secondary'
                        : isLive
                        ? 'text-slate-900 hover:bg-red-50/50'
                        : 'text-text-main hover:bg-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isLive && !active ? 'text-red-500' : ''}`} />
                      <span>{link.name}</span>
                    </div>
                    {link.badge && (
                      <span className="relative flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-extrabold rounded-full uppercase tracking-wider bg-red-100 text-red-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
                        <span>{link.badge}</span>
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Accordion Dropdown Groups */}
            <div className="space-y-2 mt-2">
              {dropdownGroups.map((group) => {
                const GroupIcon = group.icon;
                const isExpanded = mobileActiveAccordion === group.id;
                const hasActiveItem = isDropdownActive(group);

                return (
                  <div
                    key={group.id}
                    className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                      isExpanded
                        ? 'border-secondary/40 shadow-xs bg-slate-50/80'
                        : 'border-border-subtle bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleMobileAccordion(group.id)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-primary transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <GroupIcon
                          className={`w-4 h-4 ${
                            hasActiveItem || isExpanded ? 'text-secondary' : 'text-slate-500'
                          }`}
                        />
                        <span className={hasActiveItem || isExpanded ? 'text-secondary font-bold' : ''}>
                          {group.name}
                        </span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-secondary' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-2 pb-2 space-y-1 bg-white pt-1 border-t border-border-subtle/50 animate-in fade-in duration-150">
                        {group.items.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const active = isActive(subItem.href);
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                                active
                                  ? 'bg-orange-50 text-secondary font-bold'
                                  : 'text-text-muted hover:bg-surface hover:text-primary active:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <SubIcon className="w-4 h-4 flex-shrink-0" />
                                <span>{subItem.name}</span>
                              </div>
                              {subItem.badge && (
                                <span
                                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                                    subItem.badge === 'LIVE'
                                      ? 'bg-red-100 text-red-600'
                                      : 'bg-orange-100 text-secondary'
                                  }`}
                                >
                                  {subItem.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Footer CTAs & Admissions Helpline */}
          <div className="p-3 pt-2 pb-safe border-t border-border-subtle bg-slate-50/70 space-y-2">
            <Link
              href="/#book-demo"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-secondary hover:bg-secondary-light text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <span>Book Free Demo Class</span>
              <span>➔</span>
            </Link>

            <InstallAppButton variant="full" />

            <a
              href="tel:+918393042166"
              className="flex items-center justify-center gap-2 py-1 text-xs text-text-muted hover:text-primary transition-colors font-medium"
            >
              <PhoneCall className="w-3.5 h-3.5 text-secondary" />
              <span>Admissions Helpline: +91 83930 42166</span>
            </a>

            {/* Social & Verification Channels */}
            <div className="pt-2 border-t border-border-subtle flex items-center justify-center">
              <SocialIconPills variant="dark" iconSize="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}
      </nav>

      {/* Dynamic Announcement Bar - Only shown on Home Page */}
      {pathname === '/' && activeAnnouncements.length > 0 && (
        <div className="bg-primary text-white py-1 border-b border-border-subtle text-xs font-semibold overflow-hidden relative select-none">
          <div className="whitespace-nowrap flex gap-8 justify-start w-fit animate-marquee hover:[animation-play-state:paused] cursor-pointer">
            {activeAnnouncements.map((ann, idx) => (
              <span key={ann.id} className={`inline-flex items-center gap-2.5 ${idx === 0 ? 'pl-4' : ''}`} >
                <span className="text-sm select-none">{ann.icon}</span>
                <span className="bg-secondary text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm border border-secondary/10">
                  {ann.badge}
                </span>
                <span className="text-gray-100 font-medium tracking-tight">
                  {ann.text}
                </span>
                {ann.link && (
                  <Link 
                    href={ann.link} 
                    className="inline-flex items-center gap-0.5 text-secondary-light hover:text-white underline font-bold tracking-normal transition-colors text-[11px]"
                  >
                    Learn More
                    <span className="text-[10px]">→</span>
                  </Link>
                )}
                <span className="ml-8 text-secondary/35 font-bold select-none">•</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Search Modal Component */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
