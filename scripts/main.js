import {
    apps,
    contactLinks,
    profile,
    projects,
    quickNotes,
    resumeStats,
    skills,
    virtualFileSystem,
    wallpapers
} from "./data.js";

const windowLabels = Object.fromEntries(apps.map((app) => [app.id, app.name]));
const bootTime = Date.now();
const builtins = [
    "alias", "apps", "basename", "bc", "cal", "cat", "cd", "chmod", "chown", "clear", "cp", "curl",
    "date", "df", "dirname", "du", "echo", "env", "explorer", "export", "file", "find", "free",
    "games", "git", "grep", "head", "help", "history", "hostname", "id", "kill", "less", "ln",
    "ls", "man", "mkdir", "mv", "nano", "neofetch", "open", "ping", "printenv", "projects",
    "pwd", "realpath", "reset", "resume", "rm", "rmdir", "seq", "skills", "sleep", "sort",
    "stat", "tail", "terminal", "time", "top", "touch", "tree", "uname", "uniq", "uptime",
    "wc", "wallpaper", "widgets", "which", "whoami", "write", "yes"
];

const state = {
    zIndex: 20,
    explorerPath: profile.home,
    selectedFilePath: `${profile.home}/README.txt`,
    wallpaperIndex: 0,
    calculator: "0",
    terminal: {
        cwd: profile.home,
        history: [],
        historyIndex: 0,
        aliases: {
            ll: "ls -la",
            la: "ls -a",
            cls: "clear"
        },
        env: {
            USER: profile.username,
            HOME: profile.home,
            HOSTNAME: profile.host,
            SHELL: profile.shell,
            PATH: "/bin:/usr/bin:/usr/local/bin",
            LANG: "en_US.UTF-8",
            TERM: "xterm-256color",
            PWD: profile.home
        }
    },
    snake: {
        size: 12,
        running: false,
        timer: null,
        dir: "right",
        pendingDir: "right",
        score: 0,
        snake: [{ x: 4, y: 5 }, { x: 3, y: 5 }, { x: 2, y: 5 }],
        food: { x: 8, y: 5 }
    },
    mines: {
        size: 8,
        mineCount: 9,
        cells: [],
        revealed: 0,
        over: false
    },
    reaction: {
        armed: false,
        ready: false,
        start: 0,
        timer: null
    }
};

function init() {
    applyWallpaper(wallpapers[0].id);
    renderProfile();
    renderProjects();
    renderSkills();
    renderContacts();
    renderResume();
    renderExplorer();
    renderWallpapers();
    renderCalculator();
    renderSystemLines();
    renderWidgets();
    resetSnake();
    resetMines();

    setupWindowControls();
    setupDesktopOpeners();
    setupDragging();
    setupStartMenu();
    setupContextMenu();
    setupTerminal();
    setupExplorer();
    setupDisplay();
    setupUtilities();
    setupGames();

    updateClock();
    setInterval(updateClock, 30000);
    setInterval(renderWidgets, 5000);
    setInterval(renderSystemLines, 3500);

    ["about", "projects", "terminal"].forEach(openWindow);
}

function getWindows() {
    return new Map(
        [...document.querySelectorAll("[data-window]")].map((windowElement) => [
            windowElement.dataset.window,
            windowElement
        ])
    );
}

function renderProfile() {
    setText("[data-profile-summary]", profile.summary);
    setText("[data-profile-name]", profile.name);
    setText("[data-current-track]", profile.currentTrack);

    const emailLink = document.querySelector("[data-profile-email]");
    if (emailLink) {
        emailLink.textContent = profile.email;
        emailLink.href = `mailto:${profile.email}`;
    }

    const githubLink = document.querySelector("[data-profile-github]");
    if (githubLink) {
        githubLink.textContent = profile.handle;
        githubLink.href = profile.github;
    }

    const focusList = document.getElementById("focusList");
    if (focusList) {
        focusList.innerHTML = profile.focus.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    }
}

function renderProjects() {
    const projectsList = document.getElementById("projectsList");
    const projectCount = document.getElementById("projectCount");
    if (!projectsList) return;

    projectsList.innerHTML = projects.map((project) => {
        const tags = project.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
        const action = project.github
            ? `<a class="win-button" href="${escapeAttr(project.github)}" target="_blank" rel="noreferrer">GitHub</a>`
            : `<span class="win-button is-disabled" aria-disabled="true">No Link</span>`;

        return `
            <article class="project-file" data-project-id="${escapeAttr(project.id)}">
                <div class="project-file__main">
                    <div class="project-file__title">
                        <span class="project-file__icon" aria-hidden="true"></span>
                        <span>${escapeHtml(project.file)}</span>
                    </div>
                    <div class="project-file__name">${escapeHtml(project.name)}</div>
                    <div class="project-file__kind">${escapeHtml(project.kind)}</div>
                    <p class="project-file__desc">${escapeHtml(project.desc)}</p>
                    <div class="project-tags">${tags}</div>
                </div>
                <div class="project-file__meta">
                    <span class="project-status">${escapeHtml(project.status)}</span>
                    ${action}
                </div>
            </article>
        `;
    }).join("");

    if (projectCount) {
        projectCount.textContent = `${projects.length} objects`;
    }
}

function renderSkills() {
    const skillsList = document.getElementById("skillsList");
    if (!skillsList) return;

    skillsList.innerHTML = skills.map((skill) => {
        const level = clamp(Number(skill.level), 0, 100);
        return `
            <div class="skill-row">
                <div>
                    <div class="skill-name">${escapeHtml(skill.name)}</div>
                    <div class="skill-category">${escapeHtml(skill.category)}</div>
                </div>
                <div class="skill-meter" style="--level: ${level}%;" aria-hidden="true"></div>
                <div class="skill-level">${level}%</div>
            </div>
        `;
    }).join("");
}

function renderContacts() {
    const contactStack = document.getElementById("contactLinks");
    if (!contactStack) return;

    contactStack.innerHTML = contactLinks.map((link) => `
        <div class="contact-item">
            <span class="contact-label">${escapeHtml(link.label)}</span>
            <a href="${escapeAttr(link.href)}" target="${link.href.startsWith("mailto:") ? "_self" : "_blank"}" rel="noreferrer">
                ${escapeHtml(link.value)}
            </a>
        </div>
    `).join("");
}

function renderResume() {
    const stats = document.getElementById("resumeStats");
    if (!stats) return;

    stats.innerHTML = resumeStats.map((item) => `
        <article class="resume-stat">
            <strong>${escapeHtml(item.value)}</strong>
            <span>${escapeHtml(item.label)}</span>
        </article>
    `).join("");
}

function renderExplorer() {
    const pathInput = document.getElementById("explorerPath");
    const tree = document.getElementById("explorerTree");
    const files = document.getElementById("explorerFiles");
    const preview = document.getElementById("explorerPreview");
    if (!pathInput || !tree || !files || !preview) return;

    const current = getNode(state.explorerPath);
    if (!current || current.node.type !== "dir") {
        state.explorerPath = profile.home;
    }

    pathInput.value = state.explorerPath;
    tree.innerHTML = [
        ["/", "Root"],
        [profile.home, "Home"],
        [`${profile.home}/Desktop`, "Desktop"],
        [`${profile.home}/Documents`, "Documents"],
        [`${profile.home}/Projects`, "Projects"],
        ["/etc", "etc"],
        ["/var/log", "Logs"],
        ["/usr/share/wallpapers", "Wallpapers"]
    ].map(([path, label]) => `
        <button type="button" class="${path === state.explorerPath ? "is-selected" : ""}" data-explorer-nav="${escapeAttr(path)}">${escapeHtml(label)}</button>
    `).join("");

    const entries = listDir(state.explorerPath, { all: false });
    const rows = [];
    if (state.explorerPath !== "/") {
        rows.push(`<button type="button" class="file-row" data-explorer-nav="${escapeAttr(dirname(state.explorerPath))}"><span class="file-row__icon">[..]</span><span>..</span><span>Directory</span></button>`);
    }

    rows.push(...entries.map((entry) => {
        const fullPath = joinPath(state.explorerPath, entry.name);
        const action = entry.node.type === "dir" ? "data-explorer-nav" : "data-explorer-file";
        return `
            <button type="button" class="file-row${fullPath === state.selectedFilePath ? " is-selected" : ""}" ${action}="${escapeAttr(fullPath)}">
                <span class="file-row__icon">${entry.node.type === "dir" ? "[DIR]" : "[TXT]"}</span>
                <span>${escapeHtml(entry.name)}</span>
                <span>${entry.node.type === "dir" ? "Directory" : `${nodeSize(entry.node)} bytes`}</span>
            </button>
        `;
    }));

    files.innerHTML = rows.join("");
    renderExplorerPreview();
}

