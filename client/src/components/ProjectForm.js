import React, { useState, useEffect } from 'react';

const ProjectForm = ({ onSubmit, editingProject, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    project_url: '',
    github_url: ''
  });

  // Populate form when editing
  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || '',
        description: editingProject.description || '',
        technologies: editingProject.technologies || '',
        project_url: editingProject.project_url || '',
        github_url: editingProject.github_url || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        technologies: '',
        project_url: '',
        github_url: ''
      });
    }
  }, [editingProject]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Title is required!');
      return;
    }
    onSubmit(formData);
    if (!editingProject) {
      setFormData({
        title: '',
        description: '',
        technologies: '',
        project_url: '',
        github_url: ''
      });
    }
  };

  return (
    <div className="project-form">
      <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter project title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your project"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="technologies">Technologies Used</label>
          <input
            type="text"
            id="technologies"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, MongoDB"
          />
        </div>

        <div className="form-group">
          <label htmlFor="project_url">Project URL</label>
          <input
            type="url"
            id="project_url"
            name="project_url"
            value={formData.project_url}
            onChange={handleChange}
            placeholder="https://your-project-demo.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="github_url">GitHub URL</label>
          <input
            type="url"
            id="github_url"
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            placeholder="https://github.com/username/repo"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editingProject ? 'Update Project' : 'Add Project'}
          </button>
          {editingProject && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
