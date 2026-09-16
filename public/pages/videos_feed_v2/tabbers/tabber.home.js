Gb.define('tabber', {
    type: 'tabber',
    id: 'tabber.home',
    orientation: 'horizontal',
    items: [
        {
            title: 'Videos',
            item: Gb.getComponent('grid.home')
        }
    ]
});
