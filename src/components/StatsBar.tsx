import { Bill } from "@/lib/types";

interface Props {
  bills: Bill[];
  hasLiveData: boolean;
  lastUpdated: string;
}

export default function StatsBar({ bills, hasLiveData, lastUpdated }: Props) {
  const federal = bills.filter((b) => b.source === "federal").length;
  const california = bills.filter((b) => b.source === "california").length;
  const signed = bills.filter(
    (b) => b.status === "signed" || b.status === "enacted"
  ).length;
  const inProgress = bills.filter(
    (b) => b.status === "introduced" || b.status === "in_committee" || b.status === "proposed"
  ).length;

  const updatedAt = lastUpdated
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(lastUpdated))
    : null;

  return (
    <div className="bg-white border border-[#E8E2D8] rounded-xl p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
        <Stat label="Federal Bills" value={federal} color="#81BDC3" />
        <Stat label="California Bills" value={california} color="#BC455A" />
        <Stat label="Signed / Enacted" value={signed} color="#AFC892" />
        <Stat label="Active / Pending" value={inProgress} color="#304059" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#F2EDE4]">
        <p className="text-xs text-[#6B6055]">
          Tracking legislation related to the{" "}
          <span className="font-semibold text-[#304059]">Eaton Fire</span> and California
          wildfire recovery
        </p>
        <div className="flex items-center gap-2 text-xs">
          {hasLiveData ? (
            <span className="flex items-center gap-1 text-[#4A6630]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AFC892] animate-pulse inline-block" />
              Live data
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[#6B6055]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8C0B4] inline-block" />
              Curated data
            </span>
          )}
          {updatedAt && <span className="text-[#B8B0A8]">· {updatedAt}</span>}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-xs text-[#9B9488] mt-0.5">{label}</div>
    </div>
  );
}
