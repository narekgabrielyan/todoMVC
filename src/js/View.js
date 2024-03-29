import { qs, delegateEvent, getTargetedItemId, createEl } from './utils';
import { KEYCODES } from './constants';

export default class View {
  constructor(template) {
    this.listWrapper = qs('.items_list_wrapper');
    this.toggleAll = qs('.input-toggle_all');
    this.newTodo = qs('.input-new_item');
    this.main = qs('.main');
    this.activeCount = qs('.items_count_wrapper', this.main);
    this.clearCompleted = qs('.btn-clear_completed', this.main);
    this.logoutBtn = qs('.btn-logout');
    this.editProfileBtn = qs('.btn-edit_profile');
    this.userName = qs('#user_name');
    this.template = template;

    delegateEvent(this.main, '.btn-list_item-edit', 'click', ({ target }) => {
      this.setEditItem(target);
    });
    this.setUserName();
  }

  bindAddItem(callback) {
    this.newTodo.addEventListener('change', (e) => {
      const title = e.target.value.trim();
      if (title) {
        callback(title);
      }
    });
  }

  bindRemoveItem(callback) {
    delegateEvent(this.main, '.btn-list_item-cancel', 'click', ({ target }) => {
      callback(getTargetedItemId(target));
    });
  }

  bindToggleItem(callback) {
    delegateEvent(this.main, '.toggle_item', 'click', ({ target }) => {
      callback(getTargetedItemId(target), target.checked);
    });
  }

  bindToggleAll(callback) {
    this.toggleAll.addEventListener('click', (e) => {
      const isChecked = e.target.checked;
      callback(isChecked);
    });
  }

  bindClearCompletedItems(handler) {
    this.clearCompleted.addEventListener('click', () => {
      handler();
    });
  }

  bindEditItemCancel(handler) {
    delegateEvent(
      this.main,
      '.input-edit_list_item',
      'keyup',
      ({ target, keyCode }) => {
        if (keyCode === KEYCODES.ESCAPE_KEY) {
          target.dataset.iscanceled = true;
          target.blur();

          handler(getTargetedItemId(target));
        }
      }
    );
  }

  bindEditItemSave(handler) {
    delegateEvent(
      this.main,
      '.input-edit_list_item',
      'blur',
      ({ target }) => {
        if (!target.dataset.iscanceled) {
          handler(getTargetedItemId(target), target.value.trim());
        }
      },
      true
    );

    delegateEvent(
      this.main,
      '.input-edit_list_item',
      'keypress',
      ({ target, keyCode }) => {
        if (keyCode === KEYCODES.ENTER_KEY) {
          target.blur();
        }
      },
      true
    );
  }

  clearNewTodo() {
    this.newTodo.value = '';
  }

  showItems(items) {
    this.listWrapper.innerHTML = this.template.itemsList(items);
  }

  setMainVisibility(visible) {
    this.main.style.display = !!visible ? 'flex' : 'none';
  }

  setActiveItemsCount(activeItemsCount) {
    this.activeCount.innerText =
      activeItemsCount === 1 ? '1 item left' : `${activeItemsCount} items left`;
  }

  setClearCompletedBtnVisibility(visible) {
    this.clearCompleted.style.display = !!visible ? 'block' : 'none';
  }

  setToggleAllCheckedState(checked) {
    this.toggleAll.checked = !!checked;
  }

  setEditItem(target) {
    const targetParent = target.parentElement;
    const listItem = targetParent.parentElement;
    const listTitle = qs('.list_item_title', targetParent);
    const editInput = createEl('input', {
      className: 'input-edit_list_item',
      value: listTitle.innerText,
    });

    listItem.classList.add('list_item-editing');

    targetParent.appendChild(editInput);
    editInput.focus();
  }

  editItemDone(id, title) {
    const listItem = document.getElementById(id);
    const itemContent = qs('.list_item_content', listItem);
    const editInput = qs('.input-edit_list_item', itemContent);
    const itemTitle = qs('.list_item_title', itemContent);

    listItem.classList.remove('list_item-editing');
    itemTitle.innerText = title;
    itemTitle.title = title;
    itemContent.removeChild(editInput);
  }

  updateFooterButtons(route) {
    const activeBtn = qs('.btn-filter.btn-filter-active', this.main);
    const newActiveBtn = qs(`.btn-filter[href="#/${route}"]`, this.main);

    activeBtn.classList.remove('btn-filter-active');
    newActiveBtn.classList.add('btn-filter-active');
  }

  setItemCompleted(id, completed) {
    const item = document.getElementById(id);
    const itemCheckbox = document.getElementById(`toggle${id}`);
    if (!item) {
      return;
    }

    item.className = completed ? 'list_item list_item-done' : 'list_item';
    itemCheckbox.checked = completed;
  }

  setUserName() {
    this.userName.innerText = JSON.parse(
      localStorage.getItem('userData')
    ).user.name;
  }

  removeItem(id) {
    const item = document.getElementById(id);

    if (!item) {
      return;
    }

    this.listWrapper.removeChild(item);
  }

  bindLogOutAction(handler) {
    this.logoutBtn.addEventListener('click', handler);
  }

  bindEditProfileAction(handler) {
    this.editProfileBtn.addEventListener('click', handler);
  }
}
