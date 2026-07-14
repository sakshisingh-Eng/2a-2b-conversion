export interface JobStats {
  invoices_processed: number;
  lookups_completed: number;
  cache_hits: number;
  cache_misses: number;
  valid_invoices: number;
  invalid_invoices: number;
  total_unique_gstins: number;
  validation_errors_count: number;
  lookup_failures_count: number;
}

export interface ValidationError {
  row: number;
  invoice: string;
  gstin: string;
  error: string;
}

export interface JobStatus {
  type: '2a' | '2b' | 'both';
  status: 'queued' | 'running' | 'completed' | 'failed';
  step: string;
  progress: number;
  stats_2a: JobStats;
  stats_2b: JobStats;
  logs: string[];
  logs_count?: number;
  errors_2a: ValidationError[];
  errors_2b: ValidationError[];
  output_file_2a: string | null;
  output_file_2b: string | null;
  log_file: string | null;
  error_report_file_2a: string | null;
  error_report_file_2b: string | null;
  elapsed_time: number;
  eta?: string;
}

export interface HistoricalRun {
  job_id: string;
  date: string;
  type: '2A' | '2B' | 'BOTH';
  input_file: string;
  output_file_2a: string | null;
  output_file_2b: string | null;
  log_file: string;
  error_report_file_2a: string | null;
  error_report_file_2b: string | null;
  processing_time: string;
  status: 'completed' | 'failed';
  stats_2a: JobStats | null;
  stats_2b: JobStats | null;
}

export interface ConversionSettings {
  outputFileName: string;
  enableLookup: boolean;
  enableValidation: boolean;
  enableErrorSheet: boolean;
  overwriteExisting: boolean;
}
