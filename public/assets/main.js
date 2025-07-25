import { navigation } from './navigation.js';

$(document).ready(function() {
    const $navigationTree = $('div.navigation').tree({
        data: navigation,
        autoOpen: true
    });

    const selectedItem = localStorage.getItem('selectedItem');
    if (selectedItem) {
        const selectedNode = $navigationTree.tree('getNodeById', selectedItem);
        if (selectedNode) {
            $navigationTree.tree('selectNode', selectedNode);
        }
    }

    $navigationTree.on('tree.select', function(event) {
        if (event.node && event.node.link) {
            localStorage.setItem('selectedItem', event.node.id);
            window.location = event.node.link;
        }
    });

});
