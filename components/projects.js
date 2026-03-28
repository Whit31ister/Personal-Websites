export const projectsData = [
    {
        name: "Cyphrus",
        desc: "A unified, terminal-driven interface for managing and interacting with locally hosted AI models.",
        tags: ["AI", "CLI", "Local Models"],
        link: "https://github.com/Whit31ister/Cyphrus",
        icon: "[AI]"
    },
    {
        name: "White.dev",
        desc: "Personal portfolio featuring advanced UI interactions and ASCII rendering.",
        tags: ["Portfolio", "UI/UX", "Frontend"],
        link: "#",
        icon: "[<>]"
    },
    {
        name: "MemTracer",
        desc: "Memory leak detector for C/C++ programs with allocator hooks.",
        tags: ["C++", "Systems", "CLI"],
        link: "#",
        icon: "[MM]"
    },
    {
        name: "AlgoViz",
        desc: "Interactive algorithm visualizer with real-time animations.",
        tags: ["JavaScript", "HTML", "CSS"],
        link: "#",
        icon: "[Σ]"
    },
    {
        name: "PyScript Runner",
        desc: "Async Python task runner with sandboxing.",
        tags: ["Python", "CLI"],
        link: "#",
        icon: "[Py]"
    },
    {
        name: "ThreadPool",
        desc: "High-performance C++ thread pool with scheduling.",
        tags: ["C++", "Multithreading"],
        link: "#",
        icon: "[||]"
    },
    {
        name: "PortKit",
        desc: "Minimalist developer portfolio kit.",
        tags: ["Web", "UI"],
        link: "#",
        icon: "[UI]"
    }
];

export function renderProjects() {
    const container = document.getElementById("projectsList");
    if (!container) return;

    container.innerHTML = projectsData.map((p) => `
    <div class="project-item" onclick="window.open('${p.link}', '_blank')">

      <div class="project-icon">${p.icon}</div>

      <div class="project-info">
        <div class="project-name">${p.name}</div>
        <div class="project-desc">${p.desc}</div>
      </div>

      <div class="project-tags">
        ${p.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
      </div>

    </div>
  `).join("");
}