// State Admin command-centre dataset.
//
// Numbers are intentionally non-rounded so the dashboard reads as field
// data rather than seed data. All copy refers to HP Higher Education.

export type RiskBand = "healthy" | "watch" | "critical";

export interface DistrictMetric {
  district: string;
  applications: number;
  verified: number;
  pendingScrutiny: number;
  discrepancies: number;
  seatsSanctioned: number;
  seatsFilled: number;
  femaleApplicants: number;
  ruralApplicants: number;
  governmentCollegeCount: number;
  privateCollegeCount: number;
  slaBreaches: number;
  /** 0–100 — composite enrolment + verification + SLA risk score */
  riskScore: number;
}

export const DISTRICT_METRICS: DistrictMetric[] = [
  {
    district: "Shimla",
    applications: 4862,
    verified: 3914,
    pendingScrutiny: 612,
    discrepancies: 198,
    seatsSanctioned: 5430,
    seatsFilled: 3712,
    femaleApplicants: 2643,
    ruralApplicants: 1971,
    governmentCollegeCount: 22,
    privateCollegeCount: 9,
    slaBreaches: 14,
    riskScore: 28
  },
  {
    district: "Kangra",
    applications: 6418,
    verified: 4860,
    pendingScrutiny: 1041,
    discrepancies: 264,
    seatsSanctioned: 6850,
    seatsFilled: 4521,
    femaleApplicants: 3502,
    ruralApplicants: 4218,
    governmentCollegeCount: 31,
    privateCollegeCount: 18,
    slaBreaches: 22,
    riskScore: 36
  },
  {
    district: "Mandi",
    applications: 4127,
    verified: 3149,
    pendingScrutiny: 678,
    discrepancies: 173,
    seatsSanctioned: 4480,
    seatsFilled: 2914,
    femaleApplicants: 2178,
    ruralApplicants: 2906,
    governmentCollegeCount: 17,
    privateCollegeCount: 6,
    slaBreaches: 11,
    riskScore: 33
  },
  {
    district: "Hamirpur",
    applications: 2683,
    verified: 2104,
    pendingScrutiny: 392,
    discrepancies: 116,
    seatsSanctioned: 2870,
    seatsFilled: 1968,
    femaleApplicants: 1493,
    ruralApplicants: 1812,
    governmentCollegeCount: 11,
    privateCollegeCount: 4,
    slaBreaches: 6,
    riskScore: 24
  },
  {
    district: "Una",
    applications: 2241,
    verified: 1604,
    pendingScrutiny: 437,
    discrepancies: 132,
    seatsSanctioned: 2510,
    seatsFilled: 1502,
    femaleApplicants: 1182,
    ruralApplicants: 1457,
    governmentCollegeCount: 9,
    privateCollegeCount: 3,
    slaBreaches: 9,
    riskScore: 41
  },
  {
    district: "Bilaspur",
    applications: 1762,
    verified: 1351,
    pendingScrutiny: 264,
    discrepancies: 81,
    seatsSanctioned: 1990,
    seatsFilled: 1186,
    femaleApplicants: 941,
    ruralApplicants: 1213,
    governmentCollegeCount: 7,
    privateCollegeCount: 2,
    slaBreaches: 4,
    riskScore: 29
  },
  {
    district: "Solan",
    applications: 3318,
    verified: 2412,
    pendingScrutiny: 612,
    discrepancies: 158,
    seatsSanctioned: 3760,
    seatsFilled: 2284,
    femaleApplicants: 1814,
    ruralApplicants: 1721,
    governmentCollegeCount: 14,
    privateCollegeCount: 11,
    slaBreaches: 8,
    riskScore: 31
  },
  {
    district: "Kullu",
    applications: 2057,
    verified: 1448,
    pendingScrutiny: 419,
    discrepancies: 102,
    seatsSanctioned: 2310,
    seatsFilled: 1376,
    femaleApplicants: 1107,
    ruralApplicants: 1538,
    governmentCollegeCount: 8,
    privateCollegeCount: 4,
    slaBreaches: 7,
    riskScore: 38
  },
  {
    district: "Sirmaur",
    applications: 2492,
    verified: 1581,
    pendingScrutiny: 614,
    discrepancies: 211,
    seatsSanctioned: 2640,
    seatsFilled: 1402,
    femaleApplicants: 1283,
    ruralApplicants: 1819,
    governmentCollegeCount: 10,
    privateCollegeCount: 5,
    slaBreaches: 17,
    riskScore: 64
  },
  {
    district: "Chamba",
    applications: 1583,
    verified: 1014,
    pendingScrutiny: 372,
    discrepancies: 124,
    seatsSanctioned: 1820,
    seatsFilled: 968,
    femaleApplicants: 821,
    ruralApplicants: 1226,
    governmentCollegeCount: 7,
    privateCollegeCount: 1,
    slaBreaches: 12,
    riskScore: 56
  },
  {
    district: "Kinnaur",
    applications: 612,
    verified: 411,
    pendingScrutiny: 138,
    discrepancies: 41,
    seatsSanctioned: 720,
    seatsFilled: 392,
    femaleApplicants: 312,
    ruralApplicants: 502,
    governmentCollegeCount: 4,
    privateCollegeCount: 0,
    slaBreaches: 5,
    riskScore: 47
  },
  {
    district: "Lahaul & Spiti",
    applications: 248,
    verified: 142,
    pendingScrutiny: 76,
    discrepancies: 22,
    seatsSanctioned: 320,
    seatsFilled: 156,
    femaleApplicants: 132,
    ruralApplicants: 224,
    governmentCollegeCount: 3,
    privateCollegeCount: 0,
    slaBreaches: 4,
    riskScore: 71
  }
];