function renderExplorerPreview() {
    const preview = document.getElementById("explorerPreview");
    if (!preview) return;

    const selected = getNode(state.selectedFilePath);
    if (!selected || selected.node.type !== "file") {
        const current = getNode(state.explorerPath);
        const count = current?.node.type === "dir" ? Object.keys(current.node.children).length : 0;
        preview.innerHTML = `
            <h2>Folder</h2>
            <p>${escapeHtml(state.explorerPath)}</p>
            <p>${count} objects</p>
        `;
        return;
    }

    preview.innerHTML = `
        <h2>${escapeHtml(basename(state.selectedFilePath))}</h2>
        <pre>${escapeHtml(selected.node.content)}</pre>
    `;
}

function renderWallpapers() {
    const list = document.getElementById("wallpaperList");
    if (!list) return;

    list.innerHTML = wallpapers.map((wallpaper, index) => `
        <button class="wallpaper-option${index === state.wallpaperIndex ? " is-selected" : ""}" type="button" data-wallpaper-id="${escapeAttr(wallpaper.id)}">
            <span style="background: ${escapeAttr(wallpaper.swatch)}"></span>
            <strong>${escapeHtml(wallpaper.name)}</strong>
        </button>
    `).join("");
}

function renderCalculator() {
    const display = document.getElementById("calcDisplay");
    const buttons = document.getElementById("calcButtons");
    if (!display || !buttons) return;

    display.value = state.calculator;
    const labels = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+", "C", "Back", "(", ")"];
    buttons.innerHTML = labels.map((label) => `<button type="button" class="win-button" data-calc="${escapeAttr(label)}">${escapeHtml(label)}</button>`).join("");
}

function renderSystemLines() {
    const target = document.getElementById("utilitySystem");
    if (!target) return;

    const uptime = formatDuration(Date.now() - bootTime);
    const cpu = getResourceValue(32, 91);
    const memory = getResourceValue(41, 88);
    target.innerHTML = [
        ["Host", profile.host],
        ["User", profile.username],
        ["Shell", profile.shell],
        ["Windows", String([...getWindows().values()].filter((item) => item.classList.contains("is-open")).length)],
        ["CPU", `${cpu}%`],
        ["Memory", `${memory}%`],
        ["Uptime", uptime]
    ].map(([key, value]) => `<div><strong>${escapeHtml(key)}</strong><span>${escapeHtml(value)}</span></div>`).join("");
}

function renderWidgets() {
    const now = new Date();
    setText("#widgetClock", now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    setText("#widgetDate", now.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric", year: "numeric" }));

    const calendar = document.getElementById("calendarGrid");
    if (calendar) {
        calendar.innerHTML = buildCalendar(now).map((cell) => `<span class="${cell.today ? "is-today" : ""}">${escapeHtml(cell.label)}</span>`).join("");
    }

    setMeter("#cpuMeter", getResourceValue(26, 89));
    setMeter("#memMeter", getResourceValue(38, 93));
    setMeter("#netMeter", getResourceValue(12, 72));

    const notes = document.getElementById("widgetNotes");
    if (notes) {
        notes.innerHTML = quickNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join("");
    }
}

function setupWindowControls() {
    document.querySelectorAll("[data-window]").forEach((windowElement) => {
        windowElement.addEventListener("pointerdown", () => {
            activateWindow(windowElement.dataset.window);
        });
    });

    document.querySelectorAll(".window-control").forEach((control) => {
        control.addEventListener("click", (event) => {
            event.stopPropagation();
            const windowElement = control.closest("[data-window]");
            if (!windowElement) return;

            const windowId = windowElement.dataset.window;
            const action = control.dataset.action;

            if (action === "close") closeWindow(windowId);
            if (action === "minimize") minimizeWindow(windowId);
            if (action === "maximize") toggleMaximize(windowId);
        });
    });
}

function setupDesktopOpeners() {
    document.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-open]");
        if (!trigger) return;

        const windowId = trigger.dataset.open;
        openWindow(windowId);
        closeStartMenu();
        closeContextMenu();
    });
}

function setupDragging() {
    const workspace = document.getElementById("workspace");
    if (!workspace) return;

    document.querySelectorAll("[data-drag-handle]").forEach((handle) => {
        const windowElement = handle.closest("[data-window]");
        if (!windowElement) return;

        handle.addEventListener("pointerdown", (event) => {
            if (event.button !== 0) return;
            if (event.target.closest(".window-controls")) return;
            if (window.matchMedia("(max-width: 780px)").matches) return;
            if (windowElement.classList.contains("is-maximized")) return;

            event.preventDefault();
            activateWindow(windowElement.dataset.window);

            const workspaceRect = workspace.getBoundingClientRect();
            const windowRect = windowElement.getBoundingClientRect();
            const offsetX = event.clientX - windowRect.left;
            const offsetY = event.clientY - windowRect.top;

            handle.setPointerCapture(event.pointerId);

            const moveWindow = (moveEvent) => {
                const maxLeft = Math.max(8, workspace.clientWidth - windowElement.offsetWidth - 8);
                const maxTop = Math.max(8, workspace.clientHeight - windowElement.offsetHeight - 8);
                const nextLeft = clamp(moveEvent.clientX - workspaceRect.left - offsetX, 8, maxLeft);
                const nextTop = clamp(moveEvent.clientY - workspaceRect.top - offsetY, 8, maxTop);

                windowElement.style.left = `${nextLeft}px`;
                windowElement.style.top = `${nextTop}px`;
            };

            const stopDragging = (upEvent) => {
                handle.removeEventListener("pointermove", moveWindow);
                handle.removeEventListener("pointerup", stopDragging);
                handle.removeEventListener("pointercancel", stopDragging);

                if (handle.hasPointerCapture(upEvent.pointerId)) {
                    handle.releasePointerCapture(upEvent.pointerId);
                }
            };

            handle.addEventListener("pointermove", moveWindow);
            handle.addEventListener("pointerup", stopDragging);
            handle.addEventListener("pointercancel", stopDragging);
        });
    });
}

function setupStartMenu() {
    const startButton = document.getElementById("startButton");
    const startMenu = document.getElementById("startMenu");
    if (!startButton || !startMenu) return;

    startButton.setAttribute("aria-expanded", "false");

    startButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = !startMenu.hasAttribute("hidden");
        startMenu.toggleAttribute("hidden", isOpen);
        startButton.setAttribute("aria-expanded", String(!isOpen));
        closeContextMenu();
    });

    document.addEventListener("pointerdown", (event) => {
        if (!startMenu.hasAttribute("hidden") && !startMenu.contains(event.target) && !startButton.contains(event.target)) {
            closeStartMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeStartMenu();
            closeContextMenu();
        }
    });
}

function setupContextMenu() {
    const menu = document.getElementById("contextMenu");
    const workspace = document.getElementById("workspace");
    if (!menu || !workspace) return;

    document.addEventListener("contextmenu", (event) => {
        const target = event.target;
        if (target.closest("input, textarea, a")) return;
        event.preventDefault();
        closeStartMenu();
        const left = clamp(event.clientX, 4, window.innerWidth - 190);
        const top = clamp(event.clientY, 4, window.innerHeight - 230);
        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
        menu.removeAttribute("hidden");
    });

    menu.addEventListener("click", (event) => {
        const item = event.target.closest("[data-context-action]");
        if (!item) return;
        event.stopPropagation();
        handleContextAction(item.dataset.contextAction);
        closeContextMenu();
    });

    document.addEventListener("click", (event) => {
        const item = event.target.closest("[data-context-action]");
        if (!item || item.closest("#contextMenu")) return;
        handleContextAction(item.dataset.contextAction);
    });

    document.addEventListener("pointerdown", (event) => {
        if (!menu.hasAttribute("hidden") && !menu.contains(event.target)) {
            closeContextMenu();
        }
    });
}

