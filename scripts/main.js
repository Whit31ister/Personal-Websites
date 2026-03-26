import { skills, projects } from './data.js';
import { initCursor } from './cursor.js';
import { renderSkills } from './skills.js';
import { renderProjects } from './projects.js';
import { initReveal } from '../utils/observer.js';
import { initGridZone } from './gridZone.js';
import { initGridAnimation } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
    initCursor();

    initGridZone();
    initGridAnimation();

    renderSkills(skills);
    renderProjects(projects);

    initReveal(); // MUST be after render
});

