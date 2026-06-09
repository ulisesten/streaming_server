class Global {
    arr_elements = new Array();
    arr_element_defs = {};

    /**
     * @brief Método capaz de definir objetos.
     * @param element Nombre del elemento a definir. Ejemplo: form.
     * @param opt Opciones de configuración para el elemento a definir.
     */
    define(element, opt) {
        const handler = arr_element_handler[element];
        const optTypeHandler = opt && opt.type ? arr_element_handler[opt.type] : null;
        const factory = handler || optTypeHandler;
        if (!factory) {
            throw new Error(`No valid element handler: ${element}`);
        }

        if (opt && opt.type) {
            this.arr_element_defs[element] = Object.assign({}, opt);
        }

        const instance = factory(opt);
        if (opt && opt.id && instance && typeof instance.getEl === 'function') {
            instance.getEl(opt.id);
        }
        if (opt && opt.id) {
            this.arr_elements[opt.id] = instance;
        }
        // Permite alias personalizados, ej: Gb.define('cbx_series', { type: 'combobox', ... })
        this.arr_elements[element] = instance;
        return instance;

    }

    /**
     * @brief Retorna el elemento con el id correspondiente.
     * @param id Id del elemento que deseamos obtener.
     * @return Elemento HTML.
     */
    getComponent(id) {
        const direct = this.arr_elements[id];
        const domEl = document.getElementById(id);
        const bindToDom = (inst) => {
            if (!inst) return null;
            if (domEl && typeof inst.getEl === 'function') {
                if (inst.opt && typeof inst.opt === 'object') {
                    inst.opt.id = id;
                }
                inst.select = domEl;
            }
            return inst;
        };
        if (direct) return bindToDom(direct);

        const values = Object.values(this.arr_elements || {});
        for (let i = 0; i < values.length; i++) {
            const inst = values[i];
            if (inst && inst.opt && inst.opt.id === id) {
                return bindToDom(inst);
            }
        }
        if (domEl && domEl.tagName === 'SELECT') {
            const fallback = new Combobox({ id });
            fallback.select = domEl;
            this.arr_elements[id] = fallback;
            return fallback;
        }
        return null;
    }
    getEl(id) { return this.getComponent(id); }
    getDef(id) { return this.arr_element_defs[id]; }
}

const arr_element_handler = {
    'form': (opts) => {
        return (new Form(opts));
    },
    'header': (opts) => {
        return (new Header(opts));
    },
    'container': (opts) => {
        return (new Container(opts));
    },
    'tabber': (opts) => {
        return (new Tabber(opts));
    },
    'window': (opts) => {
        return (new Window(opts));
    },
    'card_grid': (opts) => {
        return (new CardGrid(opts));
    },
    'table_grid': (opts) => {
        return (new TableGrid(opts));
    },
    'card': (opts) => {
        return (new Card(opts));
    },
    'combobox': (opts) => {
        return (new Combobox(opts));
    },
    'dropdown': (opts) => {
        return (new Dropdown(opts));
    },
    'toolbar': (opts) => {
        return (new Toolbar(opts));
    },
    'button': (opts) => {
        return (new Button(opts));
    },
    'menu': (opts) => {
        return (new Menu(opts));
    },
    'progress_bar': (opts) => {
        return (new ProgressBar(opts));
    },
    'notification': (opts) => {
        return (new GNotification(opts));
    }
}



class Header {
    cmp = null;
    constructor(opts) {
        this.opts = opts;
        this.create();
    }

    create() {
        this.cmp = document.createElement('div');
        this.cmp.setAttribute('class', this.opts['cls'] || 'g_header');
        this.cmp.id = this.opts['id'] || '';
        this.cmp_content = document.createElement('div');
        this.cmp_content.setAttribute('class', 'g_header_content');
        this.cmp.append(this.cmp_content);
        this.setTitle(this.opts['title']);
        this.setNav();
        this.setSearch();
        this.setUser();

    }

    setTitle(title) {
        const a_title = document.createElement('a');
        a_title.setAttribute('href', '/');
        a_title.textContent = title;
        a_title.classList.add('g_header_title');
        this.cmp_content.append(a_title);
    }

    setNav() {
        if (!this.opts.nav) return;
        const nav = document.createElement('nav');
        nav.classList.add('g_header_nav');

        const navItems = Array.isArray(this.opts.nav_items) ? this.opts.nav_items : [];
        navItems.forEach(item => {
            const a = document.createElement('a');
            a.classList.add('g_header_nav_item');
            a.textContent = item.text || item.label || '';
            a.setAttribute('href', item.href || '#');
            nav.append(a);
        });

        this.cmp_content.append(nav);
    }

    setSearch() {
        if (!this.opts.search) return;
        const searchWrap = document.createElement('div');
        searchWrap.classList.add('g_header_search');

        this.searchInput = document.createElement('input');
        this.searchInput.setAttribute('type', 'text');
        this.searchInput.setAttribute('placeholder', this.opts.search_placeholder || 'Search');
        this.searchInput.classList.add('g_header_search_input');

        const searchBtn = document.createElement('button');
        searchBtn.setAttribute('type', 'button');
        searchBtn.textContent = this.opts.search_text || 'Buscar';
        searchBtn.classList.add('g_header_search_btn');
        searchBtn.addEventListener('click', () => {
            if (typeof this.opts.onSearchClick === 'function') {
                this.opts.onSearchClick(this.searchInput.value, this.searchInput);
            }
        });

        searchWrap.append(this.searchInput);
        searchWrap.append(searchBtn);
        this.cmp_content.append(searchWrap);
    }

    setUser() {
        if (!this.opts.user && !this.opts.usu_thumbnail && !this.opts.usu_nombre && !this.opts.usu_id) return;
        if (!this.userWrap) {
            this.userWrap = document.createElement('div');
            this.userWrap.classList.add('g_header_user');

            this.userThumb = document.createElement('img');
            this.userThumb.classList.add('g_header_user_thumbnail');

            this.userName = document.createElement('span');
            this.userName.classList.add('g_header_user_name');

            this.userId = document.createElement('input');
            this.userId.setAttribute('type', 'hidden');
            this.userId.setAttribute('id', 'usu_id');
            this.userId.setAttribute('name', 'usu_id');
            this.userId.classList.add('g_header_user_id');

            this.userWrap.append(this.userThumb);
            this.userWrap.append(this.userName);
            this.userWrap.append(this.userId);
            this.cmp_content.append(this.userWrap);
        }

        this.userThumb.setAttribute('src', this.opts.usu_thumbnail ?? '');
        this.userThumb.setAttribute('alt', this.opts.usu_nombre ?? 'Usuario');
        this.userName.textContent = this.opts.usu_nombre ?? '';
        this.userId.setAttribute('value', this.opts.usu_id ?? '');
    }

