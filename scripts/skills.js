export function renderSkills(skills) {
    const skillsGrid = document.getElementById('skillsGrid');

    if (!skillsGrid) {
        console.error("skillsGrid not found");
        return;
    }

    skillsGrid.innerHTML = '';

    skills.forEach(s => {
        skillsGrid.innerHTML += `
      <div class="skill-item reveal">
        <div class="skill-icon">${s.tag}</div>
        <div class="skill-name">${s.name}</div>
        <div class="skill-bar">
          <div class="skill-bar-fill" data-width="${s.level}"></div>
        </div>
        <div class="skill-level">${s.level}% proficiency</div>
      </div>
    `;
    });
}
