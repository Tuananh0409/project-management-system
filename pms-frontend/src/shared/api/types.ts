export interface ApiErrorBody {
  code: string;
  message: string;
  timestamp?: string;
  fieldErrors?: Record<string, string>;
}
