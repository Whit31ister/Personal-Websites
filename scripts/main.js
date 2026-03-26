import { skills, projects } from './data.js';
import { initCursor } from './cursor.js';
import { renderSkills } from './skills.js';
import { renderProjects } from './projects.js';
import { initReveal } from '../utils/observer.js';
import { initGridZone } from './gridZone.js';
import { initGridAnimation } from './animations.js';
console.log("MAIN LOADED");

document.addEventListener('DOMContentLoaded', () => {
    initCursor();

    initGridZone();
    initGridAnimation();

    renderSkills(skills);
    renderProjects(projects);
    console.log("MAIN LOADED");
    initReveal(); // MUST be after render
});