function setupTerminal() {
    const output = document.getElementById("terminalOutput");
    const form = document.getElementById("terminalForm");
    const input = document.getElementById("terminalInput");
    if (!output || !form || !input) return;

    printTerminal([
        "White OS 3.1 Browser Edition",
        "Type 'help --all', 'man ls', 'tree', 'apps', or 'neofetch'."
    ]);
    updatePrompt();

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const command = input.value.trim();
        if (!command) return;

        state.terminal.history.push(command);
        state.terminal.historyIndex = state.terminal.history.length;
        printTerminal([`${getPrompt()} ${command}`], true);
        input.value = "";
        runCommand(command);
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp") {
            event.preventDefault();
            state.terminal.historyIndex = clamp(state.terminal.historyIndex - 1, 0, state.terminal.history.length);
            input.value = state.terminal.history[state.terminal.historyIndex] || "";
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            state.terminal.historyIndex = clamp(state.terminal.historyIndex + 1, 0, state.terminal.history.length);
            input.value = state.terminal.history[state.terminal.historyIndex] || "";
        }

        if (event.key.toLowerCase() === "l" && event.ctrlKey) {
            event.preventDefault();
            clearTerminal();
        }

        if (event.key === "Tab") {
            event.preventDefault();
            input.value = completeCommand(input.value);
        }
    });
}

function setupExplorer() {
    const pathInput = document.getElementById("explorerPath");
    const go = document.getElementById("explorerGo");
    const up = document.getElementById("explorerUp");
    const explorer = document.getElementById("window-explorer");
    if (!pathInput || !go || !up || !explorer) return;

    explorer.addEventListener("click", (event) => {
        const nav = event.target.closest("[data-explorer-nav]");
        const file = event.target.closest("[data-explorer-file]");

        if (nav) {
            setExplorerPath(nav.dataset.explorerNav);
        }

        if (file) {
            state.selectedFilePath = file.dataset.explorerFile;
            renderExplorerPreview();
            renderExplorer();
        }
    });

    go.addEventListener("click", () => setExplorerPath(pathInput.value));
    up.addEventListener("click", () => setExplorerPath(dirname(state.explorerPath)));
    pathInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") setExplorerPath(pathInput.value);
    });
}

function setupDisplay() {
    const list = document.getElementById("wallpaperList");
    const cycle = document.getElementById("cycleWallpaper");
    if (list) {
        list.addEventListener("click", (event) => {
            const item = event.target.closest("[data-wallpaper-id]");
            if (item) applyWallpaper(item.dataset.wallpaperId);
        });
    }
    cycle?.addEventListener("click", cycleWallpaper);
}

function setupUtilities() {
    const calcButtons = document.getElementById("calcButtons");
    const runButton = document.getElementById("runButton");
    const runInput = document.getElementById("runInput");

    calcButtons?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-calc]");
        if (button) handleCalculator(button.dataset.calc);
    });

    document.querySelectorAll("[data-utility-focus]").forEach((button) => {
        button.addEventListener("click", () => document.getElementById(`utility-${button.dataset.utilityFocus}`)?.scrollIntoView({ block: "nearest" }));
    });

    runButton?.addEventListener("click", () => runUtilityCommand(runInput?.value || ""));
    runInput?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") runUtilityCommand(runInput.value);
    });

    const notePad = document.getElementById("notePad");
    try {
        const saved = localStorage.getItem("white-os-notepad");
        if (saved && notePad) notePad.value = saved;
        notePad?.addEventListener("input", () => localStorage.setItem("white-os-notepad", notePad.value));
    } catch {
        // Storage can be blocked in some browser modes.
    }
}

function setupGames() {
    document.querySelectorAll("[data-game-view]").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelector(`[data-game-panel="${button.dataset.gameView}"]`)?.scrollIntoView({ block: "nearest" });
        });
    });

    document.getElementById("snakeStart")?.addEventListener("click", startSnake);
    document.getElementById("snakeReset")?.addEventListener("click", resetSnake);
    document.querySelectorAll("[data-snake-dir]").forEach((button) => {
        button.addEventListener("click", () => setSnakeDirection(button.dataset.snakeDir));
    });
    document.addEventListener("keydown", (event) => {
        if (event.target.closest("input, textarea")) return;
        const map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right" };
        if (map[event.key]) setSnakeDirection(map[event.key]);
    });

    document.getElementById("mineReset")?.addEventListener("click", resetMines);
    document.getElementById("mineBoard")?.addEventListener("click", (event) => {
        const cell = event.target.closest("[data-mine-index]");
        if (cell) revealMineCell(Number(cell.dataset.mineIndex));
    });

    document.getElementById("reactionStart")?.addEventListener("click", startReaction);
    document.getElementById("reactionTarget")?.addEventListener("click", hitReactionTarget);
}

function handleContextAction(action) {
    if (action === "open-explorer") openWindow("explorer");
    if (action === "open-terminal") openWindow("terminal");
    if (action === "display") openWindow("display");
    if (action === "wallpaper-cycle") cycleWallpaper();
    if (action === "refresh") {
        renderExplorer();
        renderWidgets();
        renderSystemLines();
        document.getElementById("workspace")?.classList.add("is-refreshing");
        window.setTimeout(() => document.getElementById("workspace")?.classList.remove("is-refreshing"), 180);
    }
    if (action === "minimize-all") {
        getWindows().forEach((windowElement, windowId) => {
            if (windowElement.classList.contains("is-open")) minimizeWindow(windowId);
        });
    }
}

function runCommand(rawCommand) {
    if (rawCommand === "clear" || rawCommand === "reset" || rawCommand === "cls") {
        clearTerminal();
        return;
    }

    const output = executeCommandLine(rawCommand);
    printTerminal(output.length ? output : [""]);
    updatePrompt();
}

function executeCommandLine(rawCommand) {
    const expanded = expandAlias(rawCommand);
    const stages = splitOutsideQuotes(expanded, "|").map((part) => part.trim()).filter(Boolean);
    let input = null;
    let output = [];

    for (const stage of stages.length ? stages : [expanded]) {
        const redirect = parseRedirection(stage);
        const args = parseArgs(redirect.command).map(expandVariables);
        if (args.length === 0) continue;
        output = executeCommand(args[0], args.slice(1), input);
        input = output;

        if (redirect.path) {
            const path = normalizePath(redirect.path, state.terminal.cwd);
            const previous = redirect.append ? readFile(path) : "";
            writeFile(path, `${previous}${previous && redirect.append ? "\n" : ""}${output.join("\n")}`);
            output = [];
            input = output;
        }
    }

    return output;
}