export function riskBand(score: number): RiskBand {
  if (score >= 55) return "critical";
  if (score >= 35) return "watch";
  return "healthy";
}

export interface CourseDemand {
  courseId: "BA" | "BSc" | "BCom" | "BCA" | "BBA" | "BVoc";
  courseName: string;
  applications: number;
  sanctionedSeats: number;
  verified: number;
  /** % seats covered by verified applications */
  fillRate: number;
  /** Applications per sanctioned seat — > 1 = oversubscribed */
  demandIndex: number;
}

export const COURSE_DEMAND: CourseDemand[] = [
  {
    courseId: "BA",
    courseName: "Bachelor of Arts",
    applications: 14823,
    sanctionedSeats: 11240,
    verified: 9461,
    fillRate: 84,
    demandIndex: 1.32
  },
  {
    courseId: "BSc",
    courseName: "Bachelor of Science",
    applications: 9342,
    sanctionedSeats: 6810,
    verified: 5912,
    fillRate: 87,
    demandIndex: 1.37
  },
  {
    courseId: "BCom",
    courseName: "Bachelor of Commerce",
    applications: 6204,
    sanctionedSeats: 4480,
    verified: 3814,
    fillRate: 85,
    demandIndex: 1.38
  },
  {
    courseId: "BCA",
    courseName: "Bachelor of Computer Applications",
    applications: 2486,
    sanctionedSeats: 2160,
    verified: 1622,
    fillRate: 75,
    demandIndex: 1.15
  },
  {
    courseId: "BBA",
    courseName: "Bachelor of Business Administration",
    applications: 1731,
    sanctionedSeats: 1620,
    verified: 1042,
    fillRate: 64,
    demandIndex: 1.07
  },
  {
    courseId: "BVoc",
    courseName: "Bachelor of Vocation",
    applications: 814,
    sanctionedSeats: 1320,
    verified: 421,
    fillRate: 32,
    demandIndex: 0.62
  }
];

export interface WeeklyTrendPoint {
  week: string;
  submitted: number;
  verified: number;
  discrepancies: number;
}

