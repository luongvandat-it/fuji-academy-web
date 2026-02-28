export type AssignmentStatus = "pending_due" | "submitted" | "graded";

export type AssignmentFilterTab = "all" | "pending" | "completed";

export interface Assignment {
  id: string;
  category: string;
  title: string;
  description?: string;
  status: AssignmentStatus;
  dueDate?: string;
  dueInDays?: number;
  submittedAt?: string;
  score?: number;
  maxScore?: number;
  feedback?: string;
}

export interface AssignmentAttachment {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "file";
  url?: string;
}

export type AssignmentSubmissionType = "file" | "input";

export interface AssignmentDetail extends Assignment {
  submissionType: AssignmentSubmissionType;
  courseName: string;
  tag?: string;
  categoryLabel: string;
  fullDescription: string;
  submissionRequirements: string;
  timeRemainingLabel?: string;
  attachments: AssignmentAttachment[];
  inputLabel?: string;
  inputPlaceholder?: string;
}