    setUserValues(usu_thumbnail, usu_nombre, usu_id) {
        this.opts.user = true;
        this.opts.usu_thumbnail = usu_thumbnail;
        this.opts.usu_nombre = usu_nombre;
        this.opts.usu_id = usu_id;
        this.setUser();
    }

    getHeader() {
        return this.cmp;
    }

    getEl() {
        return this.cmp;
    }
}

class Combobox {
    constructor(opt) {
        this.opt = opt || {};
        this.url = '';
        this.create();
        this.applyStyle();
        this.setOptions(this.opt.options || []);

        if (this.opt.url) {
            this.setUrl(this.opt.url);
        }
        if (this.opt.remote && this.opt.autoload) {
            this.load();
        }
    }

    create() {
        this.select = document.createElement('select');
        this.select.setAttribute('id', this.opt.id || '');
        this.bindOnSelect(this.select);
    }

    resolveSelect() {
        if (this.select && this.select.tagName === 'SELECT' && this.select.isConnected) {
            return this.select;
        }
        if (this.opt && this.opt.id) {
            const elById = document.getElementById(this.opt.id);
            if (elById && elById.tagName === 'SELECT') {
                return elById;
            }
        }
        return this.select;
    }

    bindOnSelect(selectEl) {
        if (!selectEl || selectEl.__g_onselect_bound) return;
        selectEl.addEventListener('change', (e) => {
            if (typeof this.opt.onSelect === 'function') {
                this.opt.onSelect(e.target.value, e.target);
            }
        });
        selectEl.__g_onselect_bound = true;
    }

    applyStyle() {
        this.select.classList.add('g_combobox');
        if (this.opt.cls) this.select.classList.add(this.opt.cls);
    }

    setUrl(url) {
        this.url = url || '';
    }

    setOptions(options = []) {
        const selectEl = this.resolveSelect();
        if (!selectEl) return;
        this.bindOnSelect(selectEl);
        this.select = selectEl;
        selectEl.innerHTML = '';
        const fields = this.opt.fields || {};
        const valueField = fields.id || 'id';
        const textField = fields.name || 'name';

        options.forEach(opt => {
            const optionEl = document.createElement('option');
            if (typeof opt === 'object' && opt !== null) {
                const mappedValue = opt[valueField];
                const mappedText = opt[textField];
                optionEl.value = mappedValue ?? opt.value ?? '';
                optionEl.textContent = mappedText ?? opt.text ?? optionEl.value ?? '';
            } else {
                optionEl.value = opt;
                optionEl.textContent = opt;
            }
            selectEl.append(optionEl);
        });
    }

    load(extraParams = {}) {
        if (!this.url) {
            console.log('Combobox: URL no definida.');
            return;
        }

        console.log('combo loading')

        let fetchUrl = this.url;
        if (Object.keys(extraParams).length > 0) {
            const params = new URLSearchParams(extraParams);
            const separator = fetchUrl.includes('?') ? '&' : '?';
            fetchUrl += `${separator}${params.toString()}`;
        }

        fetch(fetchUrl)
            .then(response => response.json())
            .then(data => {
                const key = this.opt.result;
                const options = key && data && Array.isArray(data[key])
                    ? data[key]
                    : (Array.isArray(data) ? data : []);
                this.setOptions(options);
            })
            .catch(error => console.error('Combobox Load Error:', error));
    }

    getEl(id = null) {
        if (id) {
            this.opt.id = id;
            if (this.select) this.select.setAttribute('id', id);
        }
        return this.resolveSelect();
    }

    getValue() {
        const selectEl = this.resolveSelect();
        if (!selectEl) return null;
        return selectEl.value ?? null;
    }
}

class Dropdown {
    constructor(opt) {
        this.opt = opt || {};
        this.url = '';
        this.create();
        this.setOptions(this.opt.options || []);
        if (this.opt.url) this.setUrl(this.opt.url);
        if (this.opt.remote && this.opt.autoload) this.load();
    }
    setUrl(url) {
        this.url = url || '';
    }
    create() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('g_dropdown');
        if (this.opt.cls) this.wrapper.classList.add(this.opt.cls);
        this.wrapper.style.width = this.opt.width || '100%';
        this.hiddenInput = document.createElement('input');
        this.hiddenInput.type = 'hidden';
        this.hiddenInput.id = this.opt.id || '';
        this.trigger = document.createElement('button');
        this.trigger.type = 'button';
        this.trigger.classList.add('g_dropdown_trigger');
        this.list = document.createElement('div');
        this.list.classList.add('g_dropdown_list');
        this.list.style.display = 'none';
        this.list.style.position = 'fixed';
        this.wrapper.append(this.hiddenInput, this.trigger);
        document.body.append(this.list);
        this.trigger.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            const willOpen = this.list.style.display !== 'block';
            if (willOpen) this.positionList();
            this.list.style.display = willOpen ? 'block' : 'none';
        });
        document.addEventListener('click', (ev) => {
            if (!this.wrapper.contains(ev.target)) this.list.style.display = 'none';
        });
        this.list.addEventListener('click', (ev) => ev.stopPropagation());
        window.addEventListener('resize', () => {
            if (this.list.style.display === 'block') this.positionList();
        });
        window.addEventListener('scroll', () => {
            if (this.list.style.display === 'block') this.positionList();
        }, true);
    }
    positionList() {
        const rect = this.trigger.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const margin = 2;
        const maxHeight = 260;
        const spaceBelow = viewportHeight - rect.bottom - margin;
        const spaceAbove = rect.top - margin;
        const openUp = spaceBelow < 180 && spaceAbove > spaceBelow;
        const height = Math.min(maxHeight, openUp ? Math.max(spaceAbove, 120) : Math.max(spaceBelow, 120));
        const minWidth = Math.max(180, rect.width);
        const preferredWidth = this.opt.list_width || minWidth;
        const safeWidth = Math.min(preferredWidth, viewportWidth - (margin * 2));
        const left = Math.min(Math.max(margin, rect.left), Math.max(margin, viewportWidth - safeWidth - margin));
        this.list.style.left = `${left}px`;
        this.list.style.width = `${safeWidth}px`;
        this.list.style.maxHeight = `${height}px`;
        this.list.style.top = openUp ? `${Math.max(margin, rect.top - height - margin)}px` : `${rect.bottom + margin}px`;
    }
    setOptions(options = []) {
        this.optionsData = [];
        this.list.innerHTML = '';
        const fields = this.opt.fields || {};
        const valueField = fields.id || 'id';
        const textField = fields.name || 'name';
        const thumbnailField = fields.thumbnail || 'thumbnail';
        options.forEach(item => {
            const value = typeof item === 'object' ? (item[valueField] ?? item.value ?? '') : item;
            const text = typeof item === 'object' ? (item[textField] ?? item.text ?? value) : item;
            const thumbnail = typeof item === 'object'
                ? (typeof thumbnailField === 'function' ? thumbnailField(item) : item[thumbnailField])
                : '';
            const row = document.createElement('button');
            row.type = 'button';
            row.classList.add('g_dropdown_item');
            if (thumbnail) {
                const img = document.createElement('img');
                img.src = thumbnail;
                img.alt = text || 'thumb';
                img.classList.add('g_dropdown_thumb');
                row.append(img);
            }
            const label = document.createElement('span');
            label.classList.add('g_dropdown_label');
            label.textContent = text;
            row.append(label);
            row.addEventListener('click', () => {
                this.hiddenInput.value = String(value);
                this.trigger.innerHTML = '';
                if (thumbnail) {
                    const tImg = document.createElement('img');
                    tImg.src = thumbnail;
                    tImg.alt = text || 'thumb';
                    tImg.classList.add('g_dropdown_thumb');
                    this.trigger.append(tImg);
                }
                const tLabel = document.createElement('span');
                tLabel.textContent = text;
                this.trigger.append(tLabel);
                this.list.style.display = 'none';
            });
            this.list.append(row);
            this.optionsData.push({ value: String(value), text, thumbnail });
        });
        if (this.optionsData.length > 0) {
            const first = this.optionsData[0];
            this.hiddenInput.value = first.value;
            this.trigger.textContent = first.text;
        }
    }
    load(extraParams = {}) {
        if (!this.url) {
            console.log('Dropdown: URL no definida.');
            return;
        }

        let fetchUrl = this.url;
        if (Object.keys(extraParams).length > 0) {
            const params = new URLSearchParams(extraParams);
            const separator = fetchUrl.includes('?') ? '&' : '?';
            fetchUrl += `${separator}${params.toString()}`;
        }

        fetch(fetchUrl)
            .then(response => response.json())
            .then(data => {
                const key = this.opt.result;
                const options = key && data && Array.isArray(data[key])
                    ? data[key]
                    : (Array.isArray(data) ? data : []);
                this.setOptions(options);
            })
            .catch(error => console.error('Dropdown Load Error:', error));
    }
    getEl() { return this.wrapper; }
    getValue() { return this.hiddenInput?.value ?? null; }
}

