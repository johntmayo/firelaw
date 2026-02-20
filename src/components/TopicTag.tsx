import { BillTopic } from "@/lib/types";

interface Props {
  topic: BillTopic;
}

const TOPIC_LABELS: Record<BillTopic, string> = {
  wildfire_recovery: "Wildfire Recovery",
  insurance:         "Insurance",
  fema:              "FEMA / Federal Aid",
  disaster_relief:   "Disaster Relief",
  rebuilding:        "Rebuilding",
  utilities:         "Utilities",
  evacuation:        "Evacuation",
  debris_removal:    "Debris Removal",
  housing:           "Housing",
  environment:       "Environment",
  public_safety:     "Public Safety",
};

export default function TopicTag({ topic }: Props) {
  return (
    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[#F2EDE4] text-[#4A3F35] border border-[#DDD6C8]">
      {TOPIC_LABELS[topic]}
    </span>
  );
}
