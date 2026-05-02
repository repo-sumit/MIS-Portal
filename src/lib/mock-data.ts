import type {
  Application,
  ApplicationStatus,
  College,
  CourseCode,
  District,
  ReservationCategory
} from "./types";

export const HP_DISTRICTS: District[] = [
  { id: "shimla", name: "Shimla" },
  { id: "kangra", name: "Kangra" },
  { id: "mandi", name: "Mandi" },
  { id: "hamirpur", name: "Hamirpur" },
  { id: "una", name: "Una" },
  { id: "bilaspur", name: "Bilaspur" },
  { id: "solan", name: "Solan" },
  { id: "kullu", name: "Kullu" },
  { id: "sirmaur", name: "Sirmaur" },
  { id: "chamba", name: "Chamba" },
  { id: "kinnaur", name: "Kinnaur" },
  { id: "lahaul-spiti", name: "Lahaul & Spiti" }
];

export const COLLEGES: College[] = [
  {
    id: "gc-sanjauli",
    name: "Government College Sanjauli",
    district: "Shimla",
    type: "Government",
    aisheCode: "C-31412",
    principal: "Dr. Priya Negi"
  },
  {
    id: "rkmv-shimla",
    name: "Rajkiya Kanya Mahavidyalaya, Shimla",
    district: "Shimla",
    type: "Government",
    aisheCode: "C-31418",
    principal: "Dr. Anita Thakur"
  },
  {
    id: "gc-dharamshala",
    name: "Government College Dharamshala",
    district: "Kangra",
    type: "Government",
    aisheCode: "C-31501",
    principal: "Dr. Rakesh Sharma"
  },
  {
    id: "gc-mandi",
    name: "Vallabh Government College, Mandi",
    district: "Mandi",
    type: "Government",
    aisheCode: "C-31602",
    principal: "Dr. Suresh Kumar"
  },
  {
    id: "gc-hamirpur",
    name: "Government College Hamirpur",
    district: "Hamirpur",
    type: "Government",
    aisheCode: "C-31705",
    principal: "Dr. Kavita Verma"
  },
  {
    id: "gc-una",
    name: "Government College Una",
    district: "Una",
    type: "Government",
    aisheCode: "C-31810",
    principal: "Dr. Naresh Pathania"
  },
  {
    id: "gc-solan",
    name: "Government College Solan",
    district: "Solan",
    type: "Government",
    aisheCode: "C-31920",
    principal: "Dr. Meera Chauhan"
  },
  {
    id: "gc-kullu",
    name: "Government College Kullu",
    district: "Kullu",
    type: "Government",
    aisheCode: "C-32011",
    principal: "Dr. Jagdish Thakur"
  },
  {
    id: "gc-nahan",
    name: "Government College Nahan",
    district: "Sirmaur",
    type: "Government",
    aisheCode: "C-32104",
    principal: "Dr. Sunita Kapoor"
  },
  {
    id: "gc-chamba",
    name: "Government College Chamba",
    district: "Chamba",
    type: "Government",
    aisheCode: "C-32208",
    principal: "Dr. Bhupinder Singh"
  }
];

export const COURSES: { id: CourseCode; name: string }[] = [
  { id: "BA", name: "Bachelor of Arts" },
  { id: "BSc", name: "Bachelor of Science" },
  { id: "BCom", name: "Bachelor of Commerce" },
  { id: "BCA", name: "Bachelor of Computer Applications" },
  { id: "BBA", name: "Bachelor of Business Administration" },
  { id: "BVoc", name: "Bachelor of Vocation" }
];

/** Subject combinations per course — used by application preferences and detail. */
export const COURSE_TRACKS: Record<CourseCode, string[]> = {
  BA: [
    "English, Economics, Political Science",
    "History, Hindi, Sociology",
    "Geography, Sanskrit, Public Administration"
  ],
  BSc: [
    "Physics, Chemistry, Mathematics",
    "Botany, Zoology, Chemistry",
    "Mathematics, Statistics, Computer Science"
  ],
  BCom: ["Accountancy, Business Studies, Economics"],
  BCA: ["Computer Science core"],
  BBA: ["Business Administration core"],
  BVoc: ["Hospitality & Tourism", "Software Development", "Retail Management"]
};