function executeCommand(command, args, input = null) {
    const cmd = command.toLowerCase();

    switch (cmd) {
        case "help":
            return commandHelp(args);
        case "man":
            return commandMan(args[0]);
        case "pwd":
            return [state.terminal.cwd];
        case "cd":
            return commandCd(args[0]);
        case "ls":
        case "dir":
            return commandLs(args);
        case "tree":
            return commandTree(args);
        case "cat":
        case "less":
            return commandCat(args, input);
        case "head":
            return sliceLines(args, input, "head");
        case "tail":
            return sliceLines(args, input, "tail");
        case "grep":
            return commandGrep(args, input);
        case "find":
            return commandFind(args);
        case "wc":
            return commandWc(args, input);
        case "sort":
            return (input || readMany(args)).slice().sort((a, b) => a.localeCompare(b));
        case "uniq":
            return uniqueLines(input || readMany(args));
        case "echo":
            return [args.join(" ")];
        case "printf":
            return [args.join(" ").replaceAll("\\n", "\n").replaceAll("\\t", "\t")];
        case "touch":
            return commandTouch(args);
        case "mkdir":
            return commandMkdir(args);
        case "rm":
            return commandRm(args);
        case "rmdir":
            return commandRm(args.map((arg) => arg === "-r" ? arg : arg));
        case "cp":
            return commandCp(args, false);
        case "mv":
            return commandCp(args, true);
        case "write":
            return commandWrite(args);
        case "nano":
        case "vi":
        case "vim":
            return commandEditor(args[0]);
        case "date":
        case "time":
            return [new Date().toString()];
        case "cal":
            return renderCal(args);
        case "whoami":
            return [profile.username];
        case "id":
            return [`uid=1000(${profile.username}) gid=1000(${profile.username}) groups=1000(${profile.username}),27(sudo),100(users)`];
        case "uname":
            return [args.includes("-a") ? "WhiteOS white-os 3.1.0-browser x86_64 GNU/Linux" : "WhiteOS"];
        case "hostname":
            return [profile.host];
        case "neofetch":
            return commandNeofetch();
        case "ps":
            return commandPs();
        case "top":
            return commandTop();
        case "kill":
            return [`kill: (${args[0] || ""}) - No such process in browser shell`];
        case "df":
            return ["Filesystem     1K-blocks  Used Available Use% Mounted on", "whitefs          524288 18432    505856   4% /", "tmpfs             65536   256     65280   1% /tmp"];
        case "du":
            return commandDu(args);
        case "free":
            return ["              total        used        free      shared  buff/cache   available", "Mem:        1048576      392192      428032       16384      228352      590848", "Swap:        262144           0      262144"];
        case "uptime":
            return [`${new Date().toLocaleTimeString()} up ${formatDuration(Date.now() - bootTime)}, 1 user, load average: 0.08, 0.11, 0.09`];
        case "history":
            return state.terminal.history.map((item, index) => `${String(index + 1).padStart(4, " ")}  ${item}`);
        case "env":
            return Object.entries(state.terminal.env).map(([key, value]) => `${key}=${value}`);
        case "printenv":
            return args[0] ? [state.terminal.env[args[0]] || ""] : executeCommand("env", []);
        case "export":
            return commandExport(args);
        case "alias":
            return commandAlias(args);
        case "which":
            return args.map((name) => builtins.includes(name) ? `/bin/${name}` : `${name} not found`);
        case "file":
            return commandFile(args);
        case "stat":
            return commandStat(args);
        case "basename":
            return [basename(args[0] || state.terminal.cwd)];
        case "dirname":
            return [dirname(normalizePath(args[0] || state.terminal.cwd, state.terminal.cwd))];
        case "realpath":
            return [normalizePath(args[0] || ".", state.terminal.cwd)];
        case "seq":
            return commandSeq(args);
        case "yes":
            return Array(20).fill(args.join(" ") || "y");
        case "sleep":
            return [`slept ${args[0] || 1}s (simulated)`];
        case "ping":
            return commandPing(args[0]);
        case "curl":
        case "wget":
            return commandNetwork(cmd, args);
        case "git":
            return commandGit(args);
        case "sudo":
            return [`${profile.username} is already trusted here. Command not elevated in browser shell.`];
        case "chmod":
        case "chown":
        case "ln":
        case "tar":
        case "gzip":
        case "gunzip":
            return [`${cmd}: operation simulated; no host filesystem changes were made.`];
        case "bc":
        case "calc":
            return [String(calculateExpression(args.join(" ")))];
        case "apps":
            return apps.map((app) => `${app.command.padEnd(10)} ${app.file.padEnd(16)} ${app.desc}`);
        case "open":
        case "start":
            return commandOpen(args);
        case "explorer":
        case "terminal":
        case "projects":
        case "skills":
        case "contact":
        case "resume":
        case "games":
        case "widgets":
        case "utilities":
        case "display":
        case "about":
            openWindow(cmd);
            return [`Opening ${windowLabels[cmd] || cmd}...`];
        case "github":
            openExternal(profile.github);
            return ["Opening GitHub profile..."];
        case "wallpaper":
            return commandWallpaper(args);
        case "clear":
        case "reset":
        case "cls":
            clearTerminal();
            return [];
        default:
            return [`${command}: command not found`, "Type 'help --all' for available commands."];
    }
}

function commandHelp(args) {
    if (args.includes("--all")) {
        return [
            "Built-ins:",
            wrapWords(builtins.join(" "), 76),
            "",
            "Try: ls -la, cd Projects, cat README.txt, grep -R kernel Projects, tree, find / -name '*.md',",
            "     ps aux, df -h, free -m, git status, wallpaper list, open explorer"
        ].flat();
    }

    return [
        "Common commands:",
        "ls cd pwd tree cat grep find touch mkdir rm cp mv echo clear history",
        "ps top df du free env export alias which file stat man neofetch",
        "apps open wallpaper explorer games widgets utilities display github",
        "Type 'help --all' for the full command list."
    ];
}

function commandMan(topic) {
    const pages = {
        ls: "ls [-la] [path] - list directory contents.",
        cd: "cd [path] - change current directory. Supports /, .., ., and ~.",
        grep: "grep [-i] [-n] [-R] pattern [file|dir] - search text.",
        find: "find [path] [-name pattern] - recursively list files.",
        wallpaper: "wallpaper list|next|set <id> - control desktop wallpaper.",
        open: "open <app|path> - open desktop apps or preview a file in Explorer.",
        shell: "This is a browser-hosted shell backed by a virtual filesystem."
    };
    return [pages[topic] || `No manual entry for ${topic || ""}. Try man ls, man grep, or help --all.`];
}

function commandCd(path = profile.home) {
    const nextPath = normalizePath(path, state.terminal.cwd);
    const next = getNode(nextPath);
    if (!next) return [`cd: no such file or directory: ${path}`];
    if (next.node.type !== "dir") return [`cd: not a directory: ${path}`];
    state.terminal.cwd = nextPath;
    state.terminal.env.PWD = nextPath;
    return [];
}

function commandLs(args) {
    const flags = args.filter((arg) => arg.startsWith("-")).join("");
    const paths = args.filter((arg) => !arg.startsWith("-"));
    const all = flags.includes("a");
    const long = flags.includes("l");
    const targets = paths.length ? paths : ["."];
    const lines = [];

    targets.forEach((target, targetIndex) => {
        const path = normalizePath(target, state.terminal.cwd);
        const found = getNode(path);
        if (!found) {
            lines.push(`ls: cannot access '${target}': No such file or directory`);
            return;
        }

        if (targets.length > 1) lines.push(`${targetIndex ? "" : ""}${path}:`);

        if (found.node.type === "file") {
            lines.push(long ? formatLongListing(basename(path), found.node) : basename(path));
            return;
        }

        const entries = listDir(path, { all });
        if (!long) {
            lines.push(entries.map((entry) => `${entry.name}${entry.node.type === "dir" ? "/" : ""}`).join("  "));
            return;
        }

        entries.forEach((entry) => lines.push(formatLongListing(entry.name, entry.node)));
    });

    return lines;
}

function commandTree(args) {
    const pathArg = args.find((arg) => !arg.startsWith("-")) || ".";
    const path = normalizePath(pathArg, state.terminal.cwd);
    const found = getNode(path);
    if (!found || found.node.type !== "dir") return [`tree: ${pathArg}: No such directory`];

    const lines = [path];
    walkTree(found.node, "", lines, 0, 5);
    return lines;
}

function commandCat(args, input) {
    if (input) return input;
    if (!args.length) return ["cat: missing file operand"];

    return args.flatMap((arg) => {
        const content = readFile(normalizePath(arg, state.terminal.cwd));
        return content === null ? [`cat: ${arg}: No such file`] : content.split("\n");
    });
}

function sliceLines(args, input, mode) {
    let count = 10;
    const nIndex = args.indexOf("-n");
    if (nIndex >= 0 && args[nIndex + 1]) count = Number(args[nIndex + 1]) || 10;
    const compact = args.find((arg) => /^-\d+$/.test(arg));
    if (compact) count = Math.abs(Number(compact));

    const files = args.filter((arg, index) => arg !== "-n" && index !== nIndex + 1 && !/^-\d+$/.test(arg));
    const lines = input || readMany(files);
    return mode === "head" ? lines.slice(0, count) : lines.slice(-count);
}

function commandGrep(args, input) {
    const insensitive = args.includes("-i");
    const lineNumbers = args.includes("-n");
    const recursive = args.includes("-R") || args.includes("-r");
    const cleanArgs = args.filter((arg) => !["-i", "-n", "-R", "-r"].includes(arg));
    const pattern = cleanArgs[0];
    const targets = cleanArgs.slice(1);
    if (!pattern) return ["grep: missing pattern"];

    const matcher = insensitive
        ? (line) => line.toLowerCase().includes(pattern.toLowerCase())
        : (line) => line.includes(pattern);

    if (input) {
        return input
            .map((line, index) => ({ line, index }))
            .filter(({ line }) => matcher(line))
            .map(({ line, index }) => lineNumbers ? `${index + 1}:${line}` : line);
    }

    const files = targets.length ? targets : ["."];
    const results = [];
    files.forEach((target) => {
        const path = normalizePath(target, state.terminal.cwd);
        const found = getNode(path);
        if (!found) {
            results.push(`grep: ${target}: No such file or directory`);
            return;
        }

        const candidates = found.node.type === "dir" && recursive
            ? collectFiles(path)
            : [{ path, node: found.node }];

        candidates.forEach((candidate) => {
            if (candidate.node.type !== "file") return;
            candidate.node.content.split("\n").forEach((line, index) => {
                if (matcher(line)) {
                    const prefix = targets.length > 1 || recursive ? `${candidate.path}:` : "";
                    results.push(`${prefix}${lineNumbers ? `${index + 1}:` : ""}${line}`);
                }
            });
        });
    });
    return results;
}

