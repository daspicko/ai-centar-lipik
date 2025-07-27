const removeSelection = () => {
    document.querySelectorAll("li.list-group-item[data-url]").forEach(li => li.classList.remove("active"));
}

document.addEventListener("DOMContentLoaded", (event) => {
    document.querySelectorAll("li.list-group-item[data-url]").forEach(li => {
        const url = li.getAttribute("data-url");

        if (url) {
            li.addEventListener("click", (e) => {
                e.preventDefault();
                removeSelection();
                const notebookViewer = document.getElementById("notebook-viewer");

                history.pushState({}, '', url);
                notebookViewer.setAttribute("src", url);
                li.classList.add("active");
            });
        }
    });
});
