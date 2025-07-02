import React, { useState, useEffect } from 'react';
import './spreadsheet.css';

interface JobRequest {
  id: number;
  jobRequest: string;
  submitted: string;
  status: string;
  submitter: string;
  url: string;
  assigned: string;
  priority: string;
  dueDate: string;
  estValue: string;
}

const RecordView: React.FC = () => {
  const [record, setRecord] = useState<JobRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sample data (in a real app, this could come from a shared context, API, or props)
  const data: JobRequest[] = [
    { id: 1, jobRequest: 'Project A', submitted: '2025-06-15', status: 'In-process', submitter: 'User1', url: 'http://example.com', assigned: 'John Doe', priority: 'High', dueDate: '2025-07-10', estValue: '$5,000' },
    { id: 2, jobRequest: 'Project B', submitted: '2025-06-20', status: 'Need to start', submitter: 'User2', url: 'http://example2.com', assigned: 'Jane Smith', priority: 'Medium', dueDate: '2025-07-15', estValue: '$3,000' },
    { id: 3, jobRequest: 'Project C', submitted: '2025-06-25', status: 'Complete', submitter: 'User3', url: 'http://example3.com', assigned: 'Bob Johnson', priority: 'Low', dueDate: '2025-07-20', estValue: '$1,000' },
    { id: 4, jobRequest: 'Project D', submitted: '2025-06-30', status: 'Blocked', submitter: 'User4', url: 'http://example4.com', assigned: 'Alice Brown', priority: 'High', dueDate: '2025-07-25', estValue: '$2,000' },
  ];

  const getStatusClass = (status: string): string => {
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rowIndex = parseInt(params.get('rowIndex') || '0', 10);

    if (isNaN(rowIndex) || rowIndex < 0 || rowIndex >= data.length) {
      setError('Invalid or missing record index.');
      console.log('Invalid rowIndex:', rowIndex);
      return;
    }

    setRecord(data[rowIndex]);
    console.log('Loaded record:', data[rowIndex]);
  }, []);

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <h2 className="card-title">Error</h2>
          <p>{error}</p>
          <a href="/" className="toolbar-button">Back to Dashboard</a>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="container">
        <div className="card">
          <h2 className="card-title">Loading...</h2>
        </div>
      </div>
    );
  }

  const visibleColumns = ['jobRequest', 'submitted', 'status', 'submitter', 'url', 'assigned', 'priority', 'dueDate', 'estValue'];

  return (
    <div className="container">
      <div className="card">
        <h2 className="card-title">{record.jobRequest}</h2>
        <div className="cell-view-container" role="region" aria-label="Record View">
          <div className="cell-view-card">
            {visibleColumns.map((column) => (
              <div key={column} className="cell-view-field">
                <strong>{column.charAt(0).toUpperCase() + column.slice(1).replace('estValue', 'Est. Value')}:</strong>{' '}
                {column === 'status' ? (
                  <span className={`status-pill ${getStatusClass(record[column as keyof JobRequest] as string)}`}>
                    {record[column as keyof JobRequest]}
                  </span>
                ) : column === 'url' ? (
                  <a
                    href={record[column as keyof JobRequest] as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="url-link"
                  >
                    {record[column as keyof JobRequest]}
                  </a>
                ) : (
                  record[column as keyof JobRequest]
                )}
              </div>
            ))}
          </div>
        </div>
        <a href="/" className="toolbar-button">Back to Dashboard</a>
      </div>
    </div>
  );
};

export default RecordView;