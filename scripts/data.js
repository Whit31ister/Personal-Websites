export const profile = {
    name: "White Lister",
    username: "white",
    host: "white-os",
    handle: "Whit31ister",
    email: "veerrajkanwar@gmail.com",
    github: "https://github.com/Whit31ister",
    shell: "/bin/white-shell",
    home: "/home/white",
    summary: "Systems-focused developer building OS experiments, local tooling, and fast web interfaces. This desktop keeps projects, links, and contact paths one click away.",
    currentTrack: "Low-level systems, OS fundamentals, full-stack interfaces, and tooling that keeps control close to the machine.",
    focus: [
        "OS fundamentals, boot flow, memory layout, and kernel control.",
        "Terminal-first tooling, debugging workflows, and clean automation.",
        "Practical web interfaces, Linux, Git, Docker, and profiling."
    ]
};

export const contactLinks = [
    {
        label: "Email",
        value: "veerrajkanwar@gmail.com",
        href: "mailto:veerrajkanwar@gmail.com"
    },
    {
        label: "GitHub",
        value: "github.com/Whit31ister",
        href: "https://github.com/Whit31ister"
    },
    {
        label: "LinkedIn",
        value: "veer-raj-kanwar",
        href: "https://www.linkedin.com/in/veer-raj-kanwar-7766653b9/"
    },
    {
        label: "Twitter",
        value: "@VeerRajKan40602",
        href: "https://x.com/VeerRajKan40602"
    }
];

export const projects = [
    {
        id: "sample-os",
        file: "SAMPLE_OS.SYS",
        name: "Sample OS Testing 4748",
        kind: "Low-Level Systems",
        status: "GitHub",
        desc: "Operating-systems development work focused on boot flow, memory layout, and kernel fundamentals.",
        tags: ["OSDev", "C", "Low-Level"],
        github: "https://github.com/Whit31ister/Sample-OS-testing-4748"
    },
    {
        id: "cyphrus",
        file: "CYPHRUS.EXE",
        name: "Cyphrus",
        kind: "Local AI Tooling",
        status: "GitHub",
        desc: "Terminal-driven interface for managing and interacting with locally hosted AI models.",
        tags: ["AI", "CLI", "Local Models"],
        github: "https://github.com/Whit31ister/Cyphrus"
    },
    {
        id: "white-dev",
        file: "WHITE_DEV.WEB",
        name: "White.dev",
        kind: "Portfolio System",
        status: "Current",
        desc: "Personal portfolio rebuilt as a minimal old-Windows-style desktop environment.",
        tags: ["Portfolio", "Frontend", "Vanilla JS"],
        github: ""
    },
    {
        id: "memtracer",
        file: "MEMTRACER.CPP",
        name: "MemTracer",
        kind: "Systems Utility",
        status: "Archive",
        desc: "Memory leak detector for C/C++ programs using allocator hooks and heap analysis.",
        tags: ["C++", "Systems", "CLI"],
        github: ""
    },
    {
        id: "algoviz",
        file: "ALGOVIZ.JS",
        name: "AlgoViz",
        kind: "Visualizer",
        status: "Archive",
        desc: "Interactive algorithm visualizer for sorting and graph traversal behavior.",
        tags: ["JavaScript", "HTML", "CSS"],
        github: ""
    },
    {
        id: "pyscript-runner",
        file: "PYRUNNER.PY",
        name: "PyScript Runner",
        kind: "Automation",
        status: "Archive",
        desc: "Lightweight async Python task runner with sandboxed execution flows.",
        tags: ["Python", "CLI"],
        github: ""
    }
];

export const skills = [
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
    { name: "MongoDB", level: 90, category: "Tools" },
    { name: "Concurrency", level: 85, category: "Systems" },
    { name: "Virtual Memory", level: 80, category: "OS" },
    { name: "TCP/IP", level: 80, category: "Networking" },
    { name: "Performance Profiling", level: 82, category: "Systems" }
];

export const resumeStats = [
    { value: "8+", label: "Years Coding" },
    { value: "13+", label: "Projects Shipped" },
    { value: "6", label: "Languages" },
    { value: "7", label: "Team Projects" }
];