class Toolbar {
    constructor(opt) {
        this.opt = opt || {};
        this.create();
        this.applyStyle();
        this.setItems();
    }

    create() {
        this.toolbar = document.createElement('div');
        this.toolbar.id = this.opt.id || '';
        this.toolbar.setAttribute('class', this.opt.cls || 'g_toolbar');
    }

    applyStyle() {
        if (this.opt.no_style) return;
        this.toolbar.classList.add('g_toolbar_base');
        if (this.opt.no_border) this.toolbar.classList.add('g_toolbar_no_border');
        if (this.opt.no_margin) this.toolbar.classList.add('g_toolbar_no_margin');
    }

    addButton(btn) {
        const factory = arr_element_handler['button'];
        if (!factory) return;
        const button = factory(btn);
        this.toolbar.append(button.getEl());
    }

    addMenu(menu) {
        const factory = arr_element_handler['menu'];
        if (!factory) return;
        const menuEl = factory(menu);
        this.toolbar.append(menuEl.getEl());
    }

    addSeparator() {
        const sep = document.createElement('span');
        sep.classList.add('g_toolbar_separator');
        this.toolbar.append(sep);
    }

    setItems() {
        const items = Array.isArray(this.opt.items) ? this.opt.items : null;
        if (items) {
            items.forEach(item => {
                if (!item || typeof item !== 'object') return;

                if (item.type === 'separator') {
                    this.addSeparator();
                    return;
                }

                const factory = arr_element_handler[item.type];
                if (!factory) {
                    console.error('Toolbar: No valid item type:', item.type);
                    return;
                }

                const cmp = factory(item);
                if (!cmp || typeof cmp.getEl !== 'function') {
                    console.error('Toolbar: Invalid item component for type:', item.type);
                    return;
                }

                this.toolbar.append(cmp.getEl());
            });
            return;
        }

        const buttons = Array.isArray(this.opt.buttons) ? this.opt.buttons : [];
        const menus = Array.isArray(this.opt.menus) ? this.opt.menus : [];
        const separators = Array.isArray(this.opt.separators) ? this.opt.separators : [];

        buttons.forEach(btn => this.addButton(btn));
        menus.forEach(menu => this.addMenu(menu));
        separators.forEach(() => this.addSeparator());
    }

    getEl() {
        return this.toolbar;
    }
}

class Button {
    constructor(opt) {
        this.opt = opt || {};
        this.create();
    }

    create() {
        this.button = document.createElement('button');
        this.button.setAttribute('type', 'button');
        this.button.classList.add('g_toolbar_button');
        if (this.opt.id) this.button.id = this.opt.id;
        this.button.textContent = this.opt.text || this.opt.label || 'Button';
        if (typeof this.opt.onClick === 'function') {
            this.button.addEventListener('click', this.opt.onClick);
        }
    }

    getEl() {
        return this.button;
    }
}

class Menu {
    constructor(opt) {
        this.opt = opt || {};
        this.create();
    }

    create() {
        this.menu = document.createElement('details');
        this.menu.classList.add('g_toolbar_menu');
        if (this.opt.open) this.menu.open = true;

        const summary = document.createElement('summary');
        summary.classList.add('g_toolbar_menu_title');
        summary.textContent = this.opt.text || this.opt.label || 'Menu';
        this.menu.append(summary);

        const panel = document.createElement('div');
        panel.classList.add('g_toolbar_menu_panel');
        const items = Array.isArray(this.opt.items) ? this.opt.items : [];
        items.forEach(item => {
            const menuBtn = document.createElement('button');
            menuBtn.setAttribute('type', 'button');
            menuBtn.classList.add('g_toolbar_menu_item');
            menuBtn.textContent = item.text || item.label || 'Item';
            if (typeof item.onClick === 'function') {
                menuBtn.addEventListener('click', item.onClick);
            }
            panel.append(menuBtn);
        });
        this.menu.append(panel);
    }

    getEl() {
        return this.menu;
    }
}


/**
 * Objeto que crea un formulario
 */
class Form {
    arr_field_ids = new Array();
    arr_field_refs = {};
    arr_field_instances = {};
    values = {};
    constructor(opt) {
        this.opt = opt;
        this.create();
        this.setFields();
        this.setButtons();
    }

    create() {
        this.form = document.createElement('form');
        this.form.setAttribute('class', this.opt['cls'] || 'g_form');
        if (this.opt.no_border) this.form.classList.add('g_form_no_border');
        if (this.opt.no_margin) this.form.classList.add('g_form_no_margin');
        if (!this.opt.title) return;

        const title = document.createElement('h3');
        title.setAttribute('class', 'g_form_title');
        title.textContent = this.opt.title;
        this.form.append(title);
    }

    //// Fields
    setFields = () => {
        if (this.opt.fields == undefined) return;

        const field_handler = {
            textfield: (field) => {
                const inp = document.createElement('input');
                inp.setAttribute('type', 'text');
                return inp;
            },
            password: (field) => {
                const inp = document.createElement('input');
                inp.setAttribute('type', 'password');
                return inp;
            },
            file: (field) => {
                const inp = document.createElement('input');
                inp.setAttribute('type', 'file');
                if (field.accept) inp.setAttribute('accept', field.accept);
                return inp;
            },
            combobox: (field) => {
                return new Combobox(field);
            }
        };

        for (let i = 0; i < this.opt.fields.length; i++) {
            let el = this.opt.fields[i];
            if (!el || typeof el !== 'object') {
                console.error('No valid field config:', el);
                continue;
            }

            const isCustomComponentType = typeof el.type === 'object' && el.type && typeof el.type.getEl === 'function';
            const field_builder = typeof el.type === 'string' ? field_handler[el.type] : null;
            const aliasedDef = !field_builder && typeof el.type === 'string'
                ? Gb.getDef(el.type)
                : null;
            let instanceFromGb = null;
            if (!field_builder && typeof el.type === 'string') {
                if (aliasedDef && aliasedDef.type && arr_element_handler[aliasedDef.type]) {
                    const aliasOpts = Object.assign({}, aliasedDef, el.id ? { id: el.id } : {});
                    instanceFromGb = arr_element_handler[aliasedDef.type](aliasOpts);
                } else {
                    instanceFromGb = Gb.getEl(el.type) || Gb.getComponent(el.type);
                }
            }
            const isGbInstanceType = instanceFromGb && (typeof instanceFromGb.getEl === 'function' || instanceFromGb instanceof Element);
            if (!field_builder && !isCustomComponentType && !isGbInstanceType) {
                console.error('No valid field type: ', el.type);
                continue;
            }

            const fieldKey = el.id || (typeof el.type === 'string' ? el.type : null);
            if (fieldKey) this.arr_field_ids.push(fieldKey);

            let inp = null;
            let fieldInstance = null;
            if (isCustomComponentType) {
                fieldInstance = el.type;
                inp = el.type.getEl();
            } else if (isGbInstanceType) {
                if (!aliasedDef && instanceFromGb && !(instanceFromGb instanceof Element)
                    && instanceFromGb.opt && typeof instanceFromGb.constructor === 'function') {
                    // Si viene de una instancia reusable (ej. Combobox), crear una nueva con su misma config.
                    const clonedOpts = Object.assign({}, instanceFromGb.opt, el.id ? { id: el.id } : {});
                    const freshInstance = new instanceFromGb.constructor(clonedOpts);
                    fieldInstance = freshInstance;
                    if (el.id) {
                        Gb.arr_elements[el.id] = freshInstance;
                    }
                    inp = typeof freshInstance.getEl === 'function' ? freshInstance.getEl() : null;
                } else {
                    if (!(instanceFromGb instanceof Element)) {
                        fieldInstance = instanceFromGb;
                    }
                    const sourceEl = instanceFromGb instanceof Element ? instanceFromGb : instanceFromGb.getEl();
                    if (sourceEl instanceof Element) {
                        // Fallback seguro para no mover el mismo nodo entre formularios.
                        inp = (!aliasedDef && sourceEl.parentElement) ? sourceEl.cloneNode(true) : sourceEl;
                    }
                }
            } else {
                if (typeof el.type === 'string' && arr_element_handler[el.type]) {
                    const builtInstance = arr_element_handler[el.type](el);
                    if (builtInstance && typeof builtInstance.getEl === 'function') {
                        fieldInstance = builtInstance;
                        if (el.id) {
                            Gb.arr_elements[el.id] = builtInstance;
                        }
                        inp = builtInstance.getEl();
                    } else {
                        inp = builtInstance;
                    }
                } else {
                    const builtField = field_builder(el);
                    if (builtField && typeof builtField.getEl === 'function') {
                        fieldInstance = builtField;
                        if (el.id) {
                            Gb.arr_elements[el.id] = builtField;
                        }
                        inp = builtField.getEl();
                    } else {
                        inp = builtField;
                    }
                }
            }
            if (!inp || !(inp instanceof Element)) {
                console.error('Invalid field element for type:', el.type);
                continue;
            }

            if (el.id && !inp.id) {
                inp.setAttribute('id', el.id);
            }
            if (el.id && fieldInstance) {
                if (fieldInstance.opt && typeof fieldInstance.opt === 'object') {
                    fieldInstance.opt.id = el.id;
                }
                if (typeof fieldInstance.getEl === 'function') {
                    fieldInstance.getEl(el.id);
                }
            }
            if (fieldKey) {
                this.arr_field_refs[fieldKey] = inp;
                if (fieldInstance && typeof fieldInstance.getValue === 'function') {
                    this.arr_field_instances[fieldKey] = fieldInstance;
                }
            }

            let d = document.createElement('div')
            d.setAttribute('class', 'frm_el')
            if (el.label) {
                let l = document.createElement('label')
                l.innerText = el.label;
                l.setAttribute('class', 'g_form_label');
                d.append(l);
            }
            d.append(inp)

            this.form.append(d);
        }
    }

    //// Buttons
    setButtons = () => {
        if (this.opt.buttons == undefined)
            return;

        const btn_panel = document.createElement('div');
        btn_panel.setAttribute('class', 'frm_btn_panel')
        for (let i = 0; i < this.opt.buttons.length; i++) {
            let el = this.opt.buttons[i];
            if (el.type != 'button')
                throw new Error('No valid button: You are passing a tag that does not exist');

            let b = document.createElement('input');
            b.setAttribute('type', 'submit')
            b.setAttribute('value', el.text);
            b.setAttribute('id', el.id);

            b.addEventListener('click', (e) => {
                e.preventDefault();
                if (el.action === 'reset') {
                    this.reset();
                    if (typeof el.onClick === 'function') el.onClick.call();
                    return;
                }
                el.onClick.call()
            });

            btn_panel.prepend(b)
            this.form.append(btn_panel);
        }
    }

    getForm() { return this.form; }
    getEl() { return this.form; }

    getValues() {
        this.arr_field_ids.forEach((fieldId) => {
            try {
                const gbField = Gb.getEl(fieldId) || Gb.getComponent(fieldId);
                if (gbField && typeof gbField.getValue === 'function') {
                    this.values[fieldId] = gbField.getValue();
                    return;
                }
                const instanceField = this.arr_field_instances[fieldId];
                if (instanceField && typeof instanceField.getValue === 'function') {
                    this.values[fieldId] = instanceField.getValue();
                    return;
                }

                const fieldEl = this.arr_field_refs[fieldId] || document.getElementById(fieldId);
                if (!fieldEl) {
                    this.values[fieldId] = null;
                    return;
                }

                if (fieldEl.tagName === 'SELECT') {
                    this.values[fieldId] = fieldEl.value ?? null;
                    return;
                }

                if (fieldEl.type === 'file') {
                    this.values[fieldId] = fieldEl.files ?? null;
                    return;
                }

                this.values[fieldId] = fieldEl.value ?? null;
            } catch (error) {
                console.error(`Form.getValues: error reading field "${fieldId}"`, error);
                this.values[fieldId] = null;
            }
        });

        return this.values;
    }

    setValues(values) {
        let value;
        this.values = values;

        this.arr_field_ids.forEach((el) => {
            value = this.values[el] ? this.values[el] : value
            document.getElementById(el).value = value;
        })
    }

    reset() {
        try {
            if (this.form && typeof this.form.reset === 'function') {
                this.form.reset();
            }

            this.arr_field_ids.forEach((fieldId) => {
                const gbField = Gb.getEl(fieldId) || Gb.getComponent(fieldId);
                const fieldEl = this.arr_field_refs[fieldId] || document.getElementById(fieldId);

                if (gbField && typeof gbField.setValue === 'function') {
                    gbField.setValue('');
                } else if (fieldEl && fieldEl.tagName === 'SELECT') {
                    fieldEl.selectedIndex = 0;
                } else if (fieldEl && fieldEl.type === 'file') {
                    fieldEl.value = '';
                } else if (fieldEl) {
                    fieldEl.value = '';
                }

                this.values[fieldId] = null;
            });
        } catch (error) {
            console.error('Form.reset: error resetting form', error);
        }
    }
}




class Window {
    constructor(opt) {
        this.opt = opt;
        this.isMaximized = false;
        this.prevSize = { width: null, height: null };
        this.create();
        this.applyStyle();
        this.bindEvents();
        this.setItems();
        this.mount();
    }

    create() {
        this.window = document.createElement('div');
        this.title_bar = document.createElement('div');
        this.window_title = document.createElement('div');

        this.window_title.append(this.opt.title);
        this.title_bar.append(this.window_title);

        if (!this.opt.no_controls) {
            this.close_btn = document.createElement('button');
            this.maxim_btn = document.createElement('button');
            this.minim_btn = document.createElement('button');
            this.action_btn_panel = document.createElement('div');

            this.close_btn.setAttribute('type', 'button');
            this.maxim_btn.setAttribute('type', 'button');
            this.minim_btn.setAttribute('type', 'button');
            this.close_btn.setAttribute('aria-label', 'Close');
            this.maxim_btn.setAttribute('aria-label', 'Maximize');
            this.minim_btn.setAttribute('aria-label', 'Minimize');

            this.action_btn_panel.append(this.minim_btn);
            this.action_btn_panel.append(this.maxim_btn);
            this.action_btn_panel.append(this.close_btn);

            this.title_bar.append(this.action_btn_panel);
        }

        this.window.append(this.title_bar);
    }

    applyStyle() {
        this.window.classList.add('g_window', 'g_window_hidden');
        this.window_title.classList.add('g_window_title');
        this.title_bar.classList.add('g_window_title_bar');
        if (!this.opt.no_controls) {
            this.close_btn.classList.add('g_window_action_btn', 'g_window_action_btn_close');
            this.maxim_btn.classList.add('g_window_action_btn', 'g_window_action_btn_max');
            this.minim_btn.classList.add('g_window_action_btn', 'g_window_action_btn_min');
            this.action_btn_panel.classList.add('g_window_action_btn_panel');
        }
        this.setAlignment();

        if (this.opt.width) {
            this.window.style.width = typeof this.opt.width === 'number' ? `${this.opt.width}px` : `${this.opt.width}`;
        }
        if (this.opt.height) {
            this.window.style.height = typeof this.opt.height === 'number' ? `${this.opt.height}px` : `${this.opt.height}`;
        }
    }

    setAlignment() {
        const xAlign = this.opt.x_align || 'center';
        const yAlign = this.opt.y_align || 'center';
        const validX = ['left', 'center', 'right'];
        const validY = ['top', 'center', 'bottom'];
        const x = validX.includes(xAlign) ? xAlign : 'center';
        const y = validY.includes(yAlign) ? yAlign : 'center';
        this.window.classList.add(`g_window_x_${x}`);
        this.window.classList.add(`g_window_y_${y}`);
    }

    bindEvents() {
        if (this.opt.no_controls) return;
        this.close_btn.addEventListener('click', () => this.close());
        this.minim_btn.addEventListener('click', () => this.toggleMinimize());
        this.maxim_btn.addEventListener('click', () => this.toggleMaximize());
    }

    setItems() {
        if (!this.opt.items) return;

        this.opt.items.forEach(el => {
            this.window.append(el);
        })
    }

    mount() {
        if (!document.body) return;
        if (this.window.parentNode) return;
        document.body.append(this.window);
    }

    open() {
        this.mount();
        this.window.classList.remove('g_window_hidden');
    }

    close() {
        this.window.classList.add('g_window_hidden');
    }

    toggleMinimize() {
        this.window.classList.toggle('g_window_minimized');
    }

    toggleMaximize() {
        if (!this.isMaximized) {
            this.prevSize.width = this.window.style.width || '';
            this.prevSize.height = this.window.style.height || '';
            this.window.classList.add('g_window_maximized');
            this.isMaximized = true;
            return;
        }

        this.window.classList.remove('g_window_maximized');
        this.window.style.width = this.prevSize.width;
        this.window.style.height = this.prevSize.height;
        this.isMaximized = false;
    }

    getWindow() { return this.window; }
    getEl() { return this.window; }
}

class SubmitButton {
    constructor(opt) {
        this.opt = opt;
        this.b = document.createElement('input');
        this.init();
    }

    init() {
        this.b.setAttribute('type', 'submit')
        this.b.setAttribute('id', this.opt.id);
        this.b.setAttribute('value', this.opt.text);
    }

    getButton() { return this.b; }

}

class Textfield {
    constructor(opt) {
        this.i = document.createElement('input');
        this.init();
    }

    init() {
        i.setAttribute('type', 'text');
        i.setAttribute('id', opt.id);
    }

    getTextField() { return i; }
}


function button_fn(opt) {
    //// This method is very slow

    b = document.createElement('input');

    b.setAttribute('type', 'submit')
    b.setAttribute('id', opt.id);
    b.setAttribute('value', opt.text);

    return b;
}


class Container {

    constructor(opt) {
        this.opt = opt;
        this.create();
        this.applyStyle();
        this.setItems();
    }

    create() {
        this.container = document.createElement('div');
    }

    applyStyle() {
        this.container.setAttribute('class', this.opt['cls'] || 'g_container');
    }

    setItems() {
        if (!this.opt.items) return;

        this.opt.items.forEach(el => {
            this.container.append(el);
        })
    }

    getEl() { return this.container; }
}

class Tabber {
    constructor(opt) {
        this.opt = opt || {};
        this.items = [];
        this.activeIndex = this.opt.activeIndex || 0;
        this.create();
        this.applyStyle();
        this.setItems();
    }

    create() {
        this.tabber = document.createElement('div');
        this.tabber.id = this.opt.id || '';

        this.headers = document.createElement('div');
        this.panels = document.createElement('div');

        this.tabber.append(this.headers);
        this.tabber.append(this.panels);
    }

    applyStyle() {
        this.tabber.setAttribute('class', this.opt.cls || 'g_tabber');
        if (this.opt.no_style) return;

        const orientation = this.opt.vertical ? 'vertical' : (this.opt.orientation || 'horizontal');
        this.tabber.classList.add('g_tabber_base');
        this.tabber.classList.add(orientation === 'vertical' ? 'g_tabber_vertical' : 'g_tabber_horizontal');
        this.headers.classList.add('g_tabber_headers');
        this.panels.classList.add('g_tabber_panels');
    }

    setItems() {
        if (!this.opt.items) return;

        this.opt.items.forEach(item => {
            this.addItem(item);
        });
    }

    addItem(item) {
        const index = this.items.length;
        const header = document.createElement('button');
        header.setAttribute('type', 'button');
        header.classList.add('g_tabber_header');
        header.textContent = item.title || item.text || item.label || `Tab ${index + 1}`;
        header.addEventListener('click', () => {
            this.setActive(index);
        });

        const panel = document.createElement('div');
        panel.classList.add('g_tabber_panel');
        this.appendContent(panel, item);

        this.headers.append(header);
        this.panels.append(panel);
        this.items.push({ item, header, panel });
        this.setActive(this.activeIndex);
    }

    appendContent(panel, item) {
        const content = item.item || item.content;
        const items = item.items || [];

        if (content instanceof Element) {
            panel.append(content);
        } else if (content && typeof content.getEl === 'function') {
            panel.append(content.getEl());
        } else if (typeof content === 'string') {
            panel.textContent = content;
        }

        items.forEach(el => {
            if (el instanceof Element) {
                panel.append(el);
            } else if (el && typeof el.getEl === 'function') {
                panel.append(el.getEl());
            }
        });
    }

    setActive(index) {
        this.activeIndex = index;
        this.items.forEach((tab, tabIndex) => {
            const isActive = tabIndex === index;
            tab.header.classList.toggle('g_tabber_header_active', isActive);
            tab.panel.classList.toggle('g_tabber_panel_active', isActive);
        });
    }

    getValue() { return this.activeIndex; }
    getValues() { return this.items.map(tab => tab.item); }
    getEl() { return this.tabber; }
}

class Card {
    constructor(opt) {
        this.opt = opt;
        this.data = opt.data || {};
        this.fields = opt.fields || { image: 'image', title: 'title', description: 'description' };
        this.create();
        this.applyStyle();
    }

    /**
     * @brief fields {image, title, description}
     */
    create() {
        const getFieldValue = (field) => {
            if (!field) return null;
            if (typeof field === 'function') {
                return field(this.data);
            }
            return this.data[field];
        };

        const linkVal = getFieldValue(this.fields.link);

        if (linkVal) {
            this.card = document.createElement('a');
            this.card.setAttribute('href', linkVal);
        } else {
            this.card = document.createElement('div');
        }

        this.card.setAttribute('class', this.opt.cls || 'g_card');
        this.card.id = this.opt.id || '';

        const imgVal = getFieldValue(this.fields.image);
        if (imgVal) {
            this.img = document.createElement('img');
            this.img.setAttribute('src', imgVal);
            this.card.append(this.img);
        }

        const titleVal = getFieldValue(this.fields.title);
        if (titleVal) {
            this.title = document.createElement('h3');
            this.title.textContent = titleVal;
            this.card.append(this.title);
        }

        const descVal = getFieldValue(this.fields.description);
        if (descVal) {
            this.desc = document.createElement('p');
            this.desc.textContent = descVal;
            this.card.append(this.desc);
        }
    }

    applyStyle() {
        if (this.opt.no_style) return;

        const isDark = this.opt.theme === 'dark';
        this.card.classList.add('g_card_base');
        this.card.classList.add(isDark ? 'g_card_dark' : 'g_card_light');

        if (this.img) {
            this.img.classList.add('g_card_img');
        }
        if (this.title) {
            this.title.classList.add('g_card_title');
            this.title.classList.add(isDark ? 'g_card_title_dark' : 'g_card_title_light');
        }
        if (this.desc) {
            this.desc.classList.add('g_card_desc');
            this.desc.classList.add(isDark ? 'g_card_desc_dark' : 'g_card_desc_light');
        }
    }

    getEl() { return this.card; }
}

class BaseGrid {
    constructor() {
        this.url = '';
        this.opt = this.opt || {};
    }

    setUrl(url) {
        this.url = url;
    }

    setHeaders(headers) {
        this.opt.headers = Object.assign({}, this.opt.headers || {}, headers);
    }

    buildFetchOptions() {
        const options = {};
        if (this.opt.credentials) {
            options.credentials = this.opt.credentials;
        }
        if (this.opt.headers && Object.keys(this.opt.headers).length > 0) {
            options.headers = this.opt.headers;
        }
        return Object.keys(options).length > 0 ? options : undefined;
    }

    load(extraParams = {}) {
        if (!this.url) {
            console.log('BaseGrid: URL no definida.');
            return;
        }

        let fetchUrl = this.url;
        if (Object.keys(extraParams).length > 0) {
            const params = new URLSearchParams(extraParams);
            const separator = fetchUrl.includes('?') ? '&' : '?';
            fetchUrl += `${separator}${params.toString()}`;
        }

        const fetchOptions = this.buildFetchOptions();

        fetch(fetchUrl, fetchOptions)
            .then(response => response.json())
            .then(data => {
                this.onLoadData(data);
            })
            .catch(error => console.error('BaseGrid Load Error:', error));
    }

    onLoadData(data) {
        console.warn('BaseGrid: El método onLoadData debe ser sobrescrito por la clase hija.');
    }
}

class CardGrid extends BaseGrid {
    constructor(opt) {
        super();
        this.opt = opt;
        if (this.opt.url) {
            this.setUrl(this.opt.url);
        }
        this.create();
        this.applyStyle();

        // Si hay una URL en las opciones iniciales, cargarla. Si no, dibujar los items pasados en opts
        if (this.opt.url) {
            this.load();
        } else {
            this.setItems();
        }
    }

    create() {
        this.grid = document.createElement('div');
        this.grid.setAttribute('class', this.opt.cls || 'g_grid');
        this.grid.id = this.opt.id || '';
    }

    applyStyle() {
        if (this.opt.no_style) return;

        this.grid.classList.add('g_card_grid');
        if (this.opt.no_border) this.grid.classList.add('g_no_border');
        if (this.opt.no_margin) this.grid.classList.add('g_no_margin');
    }

    setItems() {
        if (!this.opt.items) return;

        this.opt.items.forEach(el => {
            if (el instanceof Element) {
                this.grid.append(el);
            } else if (el.getEl) {
                this.grid.append(el.getEl());
            } else if (el && typeof el === 'object') {
                // Si es un objeto JSON, lo tratamos como datos para una tarjeta
                this.addCard(el);
            }
        });
    }

    onLoadData(data) {
        // Limpiamos los elementos actuales
        this.grid.innerHTML = '';

        let itemsData = [];

        // Si el usuario especificó una llave 'result', buscamos el array ahí
        if (this.opt.result && data[this.opt.result]) {
            itemsData = data[this.opt.result];
        } else {
            // Intentamos obtener el array de items de la respuesta JSON por defecto
            itemsData = Array.isArray(data) ? data : (data && Array.isArray(data.items) ? data.items : []);
        }

        this.opt.items = itemsData;
        this.setItems();
    }

    addCard(data) {
        const card = new Card({
            data: data,
            fields: this.opt.fields,
            theme: this.opt.theme,
            cls: this.opt.card_cls,
            no_style: this.opt.no_style
        });
        this.grid.append(card.getEl());
    }

    getEl() { return this.grid; }
}

class TableGrid extends BaseGrid {
    constructor(opt) {
        super();
        this.opt = opt || {};
        this.selectedRow = null;
        this.selectedData = null;
        if (this.opt.url) this.setUrl(this.opt.url);
        this.create();
        this.applyStyle();
        if (this.opt.url && this.opt.autoload !== false) {
            this.load();
        } else {
            this.setRows(this.opt.items || []);
        }
    }

    create() {
        this.grid = document.createElement('div');
        this.grid.setAttribute('class', this.opt.cls || 'g_table_grid');
        this.grid.id = this.opt.id || '';
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('g_table_wrapper');
        this.table = document.createElement('table');
        this.table.classList.add('g_table');
        this.thead = document.createElement('thead');
        this.tbody = document.createElement('tbody');
        this.table.append(this.thead);
        this.table.append(this.tbody);
        this.wrapper.append(this.table);
        this.grid.append(this.wrapper);
    }

    applyStyle() {
        if (this.opt.no_style) return;
        this.grid.classList.add('g_table_grid_base');
        if (this.opt.no_border) this.grid.classList.add('g_no_border');
        if (this.opt.no_margin) this.grid.classList.add('g_no_margin');
        if (this.opt.height) {
            this.grid.style.height = typeof this.opt.height === 'number' ? `${this.opt.height}px` : this.opt.height;
        }
        if (this.opt.width) {
            this.grid.style.width = typeof this.opt.width === 'number' ? `${this.opt.width}px` : this.opt.width;
        }
    }

    setColumns(rows) {
        if (Array.isArray(this.opt.columns) && this.opt.columns.length > 0) {
            return this.opt.columns;
        }
        if (!rows || rows.length === 0 || typeof rows[0] !== 'object') return [];
        return Object.keys(rows[0]).map(key => ({ key: key, label: key }));
    }

    renderHeader(columns) {
        this.thead.innerHTML = '';
        const tr = document.createElement('tr');
        columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col.label || col.key || '';
            tr.append(th);
        });
        this.thead.append(tr);
    }

    setRows(rows = []) {
        const safeRows = Array.isArray(rows) ? rows : [];
        const columns = this.setColumns(safeRows);
        this.renderHeader(columns);
        this.tbody.innerHTML = '';
        this.selectedRow = null;
        this.selectedData = null;

        safeRows.forEach(row => {
            const tr = document.createElement('tr');
            tr.classList.add('g_table_row');
            columns.forEach(col => {
                const td = document.createElement('td');
                const value = row && typeof row === 'object' ? row[col.key] : '';
                td.textContent = value ?? '';
                tr.append(td);
            });
            tr.addEventListener('click', () => {
                this.setSelection(tr, row);
            });
            this.tbody.append(tr);
        });
    }

    setSelection(rowEl, rowData) {
        if (this.selectedRow) {
            this.selectedRow.classList.remove('g_table_row_selected');
        }
        this.selectedRow = rowEl;
        this.selectedRow.classList.add('g_table_row_selected');
        this.selectedData = rowData;
        if (typeof this.opt.onSelectionChange === 'function') {
            this.opt.onSelectionChange(rowData, rowEl);
        }
    }

    getSelection() {
        return {
            row: this.selectedRow,
            data: this.selectedData
        };
    }

    onLoadData(data) {
        let items = [];
        if (this.opt.result && Array.isArray(data?.[this.opt.result])) {
            items = data[this.opt.result];
        } else if (Array.isArray(data)) {
            items = data;
        } else if (Array.isArray(data?.items)) {
            items = data.items;
        }
        this.setRows(items);
    }

    getEl() { return this.grid; }
}

class ProgressBar {
    constructor(opt) {
        this.opt = opt || {};
        this.progress = Number(this.opt.progress || 0);
        this.fileSize = Number(this.opt.file_size || 0);
        this.successMsg = this.opt.success_msg || 'Carga completada';
        this.errorMsg = this.opt.error_msg || 'Error en la carga';
        this.progressMsg = this.opt.progress_msg || [];
        this.status = this.opt.status || 'progress';
        this.create();
        this.applyStyle();
        this.update(this.progress, this.fileSize);
        this.autoCreateWindow();
        this.embedInWindow();
    }

    create() {
        this.el = document.createElement('div');
        this.el.id = this.opt.id || '';
        this.el.className = this.opt.cls || 'g_progress_bar';

        this.track = document.createElement('div');
        this.track.classList.add('g_progress_track');
        this.fill = document.createElement('div');
        this.fill.classList.add('g_progress_fill');
        this.track.append(this.fill);

        this.meta = document.createElement('div');
        this.meta.classList.add('g_progress_meta');
        this.percentEl = document.createElement('span');
        this.percentEl.classList.add('g_progress_percent');
        this.sizeEl = document.createElement('span');
        this.sizeEl.classList.add('g_progress_size');
        this.meta.append(this.percentEl);
        this.meta.append(this.sizeEl);

        this.msgEl = document.createElement('div');
        this.msgEl.classList.add('g_progress_msg');
        this.logEl = document.createElement('div');
        this.logEl.classList.add('g_progress_log');

        this.el.append(this.track);
        this.el.append(this.meta);
        this.el.append(this.msgEl);
        this.el.append(this.logEl);
        this.setProgressMsg(this.progressMsg);
    }

    applyStyle() {
        if (this.opt.no_style) return;
    }

    formatMB(bytesValue) {
        const mb = bytesValue / (1024 * 1024);
        return mb.toFixed(2);
    }

    setStatus(status) {
        this.status = status;
        this.msgEl.classList.remove('g_progress_msg_success', 'g_progress_msg_error');
        if (status === 'success') {
            this.msgEl.textContent = this.successMsg;
            this.msgEl.classList.add('g_progress_msg_success');
            return;
        }
        if (status === 'error') {
            this.msgEl.textContent = this.errorMsg;
            this.msgEl.classList.add('g_progress_msg_error');
            return;
        }
        this.msgEl.textContent = '';
    }

    setProgressMsg(messages) {
        const msgList = Array.isArray(messages)
            ? messages
            : (messages ? [messages] : []);
        this.progressMsg = msgList;
        this.logEl.innerHTML = '';

        msgList.forEach(msg => {
            const line = document.createElement('div');
            line.classList.add('g_progress_log_line');
            line.textContent = `${msg}`;
            this.logEl.append(line);
        });
    }

    update(progress, fileSize) {
        const safeProgress = Math.max(0, Math.min(100, Number(progress || 0)));
        const safeSize = Math.max(0, Number(fileSize ?? this.fileSize));
        const sentBytes = safeSize * (safeProgress / 100);

        this.progress = safeProgress;
        this.fileSize = safeSize;

        this.fill.style.width = `${safeProgress}%`;
        this.percentEl.textContent = `${safeProgress.toFixed(2)}%`;
        this.sizeEl.textContent = `${this.formatMB(sentBytes)} MB / ${this.formatMB(safeSize)} MB`;

        if (safeProgress >= 100 && this.status !== 'error') {
            this.setStatus('success');
            return;
        }

        if (this.status !== 'error') {
            this.setStatus('progress');
        }
    }

    reset() {
        this.setStatus('progress');
        this.setProgressMsg(this.opt.progress_msg || []);
        this.update(0, this.opt.file_size || 0);
    }

    embedInWindow() {
        if (!this.opt.window_id && !this.opt.window) return;
        const target = this.opt.window || this.opt.window_id;
        if (target === true) return;
        const windowCmp = typeof target === 'string' ? (Gb.getEl(target) || Gb.getComponent(target)) : target;
        if (!windowCmp) return;
        const windowEl = typeof windowCmp.getEl === 'function' ? windowCmp.getEl() : windowCmp;
        if (!(windowEl instanceof Element)) return;
        windowEl.classList.add('g_window_progress');
        if (this.el.parentNode === windowEl) return;
        if (this.el.id) {
            const existingEl = windowEl.querySelector(`#${this.el.id}`);
            if (existingEl && existingEl !== this.el) {
                existingEl.replaceWith(this.el);
                return;
            }
        }
        windowEl.append(this.el);
    }

    autoCreateWindow() {
        if (this.opt.window !== true) return;
        const generatedWindowId = this.opt.window_id || `${this.opt.id || 'progress'}_window`;
        let win = Gb.getEl(generatedWindowId) || Gb.getComponent(generatedWindowId);
        if (!win) {
            win = Gb.define('window', {
                id: generatedWindowId,
                title: this.opt.window_title || 'Progreso',
                width: this.opt.window_width || 460,
                height: this.opt.window_height || 130,
                x_align: this.opt.window_x_align || 'center',
                y_align: this.opt.window_y_align || 'center'
            });
        }
        this.opt.window_id = generatedWindowId;
        this.opt.window = win;
        if (win && typeof win.open === 'function') {
            win.open();
        }
    }

    close(){
        if (this.opt.window !== true) return;

        this.opt.window.close();
    }

    getEl() {
        return this.el;
    }
}

class GNotification {
    constructor(opt) {
        this.opt = opt;
        // Default timeout to 3000ms (3 seconds) if not provided, passing 0 disables it.
        this.timeout = (opt.timeout !== undefined) ? opt.timeout : 3000;
        this.message = opt.message || '';
        this.create();
        this.applyStyle();
        if (opt.auto_show !== false) {
            this.show();
        }
    }

    create() {
        this.notification = document.createElement('div');
        this.notification.setAttribute('class', this.opt.cls || 'g_notification');

        let msgSpan = document.createElement('span');
        msgSpan.textContent = this.message;
        this.notification.append(msgSpan);

        if (this.opt.closable) {
            let closeBtn = document.createElement('span');
            closeBtn.textContent = '✕';
            closeBtn.classList.add('g_notification_close');
            closeBtn.addEventListener('click', () => this.hide());
            this.notification.append(closeBtn);
        }
    }

    applyStyle() {
        // Estilos manejados por clases CSS
    }

    show() {
        if (!document.body) return;
        // Reset opacity in case it is being reused
        this.notification.classList.remove('g_notification_hidden');
        document.body.appendChild(this.notification);

        if (this.timeout > 0) {
            setTimeout(() => this.hide(), this.timeout);
        }
    }

    hide() {
        if (this.notification && this.notification.parentNode) {
            this.notification.classList.add('g_notification_hidden');
            setTimeout(() => {
                if (this.notification && this.notification.parentNode) {
                    this.notification.parentNode.removeChild(this.notification);
                }
            }, 300);
        }
    }

    getEl() { return this.notification; }
}

const Gb = new Global();
