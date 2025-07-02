import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './spreadsheet.css';
import NewAction from './Newaction';

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

const RecordView: React.FC<{ job: JobRequest; onBack: () => void }> = ({ job, onBack }) => {
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'In-process': return 'status-in-process';
      case 'Need to start': return 'status-need-to-start';
      case 'Complete': return 'status-complete';
      case 'Blocked': return 'status-blocked';
      default: return 'status-default';
    }
  };

  const getPriorityClass = (priority: string): string => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'priority-default';
    }
  };

  return (
    <div className="record-view">
      <button className="back-button" onClick={onBack}>Back to Table</button>
      <h2 className="record-title">Job Request Details</h2>
      <div className="record-details">
        {Object.entries(job).map(([key, value]) => (
          <div key={key} className="record-field">
            <strong>{key.charAt(0).toUpperCase() + key.slice(1).replace('estValue', 'Est. Value')}:</strong>
            {key === 'url' && value ? (
              <a href={value} target="_blank" rel="noopener noreferrer" className="url-link">{value}</a>
            ) : key === 'status' ? (
              <span className={`status-pill ${getStatusClass(value as string)}`}>{value}</span>
            ) : key === 'priority' ? (
              <span className={`priority-pill ${getPriorityClass(value as string)}`}>{value}</span>
            ) : (
              value || 'N/A'
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Spreadsheet: React.FC = () => {
  const [data, setData] = useState<JobRequest[]>([
    { id: 1, jobRequest: 'Project A', submitted: '2025-06-15', status: 'In-process', submitter: 'User1', url: 'http://example.com', assigned: 'John Doe', priority: 'High', dueDate: '2025-07-10', estValue: '$5,000' },
    { id: 2, jobRequest: 'Project B', submitted: '2025-06-20', status: 'Need to start', submitter: 'User2', url: 'http://example2.com', assigned: 'Jane Smith', priority: 'Medium', dueDate: '2025-07-15', estValue: '$3,000' },
    { id: 3, jobRequest: 'Project C', submitted: '2025-06-25', status: 'Complete', submitter: 'User3', url: 'http://example3.com', assigned: 'Bob Johnson', priority: 'Low', dueDate: '2025-07-20', estValue: '$1,000' },
    { id: 4, jobRequest: 'Project D', submitted: '2025-06-30', status: 'Blocked', submitter: 'User4', url: 'http://example4.com', assigned: 'Alice Brown', priority: 'High', dueDate: '2025-07-25', estValue: '$2,000' },
  ]);
  const [workingData, setWorkingData] = useState<JobRequest[]>([...data]);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [filterMode, setFilterMode] = useState<'status' | 'priority' | null>(null);
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showNewActionForm, setShowNewActionForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5173';
  const profile = {
    name: 'Sumit Singh',
    imageUrl: 'https://via.placeholder.com/40',
    email: 'sumit.singh@example.com',
    role: 'Admin',
    joinedDate: '2024-01-15',
    contact: '+1-234-567-890',
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search') || '';
    const mode = params.get('filterMode') as 'status' | 'priority' | null;
    const value = params.get('filterValue') || null;
    const rowIndex = params.get('rowIndex');

    setSearchTerm(search);
    if (mode && (mode === 'status' || mode === 'priority') && value) {
      setFilterMode(mode);
      setFilterValue(value);
    }
    if (rowIndex && !isNaN(parseInt(rowIndex)) && parseInt(rowIndex) < data.length) {
      setSelectedRowIndex(parseInt(rowIndex));
    }

    let filteredData = [...data];
    if (search) {
      filteredData = filteredData.filter(item =>
        item.jobRequest.toLowerCase().includes(search.toLowerCase()) ||
        item.submitter.toLowerCase().includes(search.toLowerCase()) ||
        item.assigned.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (mode && value) {
      filteredData = filteredData.filter(item =>
        (mode === 'status' && item.status === value) ||
        (mode === 'priority' && item.priority === value)
      );
    }
    setWorkingData(filteredData);
  }, [data]);

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'In-process': return 'status-in-process';
      case 'Need to start': return 'status-need-to-start';
      case 'Complete': return 'status-complete';
      case 'Blocked': return 'status-blocked';
      default: return 'status-default';
    }
  };

  const getPriorityClass = (priority: string): string => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'priority-default';
    }
  };

  const handleSort = (column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : sortColumn === column && sortDirection === 'desc' ? null : 'asc';
    setSortColumn(newDirection ? column : null);
    setSortDirection(newDirection);

    if (!newDirection) {
      setWorkingData([...data]);
      return;
    }
    setWorkingData([...workingData].sort((a, b) => {
      const aValue = a[column as keyof JobRequest];
      const bValue = b[column as keyof JobRequest];
      return newDirection === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    }));
  };

  const handleFilter = () => {
    if (!showFilterMenu) {
      setShowFilterMenu(true);
      setFilterMode(null);
      setFilterValue(null);
      setShowSubMenu(false);
      setWorkingData([...data]);
    } else if (filterMode && !showSubMenu) {
      setShowSubMenu(true);
    } else if (filterMode && showSubMenu && !filterValue) {
      setShowSubMenu(false);
    } else if (filterMode && filterValue) {
      setFilterMode(null);
      setFilterValue(null);
      setWorkingData([...data]);
      setShowFilterMenu(false);
      setShowSubMenu(false);
    } else {
      setShowFilterMenu(false);
    }
  };

  const selectFilterMode = (mode: 'status' | 'priority') => {
    setFilterMode(mode);
    setShowSubMenu(true);
  };

  const applySubFilter = (value: string) => {
    setFilterValue(value);
    setWorkingData(data.filter(item =>
      (filterMode === 'status' && item.status === value) ||
      (filterMode === 'priority' && item.priority === value)
    ));
    setShowFilterMenu(false);
    setShowSubMenu(false);
  };

  const handleHideFields = () => {
    setHiddenColumns(prev => prev.includes('url') ? prev.filter(col => col !== 'url') : [...prev, 'url']);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setWorkingData(data.filter(item =>
      item.jobRequest.toLowerCase().includes(term.toLowerCase()) ||
      item.submitter.toLowerCase().includes(term.toLowerCase()) ||
      item.assigned.toLowerCase().includes(term.toLowerCase())
    ));
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.name.endsWith('.csv')) {
      alert(file ? 'Invalid file type. Please upload a CSV file.' : 'No file selected.');
      return;
    }

    Papa.parse(file, {
      complete: (result) => {
        const importedData = (result.data as any[]).map((row, index) => ({
          id: row.id ? parseInt(row.id, 10) : data.length + index + 1,
          jobRequest: row.jobRequest || '',
          submitted: /^\d{4}-\d{2}-\d{2}$/.test(row.submitted) ? row.submitted : '',
          status: ['In-process', 'Need to start', 'Complete', 'Blocked'].includes(row.status) ? row.status : 'Need to start',
          submitter: row.submitter || '',
          url: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(row.url) ? row.url : '',
          assigned: row.assigned || '',
          priority: ['High', 'Medium', 'Low'].includes(row.priority) ? row.priority : 'Low',
          dueDate: /^\d{4}-\d{2}-\d{2}$/.test(row.dueDate) ? row.dueDate : '',
          estValue: row.estValue || '',
        })).filter(row => row.jobRequest);

        if (importedData.length) {
          setData(prev => [...prev, ...importedData]);
          setWorkingData(prev => [...prev, ...importedData]);
          alert(`Successfully imported ${importedData.length} job request(s).`);
        } else {
          alert('No valid data was imported. Please check the CSV format.');
        }
      },
      header: true,
      skipEmptyLines: true,
      error: (error) => alert('Error parsing CSV file: ' + error.message),
    });
    event.target.value = '';
  };

  const handleExport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Job Requests Dashboard', 14, 20);

    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Job Request', dataKey: 'jobRequest' },
      { header: 'Submitted', dataKey: 'submitted' },
      { header: 'Status', dataKey: 'status' },
      { header: 'Submitter', dataKey: 'submitter' },
      { header: 'URL', dataKey: 'url' },
      { header: 'Assigned', dataKey: 'assigned' },
      { header: 'Priority', dataKey: 'priority' },
      { header: 'Due Date', dataKey: 'dueDate' },
      { header: 'Est. Value', dataKey: 'estValue' },
    ];

    autoTable(doc, {
      columns,
      body: workingData,
      startY: 30,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [33, 150, 243], textColor: [255, 255, 255] },
      columnStyles: {
        status: { cellWidth: 'auto', textColor: (data) => ['#2196f3', '#ff9800', '#4caf50', '#f44336', '#000000'][['In-process', 'Need to start', 'Complete', 'Blocked', 'status-default'].indexOf(data.status)] },
        priority: { cellWidth: 'auto', textColor: (data) => ['#f44336', '#ff9800', '#4caf50', '#000000'][['High', 'Medium', 'Low', 'priority-default'].indexOf(data.priority)] },
      },
      didDrawCell: (data) => {
        if (data.column.dataKey === 'url' && data.cell.text[0]) {
          doc.setTextColor(0, 0, 255);
          doc.textWithLink(data.cell.text[0], data.cell.x + 2, data.cell.y + 5, { url: data.cell.text[0] });
          doc.setTextColor(0, 0, 0);
        }
      },
    });

    doc.save(`job_requests_${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`);
  };

  const handleShare = () => {
    const params = new URLSearchParams({ search: searchTerm, ...(filterMode && filterValue ? { filterMode, filterValue } : {}), ...(selectedRowIndex !== null ? { rowIndex: selectedRowIndex.toString() } : {}) });
    const url = `${BASE_URL}${window.location.pathname}?${params.toString()}`;
    setShareUrl(url);
    setShowShareModal(true);
    navigator.clipboard.writeText(url).catch(err => console.error('Clipboard copy failed:', err));
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setShareUrl('');
  };

  const handleRowSelect = (index: number) => {
    setSelectedRowIndex(index);
    window.history.pushState({}, '', `${window.location.pathname}?${new URLSearchParams({ rowIndex: index.toString() }).toString()}`);
  };

  const handleBack = () => {
    setSelectedRowIndex(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const visibleColumns = ['jobRequest', 'submitted', 'status', 'submitter', 'url', 'assigned', 'priority', 'dueDate', 'estValue'].filter(col => !hiddenColumns.includes(col));

  return (
    <div className="container">
      <div className="card">
        <div className="header-container">
          <h2 className="card-title">Job Requests Dashboard</h2>
          <div className="profile-section" onClick={handleProfileClick}>
            <img src="/profile.jpg" alt="Profile" className="profile-image" style={{ width: '40px', height: '40px' }} />

             <span
  style={{
    fontSize: '20px',
    marginLeft: '10px',
    fontWeight: '500',
    color: '#333',          // You can customize this color
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.2',
    cursor: 'pointer',      // Optional: Makes the name look clickable
    display: 'inline-block' // Ensures proper spacing
  }}
>
  {profile.name}
</span>

          </div>
        </div>
        {selectedRowIndex === null ? (
          <>
            <div className="toolbar">
              <div className="toolbar-left">
                <button className="toolbar-button" onClick={() => {}}>Tool bar</button>
                <button className="toolbar-button" onClick={handleHideFields}>Hide fields</button>
                <button className="toolbar-button" onClick={() => handleSort('dueDate')}>Sort</button>
                <div className="filter-container">
                  <button className="toolbar-button" onClick={handleFilter}>
                    Filter {filterValue ? `(${filterMode}: ${filterValue})` : ''}
                  </button>
                  {showFilterMenu && (
                    <div className="filter-menu">
                      {!filterMode && (
                        <>
                          <div className="filter-option" onClick={() => selectFilterMode('status')}>Filter by Status</div>
                          <div className="filter-option" onClick={() => selectFilterMode('priority')}>Filter by Priority</div>
                        </>
                      )}
                      {showSubMenu && filterMode === 'status' && (
                        <div className="sub-menu">
                          {['In-process', 'Need to start', 'Blocked', 'Complete'].map(status => (
                            <div key={status} className="filter-option" onClick={() => applySubFilter(status)}>{status}</div>
                          ))}
                        </div>
                      )}
                      {showSubMenu && filterMode === 'priority' && (
                        <div className="sub-menu">
                          {['High', 'Medium', 'Low'].map(priority => (
                            <div key={priority} className="filter-option" onClick={() => applySubFilter(priority)}>{priority}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search job request, submitter, or assigned..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="toolbar-right">
                <label className="toolbar-button">
                  Import
                  <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleImport} />
                </label>
                <button className="toolbar-button" onClick={handleExport}>Export</button>
                <button className="toolbar-button" onClick={handleShare}>Share</button>
                <button className="toolbar-button action-button" onClick={() => setShowNewActionForm(true)}>New Action</button>
              </div>
            </div>
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>{visibleColumns.map(column => <th key={column} className="table-header-cell">{column.charAt(0).toUpperCase() + column.slice(1).replace('estValue', 'Est. Value')}</th>)}</tr>
                </thead>
                <tbody>
                  {workingData.map((item, index) => (
                    <tr key={item.id} className="table-row" onClick={() => handleRowSelect(index)}>
                      {visibleColumns.map(column => (
                        <td key={`${item.id}-${column}`} className="table-cell">
                          {column === 'status' ? <span className={`status-pill ${getStatusClass(item[column as keyof JobRequest] as string)}`}>{item[column as keyof JobRequest]}</span> :
                            column === 'url' ? <a href={item[column as keyof JobRequest] as string} target="_blank" rel="noopener noreferrer" className="url-link">{item[column as keyof JobRequest]}</a> :
                              column === 'jobRequest' ? <span className="table-cell-bold">{item[column as keyof JobRequest]}</span> :
                                item[column as keyof JobRequest]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showNewActionForm && <NewAction onSave={(newJob) => setData(prev => [...prev, newJob])} onCancel={() => setShowNewActionForm(false)} />}
            {showShareModal && (
              <div className="share-modal">
                <div className="share-modal-content">
                  <h3>Share Dashboard</h3>
                  <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="share-link">{shareUrl}</a>
                  <button className="toolbar-button" onClick={() => navigator.clipboard.writeText(shareUrl).then(() => alert('URL copied to clipboard!'))}>Copy URL</button>
                  <button className="toolbar-button" onClick={handleCloseShareModal}>Close</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <RecordView job={workingData[selectedRowIndex!]} onBack={handleBack} />
        )}
      </div>
    </div>
  );
};

export default Spreadsheet;