import { skills, projects } from './data.js';
import { initCursor } from './cursor.js';
import { initReveal } from '../utils/observer.js';
import { initGridZone } from './gridZone.js';
import { initGridAnimation } from './animations.js';
import { initAsciiCube } from './Aistuff.js';
/*import { initScrollZoom } from './scroll.js';*/
import { renderSkills } from "../components/skills.js";
import { renderProjects } from "../components/projects.js";

console.log("MAIN LOADED");

document.addEventListener('DOMContentLoaded', () => {
    console.log("INNIT START");
    initCursor();

    initGridZone();
    initGridAnimation();
    renderSkills();
    renderProjects();
    initAsciiCube();
/*    initScrollZoom();*/
    renderSkills(skills);
    renderProjects(projects);
    console.log("INNIT LOADED");
    initReveal(); // MUST be after render
});
