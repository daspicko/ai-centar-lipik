import { execSync } from 'child_process'

// Find all Jupyter notebooks in the ./notebooks directory
const allIpynbFiles = execSync('find ./notebooks -name "*.ipynb"').toString().split('\n').filter(f => f.trim() !== '');
const notebooks = allIpynbFiles.filter(f => !f.includes('ipynb_checkpoints')).map(notebook => {
    return {
        path: notebook,
        location: notebook.substring(0, notebook.lastIndexOf('/')).replace('./notebooks', '').substring(1)
    };
});

// Execute each notebook to ensure they run without errors
for (const notebook of notebooks) {
    execSync(`jupyter execute ${notebook.path}`);
}
