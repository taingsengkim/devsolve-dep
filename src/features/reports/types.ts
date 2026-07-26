export type ReportResponse = {
  id: string;
  title: string;
  vulnerabilityInformation: string;
  impact: string;
  severity: string;
  cvssScore: number;
  weaknessId: string;
  assetType: string;
  state: string;
  disclosureStatus: string;
  weakness: Record<string, unknown>;
  attachments: ReportAttachment[];
  submittedAt: string | null;
  createdAt: string;
};

export type ReportAttachment = {
  [key: string]: unknown;
};
