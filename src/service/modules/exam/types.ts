export interface ExamResponse {
  success: boolean;
  message?: string;
  data: ExamData[];
}

export interface ExamData {
  exam_id: number;
  exam_name: string;
  exam_type?: string;
  class_id: number;
  class_name: string;
  subject_name: string;
  open_datetime: string;
  close_datetime: string;
  classroom_id: number;
  exam_file_ids: number[];
  exam_files: ExamFileData[];
  exam_text?: string;
  submitted: boolean;
  submit_id: number | null;
  score: number | null;
  comment: string | null;
}

export interface ExamFileData {
  id: number;
  name: string;
  url: string;
}

export type GetExamParams = Record<string, string>;

export interface SubmitExamResponse {
  success: boolean;
  message?: string;
  data: SubmitExamData;
}

export interface SubmitExamData {
  id: number;
  score: number;
  comment: string;
}

export type SubmitExamError = { success: false; status?: number; message?: string };
