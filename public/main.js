document.addEventListener("DOMContentLoaded", (event) => {
    const searchField = document.querySelector('.sidebar input');
    const navigationElement = document.querySelector('.navigation');

    // Initialize the navigation with filtered items based on the search field value
    filteredNavigation(searchField.value).forEach(item => {
        navigationElement.appendChild(createNavigationItem(item));
    });

    document.querySelector('.sidebar input').addEventListener('keyup', (e) => {
        // Clear existing navigation items
        navigationElement.innerHTML = '';

        // Filter and append new navigation items based on search input
        filteredNavigation(searchField.value).forEach(item => {
            navigationElement.appendChild(createNavigationItem(item));
        });
    });
});

const createNavigationItem = (item) => {
    const container = document.createElement('div');
    const link = document.createElement('a');
    link.href = item.link;
    link.classList.add('nav-link');
    link.textContent = item.name;

    link.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
    });

    container.appendChild(link);
    return container;
}

const filteredNavigation = (searchTerm) => {
    return navigation.filter(item => {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
}
