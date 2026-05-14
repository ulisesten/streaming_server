# Gb Library - Contexto para desarrollo

## Descripción
Librería JavaScript vanilla para creación dinámica de componentes HTML mediante configuración JSON. Los estilos van en CSS externo, clases con prefijo `g_`.

## Arquitectura base

```javascript
class Global {
    arr_elements = new Array();
    define(element, opt) {
        this.arr_elements[opt.id] = arr_element_handler[element](opt);
        return this.arr_elements[opt.id];
    }
    getComponent(id) { return this.arr_elements[id]; }
}

const arr_element_handler = {
    'form': (opts) => new Form(opts),
    'header': (opts) => new Header(opts),
    'container': (opts) => new Container(opts),
    'card_grid': (opts) => new CardGrid(opts),
    'card': (opts) => new Card(opts),
    'notification': (opts) => new GNotification(opts)
};

const Gb = new Global();
```

## Patrón de componentes

Todo nuevo componente debe:

1. Ser una clase con constructor que recibe opt

2. Tener método create() para crear el elemento DOM

3. Tener método applyStyle() que SOLO asigna clases CSS (nunca estilos inline)

4. Tener método getEl() que retorna el elemento DOM

5. Tener método getValue/getValues que retorna el valor/valores que almacena el elemento.

6. Registrarse en arr_element_handler


## Estructura obligatoria:

```javascript
class NuevoComponente {
    constructor(opt) {
        this.opt = opt;
        this.create();
        this.applyStyle();
        if (this.opt.items) this.setItems();
        if (this.opt.onClick) this.bindEvents();
    }
    
    create() {
        this.el = document.createElement('div');
        this.el.id = this.opt.id || '';
        this.el.className = this.opt.cls || 'g_nuevo';
    }
    
    applyStyle() {
        if (this.opt.no_style) return;
        // SOLO clases CSS, nada de style inline
    }
    
    getEl() { return this.el; }
}
```


## Componentes existentes (para referencia)
- Form: Formularios con fields (textfield/file) y buttons

- Header: Barra superior con título

- Container: Wrapper con width/height, items agrupables

- Card: Tarjeta con image, title, description, link

- CardGrid: Grid responsiva de cards, soporta carga por URL

- GNotification: Notificaciones emergentes con timeout


## Reglas de desarrollo
1. NO estilos inline - Usar clases CSS con prefijo g_

2. NO dependencias externas - JavaScript vanilla solamente

3. Mantener simplicidad - Código legible, mínimo anidamiento

4. Early returns - Validar al inicio, evitar else

5. Documentar con Doxygen - @param, @return, @brief

6. Nuevo componente = nueva entrada en arr_element_handler

7. Si encuentras estilos inline extraelos y remplázalos con clases css