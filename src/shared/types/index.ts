// Shared common types
export type ID = string;

export interface AuditLog {
  id: ID;
  userId: ID;
  action: string;
  timestamp: string;
  details?: string;
}
