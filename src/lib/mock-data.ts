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
  { id: "BBA", name: "Bachelor of Business Administration" }
];

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
  "Gaurav"
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
  "Parmar"
];

const STATUSES: ApplicationStatus[] = [
  "submitted",
  "under_scrutiny",
  "discrepancy_raised",
  "verified",
  "conditional",
  "rejected"
];

const CATEGORIES: ReservationCategory[] = [
  "general",
  "general",
  "general",
  "obc",
  "obc",
  "sc",
  "st",
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
  "HP Board of School Education"
];

function pseudoRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function buildSeedApplications(): Application[] {
  const rand = pseudoRandom(1729);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

  const apps: Application[] = [];
  const baseDate = new Date("2026-04-15T09:00:00");

  for (let i = 0; i < 32; i++) {
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    const studentName = `${first} ${last}`;
    const college = pick(COLLEGES);
    const course = pick(COURSES);
    const stream = pick(STREAMS);
    const board = pick(BOARDS);
    const category = pick(CATEGORIES);
    const status = STATUSES[i % STATUSES.length];

    const submittedAt = new Date(
      baseDate.getTime() - Math.floor(rand() * 14) * 24 * 60 * 60 * 1000
    );
    const submittedIso = submittedAt.toISOString();
    const id = `APP-${String(2026000 + i).padStart(7, "0")}`;
    const bestOfFive = 64 + Math.floor(rand() * 30);

    const docs = [
      { type: "marksheet", label: "Class XII Marksheet" },
      { type: "domicile", label: "HP Domicile Certificate" },
      { type: "category", label: "Category Certificate" },
      { type: "photo", label: "Photograph" },
      { type: "id", label: "Photo ID Proof" }
    ].map((d, idx) => {
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
                : "pending";
      return {
        id: `${id}-doc-${idx}`,
        type: d.type,
        label: d.label,
        uploadedAt: submittedIso,
        status: ds,
        remarks:
          ds === "rejected"
            ? "Document is illegible. Please upload a clearer scan."
            : ds === "discrepancy"
              ? "Name on document does not match application form."
              : undefined
      };
    });

    const preferences = COLLEGES.slice(0, 4).map((c, idx) => ({
      rank: idx + 1,
      collegeId: c.id,
      collegeName: c.name,
      courseId: course.id,
      combination:
        course.id === "BA"
          ? "English, Economics, Political Science"
          : course.id === "BSc"
            ? "Physics, Chemistry, Mathematics"
            : course.id === "BCom"
              ? "Accountancy, Business Studies, Economics"
              : course.id === "BCA"
                ? "Computer Science core"
                : "Business Administration core",
      vacantSeats: 12 + Math.floor(rand() * 40)
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
        timestamp: submittedIso
      }
    ];

    if (status === "verified" || status === "conditional") {
      history.push({
        id: `${id}-h3`,
        action: status === "verified" ? "Application verified" : "Conditional accept",
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
        action: "Application rejected",
        actor: college.principal,
        timestamp: new Date(submittedAt.getTime() + 86400000).toISOString()
      });
    }

    const dob = new Date(2007, Math.floor(rand() * 12), 1 + Math.floor(rand() * 27));

    apps.push({
      id,
      applicationNumber: id,
      studentName,
      fatherName: `${pick(["Suresh", "Ramesh", "Mahesh", "Dinesh", "Ajay", "Vinod"])} ${last}`,
      dob: dob.toISOString().slice(0, 10),
      mobile: `+91 9${Math.floor(100000000 + rand() * 899999999)}`.slice(0, 14),
      email: `${first.toLowerCase()}.${last.toLowerCase()}@hpmis.in`,
      address: `${pick(["House 12", "House 48", "Flat 3B", "Ward 5", "Lane 7"])}, ${college.district}, Himachal Pradesh`,
      aadhaarMasked: `XXXX-XXXX-${1000 + Math.floor(rand() * 8999)}`,
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
        rollNumber: `R${1000000 + Math.floor(rand() * 8999999)}`,
        bestOfFive,
        stream
      },
      claims: {
        category,
        domicile: "Himachal Pradesh",
        pwd: rand() < 0.05,
        sgc: rand() < 0.07
      },
      preferences,
      history,
      discrepancyCount:
        status === "discrepancy_raised" ? 1 : status === "conditional" ? 1 : 0,
      discrepancyReason:
        status === "discrepancy_raised"
          ? "Name on Class XII Marksheet does not match application form."
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