function commandFind(args) {
    const start = args[0] && !args[0].startsWith("-") ? args[0] : ".";
    const nameIndex = args.indexOf("-name");
    const pattern = nameIndex >= 0 ? args[nameIndex + 1] : "";
    const path = normalizePath(start, state.terminal.cwd);
    const found = getNode(path);
    if (!found) return [`find: '${start}': No such file or directory`];

    const results = [];
    const visit = (node, currentPath) => {
        const name = basename(currentPath);
        if (!pattern || wildcardMatch(name, pattern)) results.push(currentPath);
        if (node.type === "dir") {
            Object.entries(node.children).forEach(([childName, child]) => visit(child, joinPath(currentPath, childName)));
        }
    };
    visit(found.node, path);
    return results;
}

function commandWc(args, input) {
    const lines = input || readMany(args);
    const text = lines.join("\n");
    return [`${String(lines.length).padStart(7)} ${String(text.trim() ? text.trim().split(/\s+/).length : 0).padStart(7)} ${String(text.length).padStart(7)}`];
}

function commandTouch(args) {
    if (!args.length) return ["touch: missing file operand"];
    args.forEach((arg) => writeFile(normalizePath(arg, state.terminal.cwd), readFile(normalizePath(arg, state.terminal.cwd)) || ""));
    renderExplorer();
    return [];
}

function commandMkdir(args) {
    if (!args.length) return ["mkdir: missing operand"];
    const lines = [];
    args.filter((arg) => arg !== "-p").forEach((arg) => {
        const result = makeDir(normalizePath(arg, state.terminal.cwd), args.includes("-p"));
        if (result) lines.push(result);
    });
    renderExplorer();
    return lines;
}

function commandRm(args) {
    if (!args.length) return ["rm: missing operand"];
    const recursive = args.includes("-r") || args.includes("-rf") || args.includes("-fr");
    const force = args.includes("-f") || args.includes("-rf") || args.includes("-fr");
    const targets = args.filter((arg) => !arg.startsWith("-"));
    const lines = [];
    targets.forEach((target) => {
        const error = removePath(normalizePath(target, state.terminal.cwd), { recursive, force });
        if (error) lines.push(error);
    });
    renderExplorer();
    return lines;
}

function commandCp(args, move) {
    if (args.length < 2) return [`${move ? "mv" : "cp"}: missing file operand`];
    const source = normalizePath(args[0], state.terminal.cwd);
    const dest = normalizePath(args[1], state.terminal.cwd);
    const sourceNode = getNode(source);
    if (!sourceNode) return [`${move ? "mv" : "cp"}: cannot stat '${args[0]}': No such file or directory`];
    const copy = cloneNode(sourceNode.node);
    const error = putNode(dest, copy);
    if (error) return [error];
    if (move) removePath(source, { recursive: true, force: true });
    renderExplorer();
    return [];
}

function commandWrite(args) {
    if (args.length < 2) return ["write: usage: write <file> <text>"];
    const path = normalizePath(args[0], state.terminal.cwd);
    writeFile(path, args.slice(1).join(" "));
    renderExplorer();
    return [`wrote ${path}`];
}

function commandEditor(pathArg) {
    openWindow("utilities");
    const notePad = document.getElementById("notePad");
    if (pathArg && notePad) {
        const path = normalizePath(pathArg, state.terminal.cwd);
        notePad.value = readFile(path) || "";
    }
    return [`Opened editor${pathArg ? ` for ${pathArg}` : ""}.`];
}

function renderCal() {
    const now = new Date();
    const monthName = now.toLocaleString([], { month: "long", year: "numeric" });
    const cells = buildCalendar(now);
    const lines = [`     ${monthName}`, "Su Mo Tu We Th Fr Sa"];
    for (let i = 0; i < cells.length; i += 7) {
        lines.push(cells.slice(i, i + 7).map((cell) => String(cell.label || " ").padStart(2, " ")).join(" "));
    }
    return lines;
}

function commandNeofetch() {
    return [
        "        ____  White OS",
        "   ____/ / /  --------",
        "  / __  / /   OS: White OS 3.1 Browser Edition",
        " / /_/ /_/    Host: white.dev desktop",
        " \\__,_(_)     Shell: /bin/white-shell",
        `             Uptime: ${formatDuration(Date.now() - bootTime)}`,
        `             Packages: ${apps.length} apps, ${projects.length} projects`,
        `             WM: Retro Windows-style desktop`
    ];
}

function commandPs() {
    const rows = ["  PID TTY          TIME CMD"];
    rows.push("    1 ?        00:00:01 init");
    rows.push("   42 tty1     00:00:00 white-shell");
    [...getWindows().entries()]
        .filter(([, windowElement]) => windowElement.classList.contains("is-open"))
        .forEach(([id], index) => rows.push(`${String(100 + index).padStart(5)} tty1     00:00:00 ${id}`));
    return rows;
}

function commandTop() {
    return [
        `top - ${new Date().toLocaleTimeString()} up ${formatDuration(Date.now() - bootTime)}, 1 user, load average: 0.08, 0.11, 0.09`,
        "Tasks: 8 total, 1 running, 7 sleeping, 0 stopped, 0 zombie",
        "%Cpu(s):  4.2 us,  1.1 sy,  0.0 ni, 94.7 id",
        "MiB Mem : 1024.0 total, 383.0 used, 418.0 free, 223.0 buff/cache",
        "",
        "  PID USER      PR  NI    VIRT    RES S  %CPU %MEM     TIME+ COMMAND",
        "   42 white     20   0   16384   4096 R   3.1  0.4   0:01.21 white-shell",
        "  101 white     20   0   24576   8192 S   1.4  0.8   0:00.43 desktop"
    ];
}

function commandDu(args) {
    const path = normalizePath(args.find((arg) => !arg.startsWith("-")) || ".", state.terminal.cwd);
    const found = getNode(path);
    if (!found) return [`du: cannot access '${path}': No such file or directory`];
    return [`${Math.max(1, Math.ceil(nodeSize(found.node) / 1024))}\t${path}`];
}

function commandExport(args) {
    if (!args.length) return Object.entries(state.terminal.env).map(([key, value]) => `declare -x ${key}="${value}"`);
    args.forEach((assignment) => {
        const [key, ...value] = assignment.split("=");
        if (key) state.terminal.env[key] = value.join("=") || "";
    });
    return [];
}

