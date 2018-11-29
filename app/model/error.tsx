export interface CommonError {
  errors: MappedError[] | null;
  exception: string;
  message: string;
  path: string;
  reason: string;
  status: number;
  timestamp: string; // ISO 8601 with Z
}

interface MappedError {
  codes: string[];
  arguments: any[];
  defaultMessage: string;
  objectName: string;
  field: string;
  rejectedValue: string;
  bindingFailure: boolean;
  code: string;
}
