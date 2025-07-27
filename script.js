
// Simulated database (in a real app, this would be your backend)
let projects = [];
let currentId = 0;

// DOM elements
const projectForm = document.getElementById('projectForm');
const projectList = document.getElementById('projectList');
const emptyState = document.getElementById('emptyState');

// Form submission
projectForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const newProject = {
        id: ++currentId,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        technologies: document.getElementById('technologies').value,
        project_url: document.getElementById('project_url').value,
        github_url: document.getElementById('github_url').value,
        created_at: new Date().toISOString()
    };

    // Simulate API POST request
    projects.push(newProject);
    renderProjects();

    // Reset form
    projectForm.reset();
});

// Delete project
function deleteProject(id) {
    // Simulate API DELETE request
    projects = projects.filter(project => project.id !== id);
    renderProjects();
}

// Edit project
function editProject(id) {
    const project = projects.find(p => p.id === id);
    if (project) {
        document.getElementById('title').value = project.title;
        document.getElementById('description').value = project.description;
        document.getElementById('technologies').value = project.technologies;
        document.getElementById('project_url').value = project.project_url;
        document.getElementById('github_url').value = project.github_url;

        // Remove the project being edited
        projects = projects.filter(p => p.id !== id);
        renderProjects();
    }
}

// Render all projects
function renderProjects() {
    if (projects.length === 0) {
        emptyState.style.display = 'block';
        projectList.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    projectList.style.display = 'grid';
    projectList.innerHTML = '';

    projects.forEach(project => {
        const techList = project.technologies
            ? project.technologies.split(',').map(tech => tech.trim())
            : [];

        const projectCard = document.createElement('div');
        projectCard.className = 'project-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col';

        projectCard.innerHTML = `
          <div class="p-6 flex-grow">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-xl font-semibold text-gray-800">${project.title}</h3>
              <span class="text-xs text-gray-500">${new Date(project.created_at).toLocaleDateString()}</span>
            </div>
            <p class="text-gray-600 mb-4">${project.description}</p>
            
            ${techList.length > 0 ? `
              <div class="flex flex-wrap gap-2 mb-4">
                ${techList.map(tech => `
                  <span class="tech-tag bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">${tech}</span>
                `).join('')}
              </div>
            ` : ''}
          </div>
          
          <div class="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between">
            <div class="flex space-x-2">
              ${project.project_url ? `
                <a href="${project.project_url}" target="_blank" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Live Demo
                </a>
              ` : ''}
              ${project.github_url ? `
                <a href="${project.github_url}" target="_blank" class="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  GitHub
                </a>
              ` : ''}
            </div>
            <div class="flex space-x-2">
              <button onclick="editProject(${project.id})" class="text-gray-500 hover:text-indigo-600 text-sm font-medium">
                Edit
              </button>
              <button onclick="deleteProject(${project.id})" class="text-red-500 hover:text-red-700 text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        `;

        projectList.appendChild(projectCard);
    });
}

// Initialize
renderProjects();