const FIRST_NAMES = [
  "Aakash",
  "Rhea",
  "Karan",
  "Divya",
  "Manish",
  "Pooja",
  "Vivek",
  "Neha",
  "Rahul",
  "Anjali",
  "Yashvi",
  "Sahil",
  "Tanya",
  "Aman",
  "Shreya",
  "Rohit",
  "Priyanka",
  "Mohit",
  "Sanya",
  "Vikram",
  "Kritika",
  "Ankur",
  "Ishita",
  "Lokesh",
  "Bhavna",
  "Devansh",
  "Aditi",
  "Naman",
  "Riya",
  "Gaurav",
  "Tarun",
  "Mehak",
  "Harshit",
  "Simran",
  "Yash",
  "Kanika",
  "Saurabh",
  "Nisha",
  "Abhinav",
  "Tisha",
  "Pranav",
  "Khushi",
  "Sandeep",
  "Snehal",
  "Aryan",
  "Tanvi",
  "Gourav",
  "Manvi",
  "Vansh",
  "Ritika",
  "Dhruv",
  "Avani",
  "Nikhil",
  "Mahima",
  "Arjun",
  "Akansha",
  "Chirag",
  "Vidushi",
  "Dev",
  "Kashvi",
  "Yuvraj",
  "Bhumika",
  "Atul",
  "Shruti"
];

const LAST_NAMES = [
  "Sharma",
  "Negi",
  "Thakur",
  "Chauhan",
  "Kashyap",
  "Bhardwaj",
  "Verma",
  "Rana",
  "Pathania",
  "Kapoor",
  "Sood",
  "Mehta",
  "Joshi",
  "Bhatti",
  "Dhiman",
  "Kanwar",
  "Bisht",
  "Rawat",
  "Chand",
  "Parmar",
  "Katoch",
  "Gupta",
  "Singh",
  "Dhaliwal",
  "Sankhyan",
  "Tegta",
  "Pundir",
  "Bragta",
  "Salaria",
  "Jaryal",
  "Lehri",
  "Bhatia",
  "Aggarwal",
  "Kalia"
];

const FATHER_FIRST_NAMES = [
  "Suresh",
  "Ramesh",
  "Mahesh",
  "Dinesh",
  "Ajay",
  "Vinod",
  "Rajesh",
  "Naresh",
  "Anil",
  "Subhash",
  "Vijay",
  "Yogesh",
  "Pankaj",
  "Hari",
  "Mukesh",
  "Ashok"
];

// Status weights used by the seed generator. Keeps the dataset realistic
// (more verified / pending than rejected) and survives refresh because
// the PRNG seed is fixed.
const STATUS_WEIGHTED: ApplicationStatus[] = [
  "verified",
  "verified",
  "verified",
  "verified",
  "verified",
  "verified",
  "verified",
  "verified",
  "verified",
  "verified",
  "verified",
  "verified",
  "submitted",
  "submitted",
  "submitted",
  "submitted",
  "submitted",
  "submitted",
  "submitted",
  "submitted",
  "submitted",
  "submitted",
  "under_scrutiny",
  "under_scrutiny",
  "under_scrutiny",
  "under_scrutiny",
  "under_scrutiny",
  "under_scrutiny",
  "under_scrutiny",
  "discrepancy_raised",
  "discrepancy_raised",
  "discrepancy_raised",
  "discrepancy_raised",
  "discrepancy_raised",
  "conditional",
  "conditional",
  "conditional",
  "conditional",
  "rejected",
  "rejected"
];

const CATEGORY_WEIGHTED: ReservationCategory[] = [
  "general",
  "general",
  "general",
  "general",
  "general",
  "general",
  "obc",
  "obc",
  "obc",
  "obc",
  "sc",
  "sc",
  "sc",
  "st",
  "ews",
  "ews"
];

const STREAMS: ("Science" | "Commerce" | "Arts")[] = [
  "Science",
  "Commerce",
  "Arts"
];

const BOARDS = [
  "HP Board of School Education",
  "CBSE",
  "ICSE",
  "HP Board of School Education",
  "HP Board of School Education"
];

function pseudoRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const DEFAULT_SEED_COUNT = 220;

/**
 * Deterministic seed generator. Same seed → same dataset on every refresh
 * so localStorage rehydrates predictably. Distributes applications evenly
 * across all colleges and courses with a bias towards `gc-sanjauli` so
 * the College Admin demo has a meaningful queue.
 */
