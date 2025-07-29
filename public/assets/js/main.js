const removeSelection = () => {
    document.querySelectorAll("#sidebar-navigation li").forEach(li => li.classList.remove("active"));
}

document.addEventListener("DOMContentLoaded", (event) => {
    document.querySelectorAll("div.list-group-item-link[data-url]").forEach(div => {
        const url = div.getAttribute("data-url");

        if (url) {
            div.addEventListener("click", (e) => {
                e.preventDefault();
                removeSelection();
                const notebookViewer = document.getElementById("notebook-viewer");

                history.pushState({}, '', url);
                notebookViewer.setAttribute("src", url);
                div.parentElement.classList.add("active");
            });
        }
    });
});
