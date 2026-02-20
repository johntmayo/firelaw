import { BillTopic } from "@/lib/types";

interface Props {
  topic: BillTopic;
}

const TOPIC_LABELS: Record<BillTopic, string> = {
  wildfire_recovery: "Wildfire Recovery",
  insurance: "Insurance",
  fema: "FEMA / Federal Aid",
  disaster_relief: "Disaster Relief",
  rebuilding: "Rebuilding",
  utilities: "Utilities",
  evacuation: "Evacuation",
  debris_removal: "Debris Removal",
  housing: "Housing",
  environment: "Environment",
  public_safety: "Public Safety",
};

const TOPIC_COLORS: Record<BillTopic, string> = {
  wildfire_recovery: "bg-red-50 text-red-700",
  insurance: "bg-indigo-50 text-indigo-700",
  fema: "bg-blue-50 text-blue-700",
  disaster_relief: "bg-orange-50 text-orange-700",
  rebuilding: "bg-amber-50 text-amber-700",
  utilities: "bg-teal-50 text-teal-700",
  evacuation: "bg-rose-50 text-rose-700",
  debris_removal: "bg-stone-100 text-stone-700",
  housing: "bg-emerald-50 text-emerald-700",
  environment: "bg-green-50 text-green-700",
  public_safety: "bg-purple-50 text-purple-700",
};

export default function TopicTag({ topic }: Props) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${TOPIC_COLORS[topic]}`}
    >
      {TOPIC_LABELS[topic]}
    </span>
  );
}