export function buildSeedApplications(count: number = DEFAULT_SEED_COUNT): Application[] {
  const rand = pseudoRandom(1729);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

  const apps: Application[] = [];
  const baseDate = new Date("2026-04-22T09:00:00");
  const collegeAnchor = COLLEGES.find((c) => c.id === "gc-sanjauli") ?? COLLEGES[0];

  for (let i = 0; i < count; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 3 + 7) % LAST_NAMES.length];
    const studentName = `${first} ${last}`;

    // Distribute across all colleges, but anchor a quarter to GC Sanjauli
    // so the College Admin demo has at least 50 scoped applications.
    const college =
      i % 4 === 0 ? collegeAnchor : COLLEGES[i % COLLEGES.length];
    const course = COURSES[i % COURSES.length];
    const stream = STREAMS[i % STREAMS.length];
    const board = BOARDS[i % BOARDS.length];
    const category = CATEGORY_WEIGHTED[i % CATEGORY_WEIGHTED.length];
    const status = STATUS_WEIGHTED[i % STATUS_WEIGHTED.length];

    const tracks = COURSE_TRACKS[course.id];
    const combination = tracks[i % tracks.length];

    const daysAgo = (i * 7) % 22;
    const submittedAt = new Date(
      baseDate.getTime() - daysAgo * 24 * 60 * 60 * 1000 - (i % 9) * 3600000
    );
    const submittedIso = submittedAt.toISOString();
    const idNum = 2026000 + i + 1;
    const id = `APP-${String(idNum).padStart(7, "0")}`;
    const bestOfFive = Number((58 + ((i * 13) % 41) + (rand() * 0.9)).toFixed(1));

    const baseDocs = [
      { type: "marksheet", label: "Class XII Marksheet", mime: "application/pdf" as const },
      { type: "domicile", label: "HP Domicile Certificate", mime: "image/jpeg" as const },
      { type: "category", label: "Category Certificate", mime: "image/jpeg" as const },
      { type: "photo", label: "Photograph", mime: "image/jpeg" as const },
      { type: "id", label: "Photo ID Proof", mime: "image/jpeg" as const }
    ];

    const docs = baseDocs.map((d, idx) => {
      const ds: "pending" | "verified" | "rejected" | "discrepancy" =
        status === "verified"
          ? "verified"
          : status === "rejected"
            ? idx === 1
              ? "rejected"
              : "verified"
            : status === "discrepancy_raised" && idx === 0
              ? "discrepancy"
              : status === "conditional" && idx === 1
                ? "discrepancy"
                : status === "under_scrutiny"
                  ? idx <= 1
                    ? "verified"
                    : "pending"
                  : "pending";
      return {
        id: `${id}-doc-${idx}`,
        type: d.type,
        label: d.label,
        uploadedAt: submittedIso,
        status: ds,
        mime: d.mime,
        remarks:
          ds === "rejected"
            ? "Scan is illegible. Re-upload a clearer copy."
            : ds === "discrepancy"
              ? "Name on document does not match the application form."
              : undefined
      };
    });

    // Build a deterministic 4-college preference list — apply college first
    // followed by 3 alternates from the same district where possible.
    const preferenceColleges = [
      college,
      ...COLLEGES.filter((c) => c.id !== college.id).slice(0, 3)
    ];
    const preferences = preferenceColleges.map((c, idx) => ({
      rank: idx + 1,
      collegeId: c.id,
      collegeName: c.name,
      courseId: course.id,
      combination,
      vacantSeats: 8 + ((i * 5 + idx * 11) % 42)
    }));

    const history = [
      {
        id: `${id}-h1`,
        action: "Application submitted",
        actor: studentName,
        timestamp: submittedIso
      },
      {
        id: `${id}-h2`,
        action: "Documents uploaded",
        actor: studentName,
        timestamp: new Date(submittedAt.getTime() + 1800000).toISOString()
      }
    ];

    if (status === "verified" || status === "conditional") {
      history.push({
        id: `${id}-h3`,
        action: status === "verified" ? "Application verified" : "Conditional accept granted",
        actor: college.principal,
        timestamp: new Date(submittedAt.getTime() + 86400000).toISOString()
      });
    }
    if (status === "discrepancy_raised") {
      history.push({
        id: `${id}-h3`,
        action: "Discrepancy raised on Class XII Marksheet",
        actor: college.principal,
        timestamp: new Date(submittedAt.getTime() + 86400000).toISOString()
      });
    }
    if (status === "rejected") {
      history.push({
        id: `${id}-h3`,
        action: "Application rejected after scrutiny",
        actor: college.principal,
        timestamp: new Date(submittedAt.getTime() + 86400000).toISOString()
      });
    }

    const dobYear = 2007 - (i % 2);
    const dob = new Date(dobYear, i % 12, 1 + (i % 27));

    apps.push({
      id,
      applicationNumber: id,
      studentName,
      fatherName: `${FATHER_FIRST_NAMES[(i * 5 + 3) % FATHER_FIRST_NAMES.length]} ${last}`,
      dob: dob.toISOString().slice(0, 10),
      mobile: `+91 9${String(700000000 + (i * 7919) % 299999999).padStart(9, "0")}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@hpmis.in`,
      address: `${pick(["House 12", "House 48", "Flat 3B", "Ward 5", "Lane 7", "Block C", "Mohalla 4"])}, ${college.district}, Himachal Pradesh`,
      aadhaarMasked: `XXXX-XXXX-${1000 + (i * 977) % 8999}`,
      district: college.district,
      collegeId: college.id,
      collegeName: college.name,
      courseId: course.id,
      courseName: course.name,
      category,
      status,
      submittedAt: submittedIso,
      documents: docs,
      academicDetails: {
        board,
        yearOfPassing: 2026,
        rollNumber: `R${1000000 + (i * 1031) % 8999999}`,
        bestOfFive,
        stream
      },
      claims: {
        category,
        domicile: "Himachal Pradesh",
        pwd: i % 23 === 0,
        sgc: i % 19 === 0 && category !== "general"
      },
      preferences,
      history,
      discrepancyCount:
        status === "discrepancy_raised" ? 1 : status === "conditional" ? 1 : 0,
      discrepancyReason:
        status === "discrepancy_raised"
          ? "Name on Class XII Marksheet does not match the application form."
          : undefined
    });
  }

  return apps;
}

