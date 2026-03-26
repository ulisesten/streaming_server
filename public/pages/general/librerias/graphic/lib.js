class Global {
    arr_elements = new Array();

    /**
     * @brief Método capaz de definir objetos.
     * @param element Nombre del elemento a definir. Ejemplo: form.
     * @param opt Opciones de configuración para el elemento a definir.
     */
    define(element, opt) {

        this.arr_elements[opt.id] = arr_element_handler[element](opt);
        return;

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
    'header': (opts)=> {
        return (new Header(opts));
    },
    'container': (opts) => {
        return (new Container(opts));
    }
}

class Header {
    cmp = null;
    constructor(opts){
        this.opts = opts;
        this.create();
    }

    create() {
        this.cmp = document.createElement('div');
        this.cmp.setAttribute('class',this.opts['cls'] || 'g_header');
        this.cmp.id = this.opts['id'] || '';
        this.cmp_content = document.createElement('div');
        this.cmp_content.setAttribute('class','header-content');
        this.cmp.append(this.cmp_content);
        this.setTitle(this.opts['title']);

    }

    setTitle(title) {
        const a_title = document.createElement('a');
        a_title.setAttribute('href','/');
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
        this.form.setAttribute('class',this.opt['cls'] || 'g_form');
    }
     
    //// Fields
    setFields = ()=> {
        if( this.opt.fields == undefined )
            return;

        for(let i = 0; i < this.opt.fields.length; i++ ) {
            let el = this.opt.fields[i];

            if(el.type != 'textfield') 
                throw new Error('No valid field');

            this.arr_field_ids.push(el.id);

            let inp = document.createElement('input');
            inp.setAttribute('type', 'text');
            inp.setAttribute('id', el.id );

            let l = document.createElement('label')
            l.innerText = el.label;
            l.setAttribute("style", "margin:4px;"); 

            let d = document.createElement('div')
            d.setAttribute('class','frm_el')
            d.append(l);
            d.append(inp)

            this.form.append(d);
        }
    }

    //// Buttons
    setButtons = ()=>  {
        if(this.opt.buttons == undefined)
            return;

        const btn_panel = document.createElement('div');
        btn_panel.setAttribute('class','frm_btn_panel')
        for(let i = 0; i < this.opt.buttons.length; i++ )  {
            let el = this.opt.buttons[i];
            if(el.type != 'button')
                throw new Error('No valid button: You are passing a tag that does not exist');

            let b = document.createElement('input');
            b.setAttribute('type', 'submit')
            b.setAttribute('value', el.text);
            b.setAttribute('id', el.id);

            b.addEventListener('click', (e)=> {
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

        this.arr_field_ids.forEach( el => {
            this.values[el] = document.getElementById(el).value;
        });

        return this.values;
    }

    setValues(values) {
        let value;
        this.values = values;
        
        this.arr_field_ids.forEach((el) => {
            value = this.values[el]? this.values[el] : value
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
        this.window    = document.createElement('div');
        this.title_bar = document.createElement('div');
        this.close_btn = document.createElement('i');
        this.maxim_btn = document.createElement('i');
        this.minim_btn = document.createElement('i');
        this.action_btn_panel = document.createElement('div');
        this.window_title = document.createElement('div');
        
        this.close_btn.setAttribute('class','fa-solid fa-xmark fa-sm');
        this.maxim_btn.setAttribute('class','fa-regular fa-window-maximize fa-sm');
        this.minim_btn.setAttribute('class','fa-regular fa-window-minimize fa-sm');

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

        this.window_title.setAttribute('style','margin:4px 8px; display:inline-block;');

        this.title_bar.setAttribute('style','width:100%; height:24px; border-bottom:solid 1px #bababa;');

        this.close_btn.setAttribute('style',this.action_btn_style);
        this.maxim_btn.setAttribute('style',this.action_btn_style);
        this.minim_btn.setAttribute('style',this.action_btn_style);

        this.action_btn_panel.setAttribute('style', 'float:right; margin:4px;');
    }

    setItems(){
        if(!this.opt.items) return;

        this.opt.items.forEach( el => {
            this.window.append(el);
        })
    }

    getWindow() { return this.window; }
}

class Button {
    constructor(opt) {
        this.opt=opt;
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
        i.setAttribute('id', opt.id );
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
        this.container    = document.createElement('div');
    }

    applyStyle() {
        const con_width = this.opt.width? `${this.opt.width}` : '100%';
        const con_height = this.opt.height? `${this.opt.height}` : 'auto';

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

    setItems(){
        if(!this.opt.items) return;

        this.opt.items.forEach( el => {
            this.container.append(el);
        })
    }

    getEl() { return this.container; }
}



const Gb = new Global();