export const apps = [
    { id: "explorer", name: "File Explorer", file: "EXPLORER.EXE", category: "System", icon: "folder", command: "explorer", desc: "Browse the virtual desktop filesystem." },
    { id: "terminal", name: "Terminal", file: "TERMINAL.EXE", category: "System", icon: "terminal", command: "terminal", desc: "Shell prompt with Linux-style commands." },
    { id: "utilities", name: "Utilities", file: "UTILS.CPL", category: "Tools", icon: "toolbox", command: "utilities", desc: "Calculator, notepad, run box, clipboard, and system tools." },
    { id: "games", name: "Games", file: "GAMES.DIR", category: "Fun", icon: "game", command: "games", desc: "Snake, mines, and quick reaction games." },
    { id: "widgets", name: "Widgets", file: "WIDGETS.DLL", category: "Desktop", icon: "widget", command: "widgets", desc: "Clock, calendar, resource meter, and sticky notes." },
    { id: "display", name: "Display", file: "DISPLAY.CPL", category: "Settings", icon: "monitor", command: "display", desc: "Wallpaper and desktop appearance settings." },
    { id: "projects", name: "Projects", file: "PROJECTS.DIR", category: "Portfolio", icon: "folder", command: "projects", desc: "Project files and GitHub links." },
    { id: "skills", name: "Skills", file: "SKILLS.CPL", category: "Portfolio", icon: "chip", command: "skills", desc: "Capabilities and tools." },
    { id: "about", name: "About", file: "ABOUT_ME.TXT", category: "Portfolio", icon: "file", command: "about", desc: "Profile and current focus." },
    { id: "resume", name: "Resume", file: "RESUME.SYS", category: "Portfolio", icon: "document", command: "resume", desc: "Stats and current track." },
    { id: "contact", name: "Contact", file: "CONTACT.LNK", category: "Portfolio", icon: "mail", command: "contact", desc: "Email and social links." }
];

