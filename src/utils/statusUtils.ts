// src/utils/statusUtils.ts
export const getStatusClass = (status: string): string => {
  switch (status) {
    case 'In-process':
      return 'status-in-process';
    case 'Need to start':
      return 'status-need-to-start';
    case 'Complete':
      return 'status-complete';
    case 'Blocked':
      return 'status-blocked';
    default:
      return 'status-default';
  }
};

export const getPriorityClass = (priority: string): string => {
  switch (priority) {
    case 'High':
      return 'priority-high';
    case 'Medium':
      return 'priority-medium';
    case 'Low':
      return 'priority-low';
    default:
      return 'priority-default';
  }
};