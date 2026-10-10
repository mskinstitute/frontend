import { CheckCircle2, ShieldCheck, Cpu, Wifi, BookOpen, Clock, Users, Laptop } from 'lucide-react';
import { Branch } from '@/types';

interface BranchFacilitiesProps {
  branch: Branch;
}

const FACILITY_ICONS: Record<string, React.ElementType> = {
  lab: Laptop,
  wifi: Wifi,
  internet: Wifi,
  doubt: Users,
  practice: Cpu,
  library: BookOpen,
  speed: Clock,
  backup: ShieldCheck,
};

function getFacilityIcon(text: string) {
  const lower = text.toLowerCase();
  for (const [key, Icon] of Object.entries(FACILITY_ICONS)) {
    if (lower.includes(key)) return Icon;
  }
  return CheckCircle2;
}

export default function BranchFacilities({ branch }: BranchFacilitiesProps) {
  if (!branch.facilities || branch.facilities.length === 0) return null;

  return (
    <section className="py-16 bg-surface border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-secondary text-xs font-bold uppercase tracking-wider">
            Modern Infrastructure
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-1">
            Campus Facilities at {branch.name}
          </h2>
          <p className="text-sm text-text-secondary mt-2">
            Engineered specifically for software education with individual high-speed workstations, uninterrupted power, and instructor-led code review setups.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {branch.facilities.map((facility, index) => {
            const Icon = getFacilityIcon(facility);
            return (
              <div
                key={index}
                className="bg-background-alt p-5 rounded-2xl border border-border-subtle flex items-start gap-3 hover:border-secondary/40 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">{facility}</h3>
                  <p className="text-[11px] text-text-muted mt-0.5">Verified campus amenity</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
