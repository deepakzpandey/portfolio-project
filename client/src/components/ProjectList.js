import React from 'react';
import ProjectCard from './ProjectCard';

const ProjectList = ({ projects, onDelete, onEdit }) => {
  return (
    <div className="project-list">
      <h2>My Projects ({projects.length})</h2>
      {projects.length === 0 ? (
        <p className="no-projects">No projects found. Add your first project above!</p>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
