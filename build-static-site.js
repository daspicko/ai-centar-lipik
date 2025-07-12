import fs from 'fs'
import { execSync } from 'child_process'
import { parse } from 'node-html-parser'

// Find all Jupyter notebooks in the ./notebooks directory
const notebooks = execSync('find ./notebooks -name "*.ipynb"').toString().split('\n').filter(f => f.trim() !== '').map(notebook => {
    return {
        path: notebook,
        name: notebook.substring(notebook.lastIndexOf('/') + 1).replace('.ipynb', ''),
        link: '/' + notebook.replace('./notebooks/', '').replace('.ipynb', '.html'),
        location: notebook.substring(0, notebook.lastIndexOf('/')).replace('./notebooks', '').substring(1)
    };
});

// Create the dist directory if it doesn't exist and export the notebooks as HTML
for (const notebook of notebooks) {
    execSync(`jupyter nbconvert --to html --output-dir=dist/${notebook.location} --execute ${notebook.path}`);
}

// Copy public files to dist
fs.cpSync('public', 'dist', { recursive: true });

// Generate links for the sidebar
const navigation = notebooks.map(notebook => {
    return {
        name: notebook.name,
        link: notebook.link
    };
});
const mainJsContent = fs.readFileSync('dist/main.js', 'utf8');
fs.writeFileSync('dist/main.js', `
    const navigation = ${JSON.stringify(navigation)};
    ${mainJsContent}
`);

const indexHtml = parse(fs.readFileSync('dist/index.html', 'utf8'));
const contentToInsert = indexHtml.querySelector('body').innerHTML;

// Update HTML of notebooks to include the sidebar
for (const notebook of notebooks) {
    const notebookHtml = parse(fs.readFileSync(`dist/${notebook.link}`, 'utf8'));
    const existingContent = notebookHtml.querySelector('main').innerHTML;

    notebookHtml.querySelector('head').innerHTML += '<link rel="stylesheet" href="/style.css">';

    const notebookBodyHtml = notebookHtml.querySelector('body');
    notebookBodyHtml.innerHTML = contentToInsert;
    notebookBodyHtml.querySelector('main').innerHTML = existingContent;

    fs.writeFileSync(`dist/${notebook.link}`, notebookHtml.toString());
}