export const SEAT_MATRIX = [
  {
    course: "BA — English, Economics, Political Science",
    sanctioned: 120,
    GEN: 60,
    OBC: 32,
    SC: 18,
    ST: 4,
    EWS: 12,
    PwD: 4,
    SGC: 0
  },
  {
    course: "BA — History, Hindi, Sociology",
    sanctioned: 100,
    GEN: 50,
    OBC: 27,
    SC: 15,
    ST: 4,
    EWS: 10,
    PwD: 3,
    SGC: 0
  },
  {
    course: "BSc — Physics, Chemistry, Mathematics",
    sanctioned: 80,
    GEN: 40,
    OBC: 22,
    SC: 12,
    ST: 4,
    EWS: 8,
    PwD: 2,
    SGC: 0
  },
  {
    course: "BSc — Botany, Zoology, Chemistry",
    sanctioned: 60,
    GEN: 30,
    OBC: 16,
    SC: 9,
    ST: 3,
    EWS: 6,
    PwD: 1,
    SGC: 0
  },
  {
    course: "BCom",
    sanctioned: 90,
    GEN: 45,
    OBC: 24,
    SC: 14,
    ST: 3,
    EWS: 9,
    PwD: 2,
    SGC: 0
  },
  {
    course: "BCA",
    sanctioned: 60,
    GEN: 30,
    OBC: 16,
    SC: 9,
    ST: 2,
    EWS: 6,
    PwD: 1,
    SGC: 0
  },
  {
    course: "BBA",
    sanctioned: 60,
    GEN: 30,
    OBC: 16,
    SC: 9,
    ST: 2,
    EWS: 6,
    PwD: 1,
    SGC: 0
  }
];

export const POLICY_ALERTS = [
  {
    id: "alert-1",
    severity: "warning" as const,
    title: "Sirmaur scrutiny SLA approaching breach",
    detail:
      "12 applications at Government College Nahan have been pending verification for over 60 hours.",
    timeAgo: "12 minutes ago"
  },
  {
    id: "alert-2",
    severity: "info" as const,
    title: "Merit publication window opens 18 May 2026",
    detail:
      "All college admins are advised to clear the verification backlog by 16 May 2026, 6:00 PM.",
    timeAgo: "2 hours ago"
  },
  {
    id: "alert-3",
    severity: "danger" as const,
    title: "Lahaul & Spiti verification rate below 40%",
    detail:
      "Only 38% of submitted applications have been verified in the district. Field coordination required.",
    timeAgo: "3 hours ago"
  },
  {
    id: "alert-4",
    severity: "info" as const,
    title: "Reservation roster amended for SGC category",
    detail:
      "Department circular DHE/2026/121 dated 28 April 2026 — applicable from current cycle.",
    timeAgo: "1 day ago"
  }
];
