class Global {
    arr_elements = new Array();

    /**
     * @brief Método capaz de definir objetos.
     * @param element Nombre del elemento a definir. Ejemplo: form.
     * @param opt Opciones de configuración para el elemento a definir.
     */
    define(element, opt) {

        this.arr_elements[opt.id] = arr_element_handler[element](opt);
        return this.arr_elements[opt.id];

    }

    /**
     * @brief Retorna el elemento con el id correspondiente.
     * @param id Id del elemento que deseamos obtener.
     * @return Elemento HTML.
     */
    getComponent(id) { return this.arr_elements[id]; }
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
    'card_grid': (opts) => {
        return (new CardGrid(opts));
    },
    'card': (opts) => {
        return (new Card(opts));
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
        this.cmp_content.setAttribute('class', 'header-content');
        this.cmp.append(this.cmp_content);
        this.setTitle(this.opts['title']);

    }

    setTitle(title) {
        const a_title = document.createElement('a');
        a_title.setAttribute('href', '/');
        a_title.textContent = title;
        this.cmp_content.append(a_title);
    }

    getHeader() {
        return this.cmp;
    }

    getEl() {
        return this.cmp;
    }
}


/**
 * Objeto que crea un formulario
 */
class Form {
    arr_field_ids = new Array();
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
    }

    //// Fields
    setFields = () => {
        if (this.opt.fields == undefined)
            return;

        for (let i = 0; i < this.opt.fields.length; i++) {
            let el = this.opt.fields[i];

            if (el.type != 'textfield' && el.type != 'file') {
                console.error('No valid field: ', el.type);
                continue;
            }

            this.arr_field_ids.push(el.id);

            let inp = document.createElement('input');
            if (el.type === 'file') {
                inp.setAttribute('type', 'file');
                if (el.accept) {
                    inp.setAttribute('accept', el.accept);
                }
            } else {
                inp.setAttribute('type', 'text');
            }
            inp.setAttribute('id', el.id);

            let l = document.createElement('label')
            l.innerText = el.label;
            l.setAttribute("style", "margin:4px;");

            let d = document.createElement('div')
            d.setAttribute('class', 'frm_el')
            d.append(l);
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
                el.onClick.call()
            });

            btn_panel.prepend(b)
            this.form.append(btn_panel);
        }
    }

    getForm() { return this.form; }
    getEl() { return this.form; }

    getValues() {
        //let index;

        //for(let i = 0; i < this.arr_field_ids.length; i++ )  {
        //    index = this.arr_field_ids[i];
        //    this.values[index] = document.getElementById(index).value
        //}

        this.arr_field_ids.forEach(el => {
            this.values[el] = document.getElementById(el).value;
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
}




class Window {
    action_btn_style = 'margin:8px; color:#454545; cursor:pointer;';

    constructor(opt) {
        this.opt = opt;
        this.create();
        this.applyStyle();
        this.setItems();
    }

    create() {
        this.window = document.createElement('div');
        this.title_bar = document.createElement('div');
        this.close_btn = document.createElement('i');
        this.maxim_btn = document.createElement('i');
        this.minim_btn = document.createElement('i');
        this.action_btn_panel = document.createElement('div');
        this.window_title = document.createElement('div');

        this.close_btn.setAttribute('class', 'fa-solid fa-xmark fa-sm');
        this.maxim_btn.setAttribute('class', 'fa-regular fa-window-maximize fa-sm');
        this.minim_btn.setAttribute('class', 'fa-regular fa-window-minimize fa-sm');

        this.window_title.append(this.opt.title);
        this.title_bar.append(this.window_title);

        this.action_btn_panel.append(this.minim_btn);
        this.action_btn_panel.append(this.maxim_btn);
        this.action_btn_panel.append(this.close_btn);

        this.title_bar.append(this.action_btn_panel);

        this.window.append(this.title_bar);
    }

    applyStyle() {
        this.window.setAttribute('style',
            `
            position:absolute;
            width:${this.opt.width}px;
            height:${this.opt.height}px;
            border:solid 1px #bababa;
            border-radius:4px;
            top:50%;
            left:50%;
            transform: translate(-50%, -50%);
            -webkit-box-shadow: 0px 4px 18px -7px rgba(94,92,94,0.94);
            -moz-box-shadow: 0px 4px 18px -7px rgba(94,92,94,0.94);
            box-shadow: 0px 4px 18px -7px rgba(94,92,94,0.94);`
        );

        this.window_title.setAttribute('style', 'margin:4px 8px; display:inline-block;');

        this.title_bar.setAttribute('style', 'width:100%; height:24px; border-bottom:solid 1px #bababa;');

        this.close_btn.setAttribute('style', this.action_btn_style);
        this.maxim_btn.setAttribute('style', this.action_btn_style);
        this.minim_btn.setAttribute('style', this.action_btn_style);

        this.action_btn_panel.setAttribute('style', 'float:right; margin:4px;');
    }

    setItems() {
        if (!this.opt.items) return;

        this.opt.items.forEach(el => {
            this.window.append(el);
        })
    }

    getWindow() { return this.window; }
}

class Button {
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
        const con_width = this.opt.width ? `${this.opt.width}` : '100%';
        const con_height = this.opt.height ? `${this.opt.height}` : 'auto';

        this.container.setAttribute('style',
            `position: relative;
            display: block;
            width: ${con_width};
            height: ${con_height};
            left:50%;
            transform: translate(-50%, 0);
            `
        );
    }

    setItems() {
        if (!this.opt.items) return;

        this.opt.items.forEach(el => {
            this.container.append(el);
        })
    }

    getEl() { return this.container; }
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
        const bgColor = isDark ? '#222' : '#fff';
        const textColor = isDark ? '#eee' : '#333';
        const descColor = isDark ? '#aaa' : '#666';
        const borderColor = isDark ? '#444' : '#e0e0e0';

        this.card.setAttribute('style', `
            border: 1px solid ${borderColor};
            border-radius: 8px;
            padding: 0px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            background-color: ${bgColor};
            width: ${this.opt.width || '100%'};
            box-sizing: border-box;
            transition: box-shadow 0.3s ease;
            text-decoration: none;
            color: inherit;
        `);

        if (this.img) {
            this.img.setAttribute('style', 'max-width: 100%; border-radius: 4px; margin-bottom: 12px;');
        }
        if (this.title) {
            this.title.setAttribute('style', `margin: 0 8px 8px 8px; font-size: 1.2em; color: ${textColor};`);
        }
        if (this.desc) {
            this.desc.setAttribute('style', `margin: 0 4px 8px 4px; color: ${descColor}; font-size: 0.9em;`);
        }
    }

    getEl() { return this.card; }
}

class BaseGrid {
    constructor() {
        this.url = '';
    }

    setUrl(url) {
        this.url = url;
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

        fetch(fetchUrl)
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

        this.grid.setAttribute('style', `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(${this.opt.minWidth || '250px'}, 1fr));
            gap: ${this.opt.gap || '16px'};
            padding: ${this.opt.padding || '16px'};
            width: ${this.opt.width || '100%'};
            box-sizing: border-box;
        `);
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
            closeBtn.setAttribute('style', 'margin-left: 12px; cursor: pointer; font-weight: bold;');
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
        this.notification.style.opacity = '1';
        document.body.appendChild(this.notification);

        if (this.timeout > 0) {
            setTimeout(() => this.hide(), this.timeout);
        }
    }

    hide() {
        if (this.notification && this.notification.parentNode) {
            this.notification.style.opacity = '0';
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