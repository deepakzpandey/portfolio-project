import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';

const API_URL = 'https://portfolio-backend-api-cwe5h7cee7fee5dd.westindia-01.azurewebsites.net/api';

function App() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  // Fetch all projects from the backend
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Add a new project
  const addProject = async (projectData) => {
    try {
      const response = await axios.post(`${API_URL}/projects`, projectData);
      setProjects([...projects, response.data]);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  // Update an existing project
  const updateProject = async (id, projectData) => {
    try {
      await axios.put(`${API_URL}/projects/${id}`, projectData);
      fetchProjects(); // Refresh the list
      setEditingProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  // Delete a project
  const deleteProject = async (id) => {
    try {
      await axios.delete(`${API_URL}/projects/${id}`);
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Load projects when component mounts
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="App">
      <Header />
      <div className="main-content">
        <ProjectForm 
          onSubmit={editingProject ? (data) => updateProject(editingProject.id, data) : addProject}
          editingProject={editingProject}
          onCancel={() => setEditingProject(null)}
        />
        <ProjectList 
          projects={projects}
          onDelete={deleteProject}
          onEdit={setEditingProject}
        />
      </div>
    </div>
  );
}

export default App;