export const wallpapers = [
    {
        id: "aqua",
        name: "Aqua Scanlines",
        swatch: "#087d7b",
        css: "repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 4px), linear-gradient(135deg, #0b3c99 0%, #087d7b 58%, #283f7c 100%)"
    },
    {
        id: "classic-teal",
        name: "Classic Teal",
        swatch: "#008080",
        css: "linear-gradient(135deg, #008080 0%, #006f73 100%)"
    },
    {
        id: "midnight",
        name: "Midnight Grid",
        swatch: "#101758",
        css: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(135deg, #101758 0%, #022a46 55%, #151515 100%)",
        size: "28px 28px, 28px 28px, auto"
    },
    {
        id: "steel",
        name: "Steel Desktop",
        swatch: "#6b7f8f",
        css: "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 8px), linear-gradient(135deg, #8fa1ad 0%, #4e687a 100%)"
    },
    {
        id: "forest",
        name: "Forest Terminal",
        swatch: "#124c32",
        css: "radial-gradient(circle at 22% 18%, rgba(255,255,255,0.12), transparent 18%), linear-gradient(135deg, #124c32 0%, #0b2c3a 100%)"
    },
    {
        id: "graphite",
        name: "Graphite",
        swatch: "#303438",
        css: "repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 3px), linear-gradient(135deg, #303438 0%, #151719 100%)"
    }
];

export const quickNotes = [
    "Ship small, inspect behavior, then iterate.",
    "Keep links visible. Keep demos useful.",
    "Prefer simple tools that explain themselves."
];

export const virtualFileSystem = {
    type: "dir",
    children: {
        bin: {
            type: "dir",
            children: {
                "cat": { type: "file", content: "Built-in command: print file contents." },
                "cd": { type: "file", content: "Built-in command: change directory." },
                "ls": { type: "file", content: "Built-in command: list files." },
                "grep": { type: "file", content: "Built-in command: search text." },
                "tree": { type: "file", content: "Built-in command: print directory tree." },
                "white-shell": { type: "file", content: "White OS browser shell. Simulated, persistent while the page is open." }
            }
        },
        etc: {
            type: "dir",
            children: {
                "hostname": { type: "file", content: "white-os" },
                "issue": { type: "file", content: "White OS 3.1 Browser Edition" },
                "motd": { type: "file", content: "Welcome to White OS. Type help, man, ls, tree, or explorer." },
                "profile": { type: "file", content: "PATH=/bin:/usr/bin:/usr/local/bin\nSHELL=/bin/white-shell\nUSER=white" }
            }
        },
        home: {
            type: "dir",
            children: {
                white: {
                    type: "dir",
                    children: {
                        "README.txt": {
                            type: "file",
                            content: "White Lister portfolio desktop.\nUse the icons, Start menu, right-click menu, File Explorer, or Terminal to move around."
                        },
                        Desktop: {
                            type: "dir",
                            children: {
                                "ABOUT_ME.TXT": { type: "file", content: "Open the About window for profile and status." },
                                "PROJECTS.DIR": { type: "file", content: "Open the Projects window for portfolio files." },
                                "CONTACT.LNK": { type: "file", content: "mailto:veerrajkanwar@gmail.com" }
                            }
                        },
                        Documents: {
                            type: "dir",
                            children: {
                                "resume.txt": { type: "file", content: "8+ years coding\n13+ projects shipped\n6 languages\n7 team projects" },
                                "focus.txt": { type: "file", content: "OS fundamentals\nTerminal-first tooling\nPractical web interfaces\nDebugging, Linux, Git, Docker, profiling" },
                                "links.txt": { type: "file", content: "GitHub: https://github.com/Whit31ister\nEmail: veerrajkanwar@gmail.com" }
                            }
                        },
                        Projects: {
                            type: "dir",
                            children: {
                                "sample-os.md": {
                                    type: "file",
                                    content: "Sample OS Testing 4748\nLow-level operating-systems work around boot flow, memory layout, and kernel fundamentals.\nGitHub: https://github.com/Whit31ister/Sample-OS-testing-4748"
                                },
                                "cyphrus.md": {
                                    type: "file",
                                    content: "Cyphrus\nTerminal-driven interface for managing and interacting with locally hosted AI models.\nGitHub: https://github.com/Whit31ister/Cyphrus"
                                },
                                "white-dev.md": {
                                    type: "file",
                                    content: "White.dev\nPersonal portfolio rebuilt as a minimal old-Windows-style desktop environment."
                                },
                                "memtracer.md": {
                                    type: "file",
                                    content: "MemTracer\nMemory leak detector for C/C++ programs using allocator hooks and heap analysis."
                                },
                                "algoviz.md": {
                                    type: "file",
                                    content: "AlgoViz\nInteractive algorithm visualizer for sorting and graph traversal behavior."
                                },
                                "pyrunner.md": {
                                    type: "file",
                                    content: "PyScript Runner\nLightweight async Python task runner with sandboxed execution flows."
                                }
                            }
                        },
                        tmp: {
                            type: "dir",
                            children: {}
                        }
                    }
                }
            }
        },
        usr: {
            type: "dir",
            children: {
                share: {
                    type: "dir",
                    children: {
                        wallpapers: {
                            type: "dir",
                            children: {
                                "aqua.theme": { type: "file", content: "Aqua Scanlines" },
                                "classic-teal.theme": { type: "file", content: "Classic Teal" },
                                "midnight.theme": { type: "file", content: "Midnight Grid" },
                                "steel.theme": { type: "file", content: "Steel Desktop" },
                                "forest.theme": { type: "file", content: "Forest Terminal" },
                                "graphite.theme": { type: "file", content: "Graphite" }
                            }
                        }
                    }
                }
            }
        },
        var: {
            type: "dir",
            children: {
                log: {
                    type: "dir",
                    children: {
                        "boot.log": { type: "file", content: "[OK] desktop shell\n[OK] windows\n[OK] virtual filesystem\n[OK] terminal" },
                        "access.log": { type: "file", content: "127.0.0.1 opened portfolio desktop" }
                    }
                }
            }
        },
        tmp: {
            type: "dir",
            children: {}
        }
    }
};
