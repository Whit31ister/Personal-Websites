export const skillsData = [
    { name: "C/C++", level: 90, category: "Systems" },
    { name: "Python", level: 88, category: "Scripting" },
    { name: "Java", level: 85, category: "OOP" },
    { name: "JavaScript", level: 87, category: "Web" },
    { name: "SQL", level: 80, category: "Database" },
    { name: "Bash", level: 75, category: "Shell" },

    { name: "Multithreading", level: 85, category: "Systems" },
    { name: "Memory Management", level: 82, category: "Systems" },
    { name: "File Systems", level: 78, category: "Linux" },
    { name: "System Calls", level: 80, category: "OS" },

    { name: "Data Structures", level: 90, category: "Core CS" },
    { name: "Algorithms", level: 88, category: "Core CS" },
    { name: "Debugging", level: 85, category: "Dev" },

    { name: "Git", level: 92, category: "Tools" },
    { name: "Linux", level: 90, category: "Tools" },
    { name: "Docker", level: 75, category: "Tools" },
    {name: "MongoDB", level: 90, category: "Tools" },
    { name: "Concurrency", level: 85, category: "Systems" },
    { name: "Virtual Memory", level: 80, category: "OS" },
    { name: "TCP/IP", level: 80, category: "Networking" },
    { name: "Performance Profiling", level: 82, category: "Systems" },
];

export function renderSkills() {
    const container = document.getElementById("skillsGrid");
    if (!container) return;

    container.innerHTML = skillsData.map((skill, i) => `
    <div class="skill-item">

      <div class="skill-icon">0${i + 1} — ${skill.category}</div>

      <div class="skill-name">${skill.name}</div>

      <div class="skill-bar">
        <div class="skill-bar-fill" data-level="${skill.level}"></div>
      </div>

      <div class="skill-level">${skill.level}% proficiency</div>

    </div>
  `).join("");

    initSkillBars();
}

function initSkillBars() {
    const bars = document.querySelectorAll(".skill-bar-fill");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const value = bar.dataset.level;

                // trigger animation
                requestAnimationFrame(() => {
                    bar.style.width = value + "%";
                });

                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.4 });

    bars.forEach(bar => observer.observe(bar));
}