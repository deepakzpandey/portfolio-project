# Project Portfolio Tracker - Frontend

React.js frontend for managing project portfolios.

## Prerequisites
- Node.js (v14 or higher)
- Backend server running on port 5000

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   
   The app will run on http://localhost:3000

3. **Build for Production**
   ```bash
   npm run build
   ```

## Features

- **Add New Projects**: Use the form to add projects with title, description, technologies, and URLs
- **View Projects**: All projects are displayed in a responsive card layout
- **Edit Projects**: Click the "Edit" button on any project card to modify it
- **Delete Projects**: Remove projects with confirmation dialog
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Components Structure

```
src/
├── App.js              # Main application component
├── App.css             # Global styles
├── index.js            # React entry point
└── components/
    ├── Header.js       # Application header
    ├── ProjectForm.js  # Form for adding/editing projects
    ├── ProjectList.js  # Container for project cards
    └── ProjectCard.js  # Individual project display
```

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api` using Axios for HTTP requests.

## Technologies Used

- React.js 18
- Axios for API calls
- CSS3 with Flexbox and Grid
- Responsive design principles

## Customization

You can customize the styling by modifying `App.css`. The color scheme uses a purple gradient theme that can be easily changed by updating the CSS variables.
