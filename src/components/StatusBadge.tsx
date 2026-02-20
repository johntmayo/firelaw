import { BillStatus } from "@/lib/types";

interface Props {
  status: BillStatus;
  label: string;
}

const STATUS_STYLES: Record<BillStatus, string> = {
  introduced:      "bg-[#F9D6D3] text-[#7A3030] border-[#EDB9B4]",
  in_committee:    "bg-[#D8EFF1] text-[#2E6B72] border-[#B3D8DC]",
  passed_chamber:  "bg-[#F6E8D0] text-[#7A5020] border-[#E8CA9E]",
  passed_both:     "bg-[#E3EDD9] text-[#4A6630] border-[#C0D4A6]",
  signed:          "bg-[#E3EDD9] text-[#4A6630] border-[#C0D4A6]",
  enacted:         "bg-[#E3EDD9] text-[#4A6630] border-[#C0D4A6]",
  failed:          "bg-[#EAE6E0] text-[#6B6055] border-[#D4CFC7]",
  vetoed:          "bg-[#F0D8DB] text-[#7A2838] border-[#DEB8BE]",
  proposed:        "bg-[#D8EFF1] text-[#2E6B72] border-[#B3D8DC]",
};

const STATUS_DOTS: Record<BillStatus, string> = {
  introduced:      "bg-[#BC455A]",
  in_committee:    "bg-[#81BDC3]",
  passed_chamber:  "bg-[#E8A84A]",
  passed_both:     "bg-[#AFC892]",
  signed:          "bg-[#AFC892]",
  enacted:         "bg-[#AFC892]",
  failed:          "bg-[#C8C0B4]",
  vetoed:          "bg-[#BC455A]",
  proposed:        "bg-[#81BDC3]",
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
