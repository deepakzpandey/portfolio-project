import React from 'react';

const ProjectCard = ({ project, onDelete, onEdit }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      onDelete(project.id);
    }
  };

  const handleEdit = () => {
    onEdit(project);
  };

  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      
      {project.description && (
        <p>{project.description}</p>
      )}
      
      {project.technologies && (
        <div className="project-technologies">
          <strong>Technologies:</strong> {project.technologies}
        </div>
      )}
      
      <div className="project-links">
        {project.project_url && (
          <a 
            href={project.project_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="project-link"
          >
            🌐 Live Demo
          </a>
        )}
        {project.github_url && (
          <a 
            href={project.github_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="project-link"
          >
            📂 GitHub
          </a>
        )}
      </div>
      
      <div className="project-actions">
        <button 
          onClick={handleEdit}
          className="btn btn-edit"
        >
          Edit
        </button>
        <button 
          onClick={handleDelete}
          className="btn btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