function commandAlias(args) {
    if (!args.length) {
        return Object.entries(state.terminal.aliases).map(([key, value]) => `alias ${key}='${value}'`);
    }

    args.forEach((item) => {
        const [key, ...value] = item.split("=");
        if (key && value.length) {
            state.terminal.aliases[key] = value.join("=").replace(/^['"]|['"]$/g, "");
        }
    });
    return [];
}

function commandFile(args) {
    if (!args.length) return ["file: missing operand"];
    return args.map((arg) => {
        const path = normalizePath(arg, state.terminal.cwd);
        const found = getNode(path);
        if (!found) return `${arg}: cannot open`;
        return found.node.type === "dir" ? `${arg}: directory` : `${arg}: ASCII text`;
    });
}

function commandStat(args) {
    if (!args.length) return ["stat: missing operand"];
    return args.flatMap((arg) => {
        const path = normalizePath(arg, state.terminal.cwd);
        const found = getNode(path);
        if (!found) return [`stat: cannot stat '${arg}': No such file or directory`];
        return [
            `  File: ${path}`,
            `  Size: ${nodeSize(found.node)}\tType: ${found.node.type}`,
            "Access: 2026-05-03 00:00:00.000000000 +0000",
            "Modify: 2026-05-03 00:00:00.000000000 +0000"
        ];
    });
}

function commandSeq(args) {
    const nums = args.map(Number).filter((num) => Number.isFinite(num));
    const start = nums.length === 1 ? 1 : nums[0] || 1;
    const end = nums.length === 1 ? nums[0] : nums[1] || 1;
    const step = nums[2] || 1;
    const lines = [];
    for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
        lines.push(String(i));
        if (lines.length > 200) break;
    }
    return lines;
}

function commandPing(host = "localhost") {
    return [
        `PING ${host} (${host === "localhost" ? "127.0.0.1" : "93.184.216.34"}) 56(84) bytes of data.`,
        `64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.42 ms`,
        `64 bytes from ${host}: icmp_seq=2 ttl=64 time=0.37 ms`,
        `64 bytes from ${host}: icmp_seq=3 ttl=64 time=0.40 ms`,
        `--- ${host} ping statistics ---`,
        "3 packets transmitted, 3 received, 0% packet loss"
    ];
}

function commandNetwork(cmd, args) {
    const url = args.find((arg) => !arg.startsWith("-")) || "";
    if (!url) return [`${cmd}: missing URL`];
    if (url.includes("github.com/Whit31ister")) return [`${cmd}: fetched profile link: ${profile.github}`];
    return [`${cmd}: network calls are simulated in this static desktop. URL queued: ${url}`];
}

function commandGit(args) {
    const sub = args[0] || "status";
    if (sub === "status") return ["On branch main", "Your branch is up to date with 'origin/main'.", "", "nothing to commit, working tree clean"];
    if (sub === "log") return ["commit 3f1c9d2 White.dev desktop redesign", "commit 52bb893 Project window refresh", "commit 24a18ef Initial portfolio shell"];
    if (sub === "remote") return ["origin  https://github.com/Whit31ister/Personal-Websites.git (fetch)", "origin  https://github.com/Whit31ister/Personal-Websites.git (push)"];
    if (sub === "branch") return ["* main", "  desktop-redesign"];
    return [`git ${sub}: simulated command completed.`];
}

function commandOpen(args) {
    const target = args[0];
    if (!target) return ["open: usage: open <app|file|url>"];
    const app = apps.find((item) => item.id === target || item.command === target || item.name.toLowerCase() === target.toLowerCase());
    if (app) {
        openWindow(app.id);
        return [`Opening ${app.name}...`];
    }
    if (target === "github") {
        openExternal(profile.github);
        return ["Opening GitHub profile..."];
    }
    if (/^https?:\/\//.test(target)) {
        openExternal(target);
        return [`Opening ${target}...`];
    }

    const path = normalizePath(target, state.terminal.cwd);
    const found = getNode(path);
    if (!found) return [`open: ${target}: No such app or file`];
    state.explorerPath = found.node.type === "dir" ? path : dirname(path);
    state.selectedFilePath = found.node.type === "file" ? path : "";
    renderExplorer();
    openWindow("explorer");
    return [`Opening ${path} in Explorer...`];
}

function commandWallpaper(args) {
    if (!args.length || args[0] === "list") {
        return wallpapers.map((wallpaper, index) => `${index === state.wallpaperIndex ? "*" : " "} ${wallpaper.id.padEnd(14)} ${wallpaper.name}`);
    }
    if (args[0] === "next") {
        cycleWallpaper();
        return [`Wallpaper: ${wallpapers[state.wallpaperIndex].name}`];
    }
    if (args[0] === "set") {
        const target = args[1];
        if (!target) return ["wallpaper set: missing id"];
        applyWallpaper(target);
        return [`Wallpaper: ${wallpapers[state.wallpaperIndex].name}`];
    }
    return ["Usage: wallpaper list|next|set <id>"];
}

function readMany(args) {
    if (!args.length) return [];
    return args.flatMap((arg) => {
        const content = readFile(normalizePath(arg, state.terminal.cwd));
        return content === null ? [] : content.split("\n");
    });
}

function setExplorerPath(path) {
    const normalized = normalizePath(path, state.explorerPath);
    const found = getNode(normalized);
    if (!found || found.node.type !== "dir") return;
    state.explorerPath = normalized;
    state.selectedFilePath = "";
    renderExplorer();
}

function applyWallpaper(id) {
    const index = wallpapers.findIndex((wallpaper) => wallpaper.id === id);
    if (index < 0) return;
    const wallpaper = wallpapers[index];
    state.wallpaperIndex = index;
    document.documentElement.style.setProperty("--desktop-background", wallpaper.css);
    document.documentElement.style.setProperty("--desktop-background-size", wallpaper.size || "auto");
    document.getElementById("displayPreview")?.style.setProperty("--preview-background", wallpaper.css);
    renderWallpapers();
}

function cycleWallpaper() {
    const next = wallpapers[(state.wallpaperIndex + 1) % wallpapers.length];
    applyWallpaper(next.id);
}

function handleCalculator(value) {
    if (value === "C") state.calculator = "0";
    else if (value === "Back") state.calculator = state.calculator.length > 1 ? state.calculator.slice(0, -1) : "0";
    else if (value === "=") state.calculator = String(calculateExpression(state.calculator));
    else state.calculator = state.calculator === "0" ? value : state.calculator + value;

    const display = document.getElementById("calcDisplay");
    if (display) display.value = state.calculator;
}

function calculateExpression(expression) {
    if (!/^[0-9+\-*/().%\s]+$/.test(expression)) return "Error";
    try {
        const result = Function(`"use strict"; return (${expression})`)();
        return Number.isFinite(result) ? Math.round(result * 1000000) / 1000000 : "Error";
    } catch {
        return "Error";
    }
}

function runUtilityCommand(command) {
    const runStatus = document.getElementById("runStatus");
    if (!command.trim()) return;
    const app = apps.find((item) => item.command === command.trim().toLowerCase() || item.id === command.trim().toLowerCase());
    if (app) {
        openWindow(app.id);
        if (runStatus) runStatus.textContent = `Opened ${app.name}.`;
        return;
    }

    openWindow("terminal");
    printTerminal([`${getPrompt()} ${command}`], true);
    const output = executeCommandLine(command);
    printTerminal(output.length ? output : [""]);
    if (runStatus) runStatus.textContent = "Sent to Terminal.";
}

function resetSnake() {
    window.clearInterval(state.snake.timer);
    state.snake.running = false;
    state.snake.dir = "right";
    state.snake.pendingDir = "right";
    state.snake.score = 0;
    state.snake.snake = [{ x: 4, y: 5 }, { x: 3, y: 5 }, { x: 2, y: 5 }];
    state.snake.food = { x: 8, y: 5 };
    renderSnake();
}

function startSnake() {
    if (state.snake.running) return;
    state.snake.running = true;
    state.snake.timer = window.setInterval(stepSnake, 180);
    document.getElementById("snakeBoard")?.focus();
}

function stepSnake() {
    const directions = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
    state.snake.dir = state.snake.pendingDir;
    const head = state.snake.snake[0];
    const delta = directions[state.snake.dir];
    const next = { x: head.x + delta.x, y: head.y + delta.y };
    const hitWall = next.x < 0 || next.y < 0 || next.x >= state.snake.size || next.y >= state.snake.size;
    const hitSelf = state.snake.snake.some((part) => part.x === next.x && part.y === next.y);
    if (hitWall || hitSelf) {
        window.clearInterval(state.snake.timer);
        state.snake.running = false;
        setText("#snakeStatus", `Game over. Score ${state.snake.score}`);
        return;
    }

    state.snake.snake.unshift(next);
    if (next.x === state.snake.food.x && next.y === state.snake.food.y) {
        state.snake.score += 1;
        placeSnakeFood();
    } else {
        state.snake.snake.pop();
    }
    renderSnake();
}

function setSnakeDirection(direction) {
    const opposite = { up: "down", down: "up", left: "right", right: "left" };
    if (opposite[direction] !== state.snake.dir) state.snake.pendingDir = direction;
}

function placeSnakeFood() {
    let food;
    do {
        food = {
            x: Math.floor(Math.random() * state.snake.size),
            y: Math.floor(Math.random() * state.snake.size)
        };
    } while (state.snake.snake.some((part) => part.x === food.x && part.y === food.y));
    state.snake.food = food;
}

function renderSnake() {
    const board = document.getElementById("snakeBoard");
    if (!board) return;
    const cells = [];
    for (let y = 0; y < state.snake.size; y += 1) {
        for (let x = 0; x < state.snake.size; x += 1) {
            const snakeIndex = state.snake.snake.findIndex((part) => part.x === x && part.y === y);
            const isFood = state.snake.food.x === x && state.snake.food.y === y;
            cells.push(`<span class="${snakeIndex === 0 ? "is-head" : snakeIndex > -1 ? "is-snake" : isFood ? "is-food" : ""}"></span>`);
        }
    }
    board.innerHTML = cells.join("");
    setText("#snakeStatus", `${state.snake.running ? "Running" : "Ready"} | Score ${state.snake.score}`);
}

function resetMines() {
    const size = state.mines.size;
    state.mines.cells = Array(size * size).fill(null).map(() => ({ mine: false, revealed: false, count: 0 }));
    state.mines.revealed = 0;
    state.mines.over = false;
    let placed = 0;
    while (placed < state.mines.mineCount) {
        const index = Math.floor(Math.random() * state.mines.cells.length);
        if (!state.mines.cells[index].mine) {
            state.mines.cells[index].mine = true;
            placed += 1;
        }
    }
    state.mines.cells.forEach((cell, index) => {
        cell.count = getMineNeighbors(index).filter((neighbor) => state.mines.cells[neighbor].mine).length;
    });
    renderMines();
}

function revealMineCell(index) {
    const cell = state.mines.cells[index];
    if (!cell || cell.revealed || state.mines.over) return;
    cell.revealed = true;
    if (cell.mine) {
        state.mines.over = true;
        state.mines.cells.forEach((item) => item.revealed = true);
        setText("#mineStatus", "Mine hit. New game?");
        renderMines();
        return;
    }
    state.mines.revealed += 1;
    if (cell.count === 0) getMineNeighbors(index).forEach(revealMineCell);
    const safe = state.mines.cells.length - state.mines.mineCount;
    if (state.mines.revealed >= safe) {
        state.mines.over = true;
        setText("#mineStatus", "Cleared.");
    } else {
        setText("#mineStatus", `${safe - state.mines.revealed} safe squares left.`);
    }
    renderMines();
}

function getMineNeighbors(index) {
    const size = state.mines.size;
    const x = index % size;
    const y = Math.floor(index / size);
    const neighbors = [];
    for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < size && ny < size) neighbors.push(ny * size + nx);
        }
    }
    return neighbors;
}

