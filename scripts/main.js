import { skills, projects } from './data.js';
import { initCursor } from './cursor.js';
import { renderSkills } from './skills.js';
import { renderProjects } from './projects.js';
import { initReveal } from '../utils/observer.js';

document.addEventListener('DOMContentLoaded', () => {
    initCursor();

    renderSkills(skills);
    renderProjects(projects);

    initReveal(); // MUST be after render
});

