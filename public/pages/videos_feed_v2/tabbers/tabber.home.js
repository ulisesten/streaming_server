Gb.define('tabber', {
    type: 'tabber',
    id: 'tabber.home',
    orientation: 'horizontal',
    items: [
        {
            title: 'Feed',
            item: Gb.getComponent('grid.home')
        }
    ]
});
