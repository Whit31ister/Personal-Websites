export function renderProjects(projects) {
    const projectsList = document.getElementById('projectsList');

    if (!projectsList) {
        console.error("projectsList not found");
        return;
    }

    projectsList.innerHTML = '';

    projects.forEach(p => {
        projectsList.innerHTML += `
      <div class="project-item reveal">
        <div class="project-num">${p.num}</div>
        <div class="project-info">
          <div class="project-name">${p.name}</div>
          <div class="project-desc">${p.desc}</div>
        </div>
        <div class="project-tags">
          ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    `;
    });
}