function renderMines() {
    const board = document.getElementById("mineBoard");
    if (!board) return;
    board.innerHTML = state.mines.cells.map((cell, index) => `
        <button type="button" class="${cell.revealed ? "is-open" : ""}" data-mine-index="${index}">
            ${cell.revealed ? cell.mine ? "*" : cell.count || "" : ""}
        </button>
    `).join("");
}

function startReaction() {
    const target = document.getElementById("reactionTarget");
    window.clearTimeout(state.reaction.timer);
    state.reaction.armed = true;
    state.reaction.ready = false;
    if (target) target.textContent = "WAIT";
    setText("#reactionStatus", "Wait for green.");
    state.reaction.timer = window.setTimeout(() => {
        state.reaction.ready = true;
        state.reaction.start = performance.now();
        if (target) target.textContent = "CLICK";
        setText("#reactionStatus", "Now.");
    }, 800 + Math.random() * 1800);
}

function hitReactionTarget() {
    if (!state.reaction.armed) return;
    if (!state.reaction.ready) {
        window.clearTimeout(state.reaction.timer);
        state.reaction.armed = false;
        setText("#reactionStatus", "Too early.");
        return;
    }
    const time = Math.round(performance.now() - state.reaction.start);
    state.reaction.armed = false;
    state.reaction.ready = false;
    setText("#reactionStatus", `${time} ms`);
    setText("#reactionTarget", "DONE");
}

function openWindow(windowId) {
    const windows = getWindows();
    const windowElement = windows.get(windowId);
    if (!windowElement) return;

    windowElement.classList.add("is-open");
    windowElement.classList.remove("is-minimized");
    windowElement.removeAttribute("hidden");
    windowElement.removeAttribute("aria-hidden");
    activateWindow(windowId);
}

function closeWindow(windowId) {
    const windowElement = getWindows().get(windowId);
    if (!windowElement) return;

    windowElement.classList.remove("is-open", "is-active", "is-minimized", "is-maximized");
    windowElement.setAttribute("hidden", "");
    windowElement.setAttribute("aria-hidden", "true");
    syncTaskbar();
    activateLastOpenWindow(windowId);
}

function minimizeWindow(windowId) {
    const windowElement = getWindows().get(windowId);
    if (!windowElement) return;

    windowElement.classList.add("is-minimized");
    windowElement.classList.remove("is-active");
    windowElement.setAttribute("aria-hidden", "true");
    syncTaskbar();
    activateLastOpenWindow(windowId);
}

function toggleMaximize(windowId) {
    const windowElement = getWindows().get(windowId);
    if (!windowElement) return;

    windowElement.classList.toggle("is-maximized");
    activateWindow(windowId);
}

function activateWindow(windowId) {
    const windows = getWindows();
    const windowElement = windows.get(windowId);
    if (!windowElement || !windowElement.classList.contains("is-open")) return;

    windows.forEach((item) => item.classList.remove("is-active"));
    windowElement.classList.remove("is-minimized");
    windowElement.removeAttribute("aria-hidden");
    windowElement.classList.add("is-active");
    windowElement.style.zIndex = String(++state.zIndex);
    syncTaskbar();

    if (windowId === "terminal" && !window.matchMedia("(max-width: 780px)").matches) {
        window.setTimeout(() => document.getElementById("terminalInput")?.focus(), 50);
    }
}

function activateLastOpenWindow(excludingWindowId) {
    const openWindows = [...getWindows().entries()]
        .filter(([id, windowElement]) => id !== excludingWindowId && windowElement.classList.contains("is-open") && !windowElement.classList.contains("is-minimized"))
        .sort((a, b) => Number(b[1].style.zIndex || 0) - Number(a[1].style.zIndex || 0));

    if (openWindows.length > 0) activateWindow(openWindows[0][0]);
}

function syncTaskbar() {
    const taskbarTabs = document.getElementById("taskbarTabs");
    if (!taskbarTabs) return;

    const entries = [...getWindows().entries()].filter(([, windowElement]) => windowElement.classList.contains("is-open"));
    taskbarTabs.innerHTML = entries.map(([id, windowElement]) => {
        const isActive = windowElement.classList.contains("is-active") && !windowElement.classList.contains("is-minimized");
        return `<button type="button" class="taskbar-tab${isActive ? " is-active" : ""}" data-taskbar-window="${escapeAttr(id)}">${escapeHtml(windowLabels[id] || id)}</button>`;
    }).join("");

    taskbarTabs.querySelectorAll("[data-taskbar-window]").forEach((tab) => {
        tab.addEventListener("click", () => openWindow(tab.dataset.taskbarWindow));
    });
}

function updateClock() {
    const clock = document.getElementById("clock");
    if (!clock) return;

    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    clock.dateTime = now.toISOString();
}

function clearTerminal() {
    const output = document.getElementById("terminalOutput");
    if (output) output.innerHTML = "";
}

function printTerminal(lines, isCommand = false) {
    const output = document.getElementById("terminalOutput");
    if (!output) return;

    lines.forEach((line) => {
        String(line).split("\n").forEach((part) => {
            const element = document.createElement("p");
            element.className = `terminal-line${isCommand ? " is-command" : ""}`;
            element.textContent = part;
            output.appendChild(element);
        });
    });

    output.scrollTop = output.scrollHeight;
}

function getPrompt() {
    return `${profile.username}@${profile.host}:${formatPromptPath(state.terminal.cwd)}$`;
}

function updatePrompt() {
    const prompt = document.getElementById("terminalPrompt");
    if (prompt) prompt.textContent = getPrompt();
}

function closeStartMenu() {
    const startMenu = document.getElementById("startMenu");
    const startButton = document.getElementById("startButton");
    if (!startMenu) return;

    startMenu.setAttribute("hidden", "");
    startButton?.setAttribute("aria-expanded", "false");
}

function closeContextMenu() {
    document.getElementById("contextMenu")?.setAttribute("hidden", "");
}

function openExternal(url) {
    window.open(url, "_blank", "noopener,noreferrer");
}

function getNode(path) {
    const normalized = normalizePath(path, "/");
    if (normalized === "/") return { node: virtualFileSystem, path: "/" };
    const parts = normalized.slice(1).split("/");
    let node = virtualFileSystem;
    for (const part of parts) {
        if (!node || node.type !== "dir" || !node.children[part]) return null;
        node = node.children[part];
    }
    return { node, path: normalized };
}

