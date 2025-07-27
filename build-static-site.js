import fs from 'fs'
import { execSync } from 'child_process'
import { parse } from 'node-html-parser'

// Ensure the dist directory exists and is empty
if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
}
fs.mkdirSync('dist', { recursive: true });

// Find all Jupyter notebooks in the ./notebooks directory
const allIpynbFiles = execSync('find ./notebooks -name "*.ipynb"').toString().split('\n').filter(f => f.trim() !== '');
const notebooks = allIpynbFiles.filter(f => !f.includes('ipynb_checkpoints')).map(notebook => {
    return {
        path: notebook,
        name: notebook.substring(notebook.lastIndexOf('/') + 1).replace('.ipynb', ''),
        link: '/' + notebook.replace('./notebooks/', '').replace('.ipynb', '.html'),
        location: notebook.substring(0, notebook.lastIndexOf('/')).replace('./notebooks', '').substring(1)
    };
}).sort((a, b) => a.link.split('/') > b.link.split('/'));

// Create the dist directory if it doesn't exist and export the notebooks as HTML
for (const notebook of notebooks) {
    execSync(`.venv/bin/jupyter-nbconvert --to html --output-dir=dist/${notebook.location} --execute ${notebook.path}`);
}

// Copy public assets to dist
fs.cpSync('public/assets', 'dist/assets', { recursive: true });
fs.cpSync('public/404.html', 'dist/404.html');

// Generate links for the sidebar
const navigation = [];

const addLinkToNavigation = (notebook) => {
    const parentNames = notebook.link.split('/').filter(i => i && !i.endsWith('.html'));

    let currentLevel = navigation;
    for (let i = 0; i < parentNames.length; i++) {
        const parentName = parentNames[i];

        let parent = currentLevel.find(item => item.name === parentName);
        if (!parent) {
            currentLevel.push({
                name: parentName,
                children: []
            });
        }

        currentLevel = currentLevel.find(item => item.name === parentName).children;

        if (i === parentNames.length - 1 && currentLevel) {
            currentLevel.push({
                name: notebook.name,
                link: notebook.link,
                children: []
            });
        }
    }
}

notebooks.forEach(notebook => addLinkToNavigation(notebook));

// Sort the navigation structure alphabetically
const sortChildren = (children) => {
    children.sort((a, b) => a.name.localeCompare(b.name));
    children.forEach(child => {
       if (child.children) {
           sortChildren(child.children);
       }
    });
}
sortChildren(navigation);

// Write the sidebar navigation to HTML file
const templateHtml = parse(fs.readFileSync('public/index.html', 'utf8'));
let templateNavigation = templateHtml.getElementById('sidebar-navigation');

const addDataUrlAttribute = (child) => {
    if (!child || !child.link) {
        return '';
    } else {
        return `data-url="${child.link}"`;
    }
}

const addIcon = (child) => {
    const icon = addDataUrlAttribute(child) ? 'file.svg' : 'folder.svg';
    return `<img src="/assets/icons/${icon}" alt="${child.name} icon"/>`;
}

const writeChildrenToMenu = (children, depth) => {
    children.forEach(child => {
        templateNavigation.innerHTML += `<li class="list-group-item menu-item-depth menu-item-depth-${depth}" ${addDataUrlAttribute(child)}>${addIcon(child)} ${child.name}</li>`;
        if (child.children) {
            writeChildrenToMenu(child.children, depth + 1);
        }
    });
}
writeChildrenToMenu(navigation, 0);
fs.writeFileSync('dist/index.html', templateHtml.toString());
