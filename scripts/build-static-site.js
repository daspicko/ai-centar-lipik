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
        downloadLink: '/' + notebook.replace('./notebooks/', '').replace('.ipynb', '.pdf'),
        location: notebook.substring(0, notebook.lastIndexOf('/')).replace('./notebooks', '').substring(1)
    };
}).sort((a, b) => a.link.split('/') > b.link.split('/'));

// Convert notebooks to HTML and PDF - Conversion is done sequentially to avoid issues with ports
for (const notebook of notebooks) {
    try {
        execSync(`jupyter execute ${notebook.path}`);
        execSync(`jupyter-nbconvert ${notebook.path} --to html --output-dir=dist/${notebook.location}`);
        execSync(`jupyter-nbconvert ${notebook.path} --to pdf --output-dir=dist/${notebook.location}`);
    } catch(error) {
        console.error(`Error processing notebook ${notebook.name}:`, error.message);
        process.exit(1);
    }
}

// Copy public assets to dist
fs.cpSync('public/assets', 'dist/assets', { recursive: true });
fs.cpSync('public/404.html', 'dist/404.html');

// Generate links for the sidebar
const navigation = [];

const addLinkToNavigation = (notebook) => {
    const parentNames = notebook.link.split('/').filter(i => i && !i.endsWith('.html'));

    if (parentNames.length === 0) { // No parent directories, add directly to navigation
        navigation.push({
            name: notebook.name,
            link: notebook.link,
            downloadLink: notebook.downloadLink,
            children: []
        });
    } else { // Recursively add to the correct parent directory
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
                    downloadLink: notebook.downloadLink,
                    children: []
                });
            }
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
        return `data-url="/ai-centar-lipik${child.link}"`;
    }
}

const addDownloadButton = (child) => {
    if (!child || !child.downloadLink) {
        return '';
    } else {
        return `<a href="/ai-centar-lipik${child.downloadLink}" class="btn btn-sm download-button" target="_blank" rel="noopener noreferrer"><img src="assets/icons/download.svg" alt="Download icon"/></a>`;
    }
}

const addIcon = (child) => {
    const icon = addDataUrlAttribute(child) ? 'file.svg' : 'folder.svg';
    return `<img src="assets/icons/${icon}" alt="${child.name} icon"/>`;
}

const writeChildrenToMenu = (children, depth) => {
    children.forEach(child => {
        templateNavigation.innerHTML += `
<li class="list-group-item">
    <div class="list-group-item-link menu-item-depth menu-item-depth-${depth}" ${addDataUrlAttribute(child)}>
        ${addIcon(child)} ${child.name}
    </div>
    <div class="list-group-item-download">
       ${addDownloadButton(child)}
    </div>
</li>
`;
        if (child.children) {
            writeChildrenToMenu(child.children, depth + 1);
        }
    });
}
writeChildrenToMenu(navigation, 0);
fs.writeFileSync('dist/index.html', templateHtml.toString());
