import { JobType } from "@/lib/entityUtils";

export const TABLE_LENGTH = 10;

export const menuBarLinks = [
  { imgUrl: "/icons/home.svg",      route: "/",                     label: "Home" },
  { imgUrl: "/icons/document.svg",  route: "/all-documents",            label: "Documents" },

  { imgUrl: "/icons/shield.svg",    route: "/security",     label: "Security, Data & Privacy" },

  { imgUrl: "/icons/help.svg",      route: "/help",                 label: "Help / Support" },
  { imgUrl: "/icons/terms.svg", route: "/terms",                label: "Terms" },
  { imgUrl: "/icons/settings.svg", route: "/settings",                label: "Settings" },
  

]

export const documents = [
  { id: 1,  title: 'Chest X-ray — Aug 2025',        uploaded: '2 hours ago',   status: 'READY' },
  { id: 2,  title: 'CT Abdomen — Jul 2025',         uploaded: '1 day ago',     status: 'PROCESSING' },
  { id: 3,  title: 'Knee MRI — Jun 2025',           uploaded: '3 days ago',    status: 'ERROR' },
  { id: 4,  title: 'Brain MRI — May 2025',          uploaded: '1 week ago',    status: 'READY' },
  { id: 5,  title: 'Lumbar Spine MRI — May 2025',   uploaded: '2 weeks ago',   status: 'READY' },
  { id: 6,  title: 'Chest CT — Apr 2025',           uploaded: '3 weeks ago',   status: 'UPLOADED' },
  { id: 7,  title: 'Pelvis Ultrasound — Apr 2025',  uploaded: '1 month ago',   status: 'READY' },
  { id: 8,  title: 'Mammogram — Mar 2025',          uploaded: '2 months ago',  status: 'READY' },
  { id: 9,  title: 'Shoulder X-ray — Mar 2025',     uploaded: '2 months ago',  status: 'PROCESSING' },
  { id: 10, title: 'Cervical Spine X-ray — Feb 2025', uploaded: '3 months ago', status: 'READY' },
];

export const PROCESSING_ORDER: JobType[] = [
  "sentences",
  "entities",
  "summarize",
]

export const LABELS: Record<JobType, string> = {
  sentences: "Reading document sentences...",
  entities: "Picking out medical terms and measurments...", 
  summarize: "Writing patient friendly summary...",
}

export const UNKNOWN_LABEL = "Working...";