function listDir(path, options = {}) {
    const found = getNode(path);
    if (!found || found.node.type !== "dir") return [];
    const entries = Object.entries(found.node.children)
        .filter(([name]) => options.all || !name.startsWith("."))
        .map(([name, node]) => ({ name, node }));
    return entries.sort((a, b) => {
        if (a.node.type !== b.node.type) return a.node.type === "dir" ? -1 : 1;
        return a.name.localeCompare(b.name);
    });
}

function readFile(path) {
    const found = getNode(path);
    return found?.node.type === "file" ? found.node.content : null;
}

function writeFile(path, content) {
    const parent = getParent(path);
    if (!parent || parent.parent.type !== "dir") return `write: cannot write '${path}'`;
    parent.parent.children[parent.name] = { type: "file", content: String(content) };
    return "";
}

function makeDir(path, parents = false) {
    const normalized = normalizePath(path, state.terminal.cwd);
    const parts = normalized.slice(1).split("/").filter(Boolean);
    let node = virtualFileSystem;
    for (let index = 0; index < parts.length; index += 1) {
        const part = parts[index];
        if (!node.children[part]) {
            if (!parents && index !== parts.length - 1) return `mkdir: cannot create directory '${path}': No such file or directory`;
            node.children[part] = { type: "dir", children: {} };
        }
        if (node.children[part].type !== "dir") return `mkdir: cannot create directory '${path}': File exists`;
        node = node.children[part];
    }
    return "";
}

function removePath(path, options = {}) {
    const parent = getParent(path);
    if (!parent || !parent.parent.children[parent.name]) {
        return options.force ? "" : `rm: cannot remove '${path}': No such file or directory`;
    }
    const node = parent.parent.children[parent.name];
    if (node.type === "dir" && Object.keys(node.children).length && !options.recursive) {
        return `rm: cannot remove '${path}': Is a directory`;
    }
    delete parent.parent.children[parent.name];
    return "";
}

function putNode(path, node) {
    const parent = getParent(path);
    if (!parent) return `cannot create '${path}'`;
    parent.parent.children[parent.name] = node;
    return "";
}

function getParent(path) {
    const normalized = normalizePath(path, state.terminal.cwd);
    if (normalized === "/") return null;
    const parentPath = dirname(normalized);
    const parentNode = getNode(parentPath);
    if (!parentNode || parentNode.node.type !== "dir") return null;
    return { parent: parentNode.node, name: basename(normalized), path: parentPath };
}

function collectFiles(path) {
    const found = getNode(path);
    const results = [];
    const visit = (node, currentPath) => {
        if (node.type === "file") results.push({ path: currentPath, node });
        if (node.type === "dir") {
            Object.entries(node.children).forEach(([name, child]) => visit(child, joinPath(currentPath, name)));
        }
    };
    if (found) visit(found.node, path);
    return results;
}

function normalizePath(path = ".", cwd = "/") {
    let raw = String(path || ".").replaceAll("\\", "/");
    if (raw.startsWith("~")) raw = `${profile.home}${raw.slice(1)}`;
    if (!raw.startsWith("/")) raw = joinPath(cwd, raw);
    const parts = [];
    raw.split("/").forEach((part) => {
        if (!part || part === ".") return;
        if (part === "..") parts.pop();
        else parts.push(part);
    });
    return `/${parts.join("/")}`.replace(/\/+$/, "") || "/";
}

function joinPath(base, child) {
    if (!base || base === "/") return `/${child}`.replace(/\/+/g, "/");
    return `${base}/${child}`.replace(/\/+/g, "/");
}

function basename(path) {
    const normalized = normalizePath(path, "/");
    if (normalized === "/") return "/";
    return normalized.split("/").pop();
}

function dirname(path) {
    const normalized = normalizePath(path, "/");
    if (normalized === "/") return "/";
    const parts = normalized.split("/");
    parts.pop();
    return parts.join("/") || "/";
}

function nodeSize(node) {
    if (node.type === "file") return node.content.length;
    return Object.values(node.children).reduce((sum, child) => sum + nodeSize(child), 0);
}

function cloneNode(node) {
    return JSON.parse(JSON.stringify(node));
}

function formatLongListing(name, node) {
    const type = node.type === "dir" ? "d" : "-";
    return `${type}rw-r--r-- 1 ${profile.username} ${profile.username} ${String(nodeSize(node)).padStart(6)} May 03 2026 ${name}${node.type === "dir" ? "/" : ""}`;
}

function walkTree(node, prefix, lines, depth, maxDepth) {
    if (depth >= maxDepth || node.type !== "dir") return;
    const entries = listEntries(node);
    entries.forEach((entry, index) => {
        const last = index === entries.length - 1;
        lines.push(`${prefix}${last ? "`-- " : "|-- "}${entry.name}${entry.node.type === "dir" ? "/" : ""}`);
        walkTree(entry.node, `${prefix}${last ? "    " : "|   "}`, lines, depth + 1, maxDepth);
    });
}

function listEntries(node) {
    return Object.entries(node.children)
        .map(([name, child]) => ({ name, node: child }))
        .sort((a, b) => a.name.localeCompare(b.name));
}

function splitOutsideQuotes(value, separator) {
    const parts = [];
    let current = "";
    let quote = "";
    for (const char of value) {
        if ((char === "'" || char === "\"") && !quote) {
            quote = char;
            current += char;
            continue;
        }
        if (char === quote) {
            quote = "";
            current += char;
            continue;
        }
        if (char === separator && !quote) {
            parts.push(current);
            current = "";
            continue;
        }
        current += char;
    }
    parts.push(current);
    return parts;
}

function parseArgs(source) {
    const args = [];
    let current = "";
    let quote = "";
    for (let index = 0; index < source.length; index += 1) {
        const char = source[index];
        if ((char === "'" || char === "\"") && !quote) {
            quote = char;
            continue;
        }
        if (char === quote) {
            quote = "";
            continue;
        }
        if (/\s/.test(char) && !quote) {
            if (current) args.push(current);
            current = "";
            continue;
        }
        current += char;
    }
    if (current) args.push(current);
    return args;
}

function parseRedirection(stage) {
    const parts = splitOutsideQuotes(stage, ">");
    if (parts.length === 1) return { command: stage, path: "", append: false };
    const append = stage.includes(">>");
    return {
        command: parts[0].trim(),
        path: parts[parts.length - 1].trim(),
        append
    };
}

function expandAlias(rawCommand) {
    const args = parseArgs(rawCommand);
    if (!args.length) return rawCommand;
    const alias = state.terminal.aliases[args[0]];
    return alias ? `${alias} ${rawCommand.slice(args[0].length).trim()}`.trim() : rawCommand;
}

function expandVariables(arg) {
    return arg.replace(/\$([A-Z_][A-Z0-9_]*)/gi, (_, key) => state.terminal.env[key] || "");
}

function completeCommand(value) {
    const args = parseArgs(value);
    const current = args[args.length - 1] || "";
    const candidates = [...builtins, ...apps.map((app) => app.command), ...listDir(state.terminal.cwd).map((entry) => entry.name)];
    const match = candidates.find((item) => item.startsWith(current));
    if (!match) return value;
    args[args.length - 1] = match;
    return `${args.join(" ")} `;
}

function uniqueLines(lines) {
    return lines.filter((line, index) => index === 0 || line !== lines[index - 1]);
}

function wildcardMatch(value, pattern) {
    const regex = new RegExp(`^${pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replaceAll("*", ".*").replaceAll("?", ".")}$`);
    return regex.test(value);
}

function buildCalendar(now) {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < first.getDay(); i += 1) cells.push({ label: "" });
    for (let day = 1; day <= lastDay; day += 1) cells.push({ label: day, today: day === now.getDate() });
    while (cells.length % 7) cells.push({ label: "" });
    return cells;
}

function setMeter(selector, value) {
    const meter = document.querySelector(selector);
    if (meter) meter.style.width = `${value}%`;
}

function getResourceValue(min, max) {
    return Math.round(min + Math.random() * (max - min));
}

function formatPromptPath(path) {
    if (path === profile.home) return "~";
    if (path.startsWith(`${profile.home}/`)) return `~${path.slice(profile.home.length)}`;
    return path;
}

function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours) return `${hours}h ${minutes}m`;
    if (minutes) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
}

function wrapWords(text, width) {
    const lines = [];
    let line = "";
    text.split(" ").forEach((word) => {
        if ((line + word).length > width) {
            lines.push(line.trim());
            line = "";
        }
        line += `${word} `;
    });
    if (line.trim()) lines.push(line.trim());
    return lines;
}

function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
    return escapeHtml(value);
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
