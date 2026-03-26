// scripts/data.js

export const skills = [
    { name: 'C/C++', level: 90, tag: '01 — Systems' },
    { name: 'Java', level: 85, tag: '02 — OOP' },
    { name: 'Python', level: 88, tag: '03 — Scripting' },
    { name: 'HTML', level: 95, tag: '04 — Markup' },
    { name: 'CSS', level: 92, tag: '05 — Styling' },
    { name: 'JavaScript', level: 87, tag: '06 — Web' },
    { name: 'SQL', level: 78, tag: '07 — Data' },
    { name: 'Bash', level: 75, tag: '08 — Shell' },
];

export const projects = [
    {
        num: '001',
        name: 'MemTracer',
        desc: 'A memory leak detector for C/C++ programs using custom allocator hooks and real-time heap analysis.',
        tags: ['C++', 'Systems', 'CLI']
    },
    {
        num: '002',
        name: 'AlgoViz',
        desc: 'Interactive algorithm visualizer built with vanilla JS, animating sorting and graph traversal in real-time.',
        tags: ['JavaScript', 'HTML', 'CSS']
    },
    {
        num: '003',
        name: 'PyScript Runner',
        desc: 'A lightweight Python task runner with async execution and sandboxed environments.',
        tags: ['Python', 'CLI']
    },
    {
        num: '004',
        name: 'ThreadPool',
        desc: 'High-performance thread pool implementation in C++ with task scheduling and concurrency control.',
        tags: ['C++', 'Multithreading']
    },
    {
        num: '005',
        name: 'PortKit',
        desc: 'Minimalist developer portfolio kit focused on performance and clean design.',
        tags: ['Web', 'UI']
    }
];