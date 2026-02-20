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
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 rounded-xl p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
        <Stat label="Federal Bills" value={federal} color="blue" />
        <Stat label="California Bills" value={california} color="amber" />
        <Stat label="Signed / Enacted" value={signed} color="green" />
        <Stat label="Active / Pending" value={inProgress} color="orange" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-orange-100">
        <p className="text-xs text-orange-700">
          Tracking legislation related to the{" "}
          <span className="font-semibold">Eaton Fire</span> and California
          wildfire recovery
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {hasLiveData ? (
            <span className="flex items-center gap-1 text-green-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
              Live data
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              Curated data
            </span>
          )}
          {updatedAt && <span className="text-gray-400">· {updatedAt}</span>}
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
  color: "blue" | "amber" | "green" | "orange";
}) {
  const colorMap = {
    blue: "text-blue-600",
    amber: "text-amber-600",
    green: "text-green-600",
    orange: "text-orange-600",
  };
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${colorMap[color]}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}
