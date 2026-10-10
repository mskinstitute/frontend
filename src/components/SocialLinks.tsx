import React from 'react';
import { 
  Youtube, 
  Instagram, 
  Linkedin, 
  Facebook, 
  Github, 
  ExternalLink,
  Star,
  CheckCircle2,
  Users,
  Send
} from 'lucide-react';
import socialRegistry from '../../public/data/social-links.json';

// Custom WhatsApp SVG Icon for exact brand identity
export function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413Z"/>
    </svg>
  );
}

// Google "G" Icon
export function GoogleGIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export interface SocialChannel {
  id: string;
  name: string;
  handle: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  hoverBg: string;
  badge: string;
  followers?: string;
  description: string;
  enabled: boolean;
}

// Icon component lookup map
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  youtube: Youtube,
  instagram: Instagram,
  linkedin: Linkedin,
  whatsapp: WhatsAppIcon,
  github: Github,
  facebook: Facebook,
  telegram: Send,
};

// Hover color class lookup map
const HOVER_BG_MAP: Record<string, string> = {
  youtube: 'hover:bg-red-600 hover:text-white hover:border-red-600',
  instagram: 'hover:bg-linear-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white hover:border-pink-600',
  linkedin: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]',
  whatsapp: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]',
  github: 'hover:bg-slate-900 hover:text-white hover:border-slate-900',
  facebook: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
  telegram: 'hover:bg-[#229ED9] hover:text-white hover:border-[#229ED9]',
};

/**
 * Dynamically resolves all active channels directly from public/data/social-links.json
 */
export function getActiveSocialChannels(): SocialChannel[] {
  return socialRegistry.channels
    .filter((channel) => channel.enabled !== false)
    .map((channel) => ({
      id: channel.id,
      name: channel.name,
      handle: channel.handle,
      url: channel.url,
      icon: ICON_MAP[channel.id] || Send,
      color: channel.color || '#2563EB',
      hoverBg: HOVER_BG_MAP[channel.id] || 'hover:bg-secondary hover:text-white',
      badge: channel.badge,
      followers: channel.followers,
      description: channel.description,
      enabled: channel.enabled,
    }));
}

/**
 * Compact Icon Pill Row for Footers, Navbars & Cards
 */
export function SocialIconPills({ 
  className = '',
  iconSize = 'w-4 h-4',
  variant = 'light' // 'light' for dark footers, 'dark' for white surfaces
}: { 
  className?: string;
  iconSize?: string;
  variant?: 'light' | 'dark';
}) {
  const activeChannels = getActiveSocialChannels();
  const mapsUrl = socialRegistry.googleReviews?.mapsUrl || 'https://maps.google.com/?q=MSK+Institute+Shikohabad';
  const rating = socialRegistry.googleReviews?.rating || '4.9';

  return (
    <div className={`flex items-center flex-wrap gap-2 ${className}`}>
      {activeChannels.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${item.name} (${item.handle}) - ${item.description}`}
            aria-label={`Visit MSK Institute on ${item.name}`}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 border ${
              variant === 'light'
                ? 'bg-white/10 text-white/90 border-white/15 hover:scale-110 ' + item.hoverBg
                : 'bg-surface text-primary border-border-subtle hover:scale-110 ' + item.hoverBg
            }`}
          >
            <Icon className={iconSize} />
          </a>
        );
      })}

      {/* Google Maps Reviews Button */}
      {socialRegistry.googleReviews?.enabled !== false && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`MSK Institute on Google Maps (${rating} ★ Rating)`}
          aria-label="View MSK Institute Reviews on Google Maps"
          className={`px-2.5 h-8 rounded-lg flex items-center gap-1.5 transition-all duration-200 border text-xs font-bold ${
            variant === 'light'
              ? 'bg-white/10 text-white/90 border-white/15 hover:bg-white hover:text-primary hover:scale-105'
              : 'bg-surface text-primary border-border-subtle hover:bg-white hover:border-secondary hover:scale-105'
          }`}
        >
          <GoogleGIcon className="w-3.5 h-3.5" />
          <span className="flex items-center gap-0.5 text-amber-400">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{rating}</span>
          </span>
        </a>
      )}
    </div>
  );
}

/**
 * Trust & Credibility Google Rating Badge
 */
export function GoogleRatingTrustBadge({ className = '' }: { className?: string }) {
  const mapsUrl = socialRegistry.googleReviews?.mapsUrl || 'https://maps.google.com/?q=MSK+Institute+Shikohabad';
  const rating = socialRegistry.googleReviews?.rating || '4.9';
  const reviewCount = socialRegistry.googleReviews?.reviewCount || '128+';

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 p-3 bg-white rounded-2xl border border-border-subtle shadow-xs hover:shadow-md hover:border-amber-400 transition-all group ${className}`}
      title={`Verify ${reviewCount} student ratings on Google Reviews`}
    >
      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
        <GoogleGIcon className="w-5 h-5" />
      </div>
      <div className="space-y-0.5 text-left">
        <div className="flex items-center gap-1">
          <span className="text-xs font-extrabold text-primary">Google Verified</span>
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-xs font-black text-primary">{rating} / 5.0</span>
        </div>
        <p className="text-[11px] text-text-muted">
          Based on <strong className="text-primary">{reviewCount} student reviews</strong> in Shikohabad
        </p>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all ml-auto" />
    </a>
  );
}

/**
 * Rich Community Cards Grid for Homepage & Contact Pages
 */
export function SocialCommunitySection({
  title = 'Connect with MSK Institute on Official Social Media',
  subtitle = 'Follow our active student community, watch free tutorials, see campus lab moments, and stay updated on tech placements.',
}: {
  title?: string;
  subtitle?: string;
}) {
  const activeChannels = getActiveSocialChannels();

  return (
    <section className="bg-surface/50 rounded-3xl border border-border-subtle p-6 sm:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold tracking-wider bg-secondary/10 text-secondary uppercase">
            <Users className="w-3.5 h-3.5" />
            Active Student Community
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Google Trust Badge on Right */}
        <div className="shrink-0">
          <GoogleRatingTrustBadge />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeChannels.map((channel) => {
          const Icon = channel.icon;
          return (
            <div
              key={channel.id}
              className="bg-white rounded-2xl border border-border-subtle p-5 flex flex-col justify-between hover:shadow-md hover:border-secondary/40 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-primary group-hover:text-secondary transition-colors" />
                  </div>
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary">
                    {channel.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-extrabold text-primary group-hover:text-secondary transition-colors">
                      {channel.name}
                    </h3>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                    {channel.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-border-subtle/70 flex items-center justify-between">
                <span className="text-[11px] font-bold text-text-muted">
                  {channel.followers}
                </span>
                <a
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:text-secondary-light group-hover:translate-x-0.5 transition-all"
                >
                  <span>Connect</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
