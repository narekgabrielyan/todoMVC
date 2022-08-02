class Controller {
    constructor(view, store) {
        this.activeRoute = '';
        this.view = view;
        this.store = store;

        view.bindAddItem(this.addItem.bind(this));
        view.bindToggleItem((id, completed) => {
            this.toggleItem(id, completed);
            this.filter();
        })
        view.bindRemoveItem(this.removeItem.bind(this));
        view.bindClearCompletedItems(this.clearCompletedItems.bind(this))
    }

    setView(href) {
        const route = href.replace(/^#\//, '');
        this.filter(true);
        this.view.updateFooterButtons(route);
    }

    addItem(title) {
        this.store.addItem({
            id: `${Date.now()}`,
            title: title,
            completed: false
        }, () => {
            this.view.clearNewTodo();
            this.filter(true);
        });
    }

    removeItem(id) {
        this.store.removeItems({id}, () => {
            this.filter();
        });
    }

    toggleItem(id, completed) {
        this.store.updateItem({id, completed}, () => this.view.setItemCompleted(id, completed));
    }

    filter(force) {
        if (force) {
            this.store.filterItems(QUERIES[this.activeRoute], this.view.showItems.bind(this.view));
        }
        this.store.countItems((total, active, completed) => {
            this.view.setMainVisibility(total);
            this.view.setActiveItemsCount(active);
            this.view.setClearCompletedBtnVisibility(completed);
        });
    }

    clearCompletedItems() {
        this.store.removeItem(QUERIES['completed'], () => this.filter(true));
    }
}