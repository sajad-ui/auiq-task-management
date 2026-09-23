export type OrgLevel = 'presidency' | 'department' | 'division' | 'unit' | 'college';

export type Priority = 'high_urgent' | 'urgent' | 'normal';

export type TaskStatus = 'new' | 'in_progress' | 'pending_approval' | 'completed' | 'deferred';

export type DirectiveType = 'وزاري' | 'رئاسي' | 'مجلس_الجامعة' | 'متابعة_دورية' | 'عاجل_وسري';

export interface OrgNode {
  id: string;
  name: string;
  level: OrgLevel;
  parentId?: string;
  category: 'presidency' | 'administrative' | 'scientific' | 'colleges' | 'direct_presidency';
  code: string;
  headTitle?: string;
  headName?: string;
  email?: string;
  phoneExtension?: string;
  location?: string;
  description?: string;
  taskCount?: number;
}

export interface TaskComment {
  id: string;
  author: string;
  role: string;
  text: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface Task {
  id: string;
  code: string; // e.g. AUIQ-2026-081
  title: string;
  description: string;
  directiveType: DirectiveType;
  officialRefNumber: string; // رقم الكتاب الرسمي أو الأمر الرئاسي
  targetNodeId: string;
  targetNodeName: string;
  targetNodeLevel: OrgLevel;
  priority: Priority;
  status: TaskStatus;
  progress: number; // 0 to 100
  dueDate: string;
  createdAt: string;
  createdBy: string;
  assignedOfficer: string;
  instructions: string;
  notes?: string;
  comments: TaskComment[];
  attachments: TaskAttachment[];
  confidential?: boolean;
}
