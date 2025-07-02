import React, { useState } from 'react';
import './newaction.css';

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

interface NewActionProps {
  onSave: (newJob: JobRequest) => void;
  onCancel: () => void;
}

const NewAction: React.FC<NewActionProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<JobRequest>>({
    jobRequest: '',
    submitted: '',
    status: 'Need to start',
    submitter: '',
    url: '',
    assigned: '',
    priority: 'Medium',
    dueDate: '',
    estValue: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: JobRequest = {
      id: Date.now(), // Unique ID based on timestamp
      ...formData,
      submitted: formData.submitted || new Date().toISOString().split('T')[0],
      status: formData.status || 'Need to start',
      priority: formData.priority || 'Medium',
    } as JobRequest;
    onSave(newJob);
    onCancel();
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h3 className="form-title">Add New Job Request</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          {Object.keys(formData).map((field) => (
            <div className="form-group" key={field}>
              <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1).replace('estValue', 'Est. Value')}</label>
              {field === 'status' || field === 'priority' ? (
                <select name={field} value={formData[field as keyof JobRequest] || ''} onChange={handleChange} required className="form-input">
                  {field === 'status' ? (
                    ['Need to start', 'In-process', 'Complete', 'Blocked'].map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))
                  ) : (
                    ['Low', 'Medium', 'High'].map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))
                  )}
                </select>
              ) : (
                <input
                  type={field === 'dueDate' || field === 'submitted' ? 'date' : 'text'}
                  name={field}
                  value={formData[field as keyof JobRequest] || ''}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              )}
            </div>
          ))}
          <div className="form-actions">
            <button type="submit" className="form-button form-button-save">Save</button>
            <button type="button" className="form-button form-button-cancel" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAction;