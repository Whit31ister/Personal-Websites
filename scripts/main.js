import { skills, projects } from './data.js';
import { initCursor } from './cursor.js';
import { renderSkills } from './skills.js';
import { renderProjects } from './projects.js';
import { initReveal } from '../utils/observer.js';
import { initGridZone } from './gridZone.js';
import { initGridAnimation } from './animations.js';
import { initAsciiCube } from './Aistuff.js';
/*import { initScrollZoom } from './scroll.js';*/

console.log("MAIN LOADED");

document.addEventListener('DOMContentLoaded', () => {
    console.log("INNIT START");
    initCursor();

    initGridZone();
    initGridAnimation();

    initAsciiCube();
/*    initScrollZoom();*/
    renderSkills(skills);
    renderProjects(projects);
    console.log("INNIT LOADED");
    initReveal(); // MUST be after render
});
