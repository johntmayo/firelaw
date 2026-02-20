import { BillStatus } from "@/lib/types";

interface Props {
  status: BillStatus;
  label: string;
}

const STATUS_STYLES: Record<BillStatus, string> = {
  introduced: "bg-blue-100 text-blue-800 border-blue-200",
  in_committee: "bg-yellow-100 text-yellow-800 border-yellow-200",
  passed_chamber: "bg-orange-100 text-orange-800 border-orange-200",
  passed_both: "bg-purple-100 text-purple-800 border-purple-200",
  signed: "bg-green-100 text-green-800 border-green-200",
  enacted: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-gray-100 text-gray-600 border-gray-200",
  vetoed: "bg-red-100 text-red-800 border-red-200",
  proposed: "bg-sky-100 text-sky-800 border-sky-200",
};

const STATUS_DOTS: Record<BillStatus, string> = {
  introduced: "bg-blue-500",
  in_committee: "bg-yellow-500",
  passed_chamber: "bg-orange-500",
  passed_both: "bg-purple-500",
  signed: "bg-green-500",
  enacted: "bg-green-500",
  failed: "bg-gray-400",
  vetoed: "bg-red-500",
  proposed: "bg-sky-500",
};

export default function StatusBadge({ status, label }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[status]}`} />
      {label}
    </span>
  );
}