export const WEEKLY_TREND: WeeklyTrendPoint[] = [
  { week: "Wk 1", submitted: 1820, verified: 412, discrepancies: 38 },
  { week: "Wk 2", submitted: 2614, verified: 1184, discrepancies: 91 },
  { week: "Wk 3", submitted: 3142, verified: 2018, discrepancies: 142 },
  { week: "Wk 4", submitted: 4218, verified: 2890, discrepancies: 197 },
  { week: "Wk 5", submitted: 5104, verified: 3742, discrepancies: 248 },
  { week: "Wk 6", submitted: 6021, verified: 4586, discrepancies: 312 },
  { week: "Wk 7", submitted: 6873, verified: 5482, discrepancies: 364 },
  { week: "Wk 8", submitted: 7642, verified: 6213, discrepancies: 411 }
];

export interface ScrutinySLABuckets {
  under24h: number;
  between24And48h: number;
  between48And72h: number;
  over72h: number;
}

export const SCRUTINY_SLA: ScrutinySLABuckets = {
  under24h: 2412,
  between24And48h: 1184,
  between48And72h: 562,
  over72h: 198
};

export interface CategoryShare {
  code: "general" | "obc" | "sc" | "st" | "ews" | "pwd" | "sgc";
  label: string;
  count: number;
}

export const CATEGORY_DISTRIBUTION: CategoryShare[] = [
  { code: "general", label: "General", count: 16842 },
  { code: "obc", label: "OBC", count: 8214 },
  { code: "sc", label: "SC", count: 5142 },
  { code: "st", label: "ST", count: 1864 },
  { code: "ews", label: "EWS", count: 2118 },
  { code: "pwd", label: "PwD", count: 312 },
  { code: "sgc", label: "Single Girl Child", count: 208 }
];

export type AlertSeverity = "critical" | "warning" | "info";

export interface DashboardAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  detail: string;
  scope: string;
  raisedAt: string;
}

export const STATE_ALERTS: DashboardAlert[] = [
  {
    id: "alert-low-verify",
    severity: "critical",
    title: "Lahaul & Spiti verification rate at 38%",
    detail:
      "Only 142 of 248 applications verified. Field coordinator dispatch recommended before merit cut-off.",
    scope: "District · Lahaul & Spiti",
    raisedAt: "1 hour ago"
  },
  {
    id: "alert-sla-sirmaur",
    severity: "warning",
    title: "Sirmaur scrutiny SLA approaching breach",
    detail:
      "17 applications at Government College Nahan pending verification beyond 60 hours.",
    scope: "College · GC Nahan, Sirmaur",
    raisedAt: "2 hours ago"
  },
  {
    id: "alert-vacancy-bvoc",
    severity: "warning",
    title: "BVoc vacancy at 32% utilisation",
    detail:
      "899 of 1,320 sanctioned seats unfilled. Awareness campaign in Kullu and Kangra recommended.",
    scope: "Course · BVoc",
    raisedAt: "5 hours ago"
  },
  {
    id: "alert-cert-cluster",
    severity: "info",
    title: "Category certificate discrepancy cluster — Chamba",
    detail:
      "12 OBC certificates flagged for non-creamy-layer affidavit mismatch. Reviewer SOP refreshed.",
    scope: "District · Chamba",
    raisedAt: "1 day ago"
  },
  {
    id: "alert-circular",
    severity: "info",
    title: "DHE circular 2026/121 — SGC roster amendment",
    detail:
      "Single Girl Child reservation operative this cycle. College admins notified for matrix update.",
    scope: "Statewide",
    raisedAt: "2 days ago"
  }
];

export const STATE_TOTALS = {
  affiliatedColleges: 192,
  governmentColleges: 143,
  privateColleges: 49,
  totalApplications: 32403,
  verified: 25030,
  pendingScrutiny: 5655,
  discrepancies: 1622,
  seatsSanctioned: 35540,
  seatsFilled: 22381,
  femaleShare: 53.4,
  ruralShare: 68.7
};

export const LAST_REFRESHED = "2 minutes ago";
export const FY_LABEL = "FY 2026-27";
