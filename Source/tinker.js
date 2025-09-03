///////////////////////////////////////////////////////////
// TYPECHECKER MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main typechecker object. */
class TypeChecker
{
  static #instance = null;
  #errors;
  #types;

  /** Creates the typechecker object. **/
  constructor() 
  {
    this.#errors = 
    {
      checkMultipleTypeError: 'Typechecker Error: Expected type array when checking for multiple types.',
      registrationOfNewTypeError: 'Typechecker Error: Invalid parameters for registerType. Expected a string name and a class constructor.',
      singleInstanceError: 'Typechecker Error: Only one TypeChecker object can exist at a time.'
    };

    if(TypeChecker.#instance) console.error(this.#errors.singleInstanceError);
    else
    {
      TypeChecker.#instance = this;
      this.#types = 
      {
        number: (x) => typeof x === "number" && !isNaN(x),
        string: (x) => typeof x === "string",
        boolean: (x) => typeof x === "boolean",
        function: (x) => typeof x === "function",
        array: (x) => Array.isArray(x),
        object: (x) => x !== null && typeof x === "object" && !Array.isArray(x),
        any: () => true
      };
    }
  }

  /** Static method to return a new Typechecker instance. Allows for Singleton+Module pattern. */
  static getInstance() 
  {
    return new TypeChecker();
  }

  /** 
   * Public method to check if a value is a specific type. This could be a base type or a previously registered type.
   * @param {string} type - The type the value should be compared with.
   * @param {Multiple} value -The value to be compared with the specified type.
   */
  check({ type, value } = {}) 
  {
    return this.#types[type]?.(value) ?? false;
  }
  
  /** 
   * Public method to check if a value is one of multiple types. This could be a base type or a previously registered type. 
   * Returns true if one of them is a matching type.
   * @param {array} types - The types the value should be compared with.
   * @param {Multiple} value - The value to be compared with the specified types.
   */
  checkMultiple({ types, value }) 
  {
    if(!this.check({ type: 'array', value: types })) console.error(this.#errors.checkMultipleTypeError);
    for(let type of types) if(this.check({ type: type, value: value })) return true;
    return false;
  }
  
  /** 
   * Public method to register a new custom type. 
   * @param {array} name - The name to reference the type with.
   * @param {Multiple} constructor - The class constructor to reference when doing the comparisons.
   */
  register({ name, constructor }) 
  {
    if(typeof name !== "string" || !(constructor instanceof Function)) console.error(this.#errors.registrationOfNewTypeError);
    this.#types[name] = (x) => x instanceof constructor;
  }
}

///////////////////////////////////////////////////////////
// COLOR MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main color object. */
class ColorManager
{
  #errors;
  static #instance = null;

  /** Creates the color object. **/
  constructor() 
  {
    this.#errors = 
    {
      singleInstanceError: 'Color Manager Error: Only one ColorUtility object can exist at a time.'
    };

    if(ColorManager.#instance) console.error(this.#errors.singleInstanceError);
    else ColorManager.#instance = this;
  }

  /** Static method to return a new ColorUtility instance. Allows for Singleton+Module pattern. */
  static getInstance() 
  {
    return new ColorManager();
  }
  
  /** 
   * Public method to check if a color value is valid or not. 
   * @param {string} color - The color to verify.
   */
  isValid({ color } = {}) 
  {
    const s = new Option().style;
    s.color = '';
    s.color = color;
    return s.color !== '';
  }

  /** 
   * Public method to check if a string is a valid hex color value or not.
   * @param {string} color - The color to verify.
   */
  isHexColor({ color } = {}) 
  {
    if (typeof color !== 'string') return false;
    return /^#[0-9a-fA-F]{6}$/.test(color);
  }
}

///////////////////////////////////////////////////////////
// UI MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main ui object. */
class UserInterface 
{
  #errors;
  static #instance = null;
  #registry;

  /** Creates the ui object. **/
  constructor() 
  {
    this.#errors = 
    {
      singleInstanceError: 'User Interface Error: Only one UserInterface object can exist at a time.',
      componentNameTypeError: 'User Interface Error: Expected type string for name.',
      componentConstructorTypeError: 'User Interface Error: Expected type function for constructor.'
    };

    if(UserInterface.#instance) console.error(this.#errors.singleInstanceError);
    else
    {
      UserInterface.#instance = this;
      this.#registry = new Map();
    }
  }

  /** Static method to return a new UserInterface instance. Allows for Singleton+Module pattern. */
  static getInstance() 
  {
    return new UserInterface();
  }

  /** 
   * Public method to register a new ui class. 
   * @param {array} name - The name to reference the class with.
   * @param {Multiple} constructor - The class constructor to reference.
   */
  register({ name, constructor } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: name })) console.error(this.#errors.componentNameTypeError);
    if(!typechecker.check({ type: 'function', value: constructor })) console.error(this.#errors.componentConstructorTypeError);
    this.#registry.set(name, constructor);
    this[name] = constructor;
  }
}

/////////////////////////////////////////////////

/** Base class representing most of the components in the ui module. */
class Component
{
  #errors;
  #element;
  #onTap;
  
  /**
   * Creates the component object.
   * @param {string} tagName - Name of the html tag to be created.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor({ tagName = 'div', options } = {})
  {
    this.#errors = 
    {
      addEvEventTypeError: 'Component Error: Expected type string for event when adding an event listener',
      addEvHandlerTypeError: 'Component Error: Expected type function for handler when trying add an event listener.',
      addClassTypeError: 'Component Error: Expected type string for className when trying to add a class.',
      alphaInvalidError: 'Component Error: Alpha value must be a string between "0.0" and "1.0" inclusive.',
      alphaTypeError: 'Component Error: Expected type string for alpha.',
      backgroundColorInvalidTypeError: 'Component Error: Invalid color value provided for backgroundColor.',
      backgroundColorTypeError: 'Component Error: Expected type string for backgroundColor.',
      borderColorTypeError: 'Component Error: Expected type string for borderColor.',
      borderColorInvalidError: 'Component Error: Invalid color value for borderColor.',
      borderWidthTypeError: 'Component Error: Expected type string for borderWidth.',
      getAttributeKeyTypeError: 'Component Error: Expected type string for key when trying to get the attribute value that corresponds with the key provided.',
      getClassesError: 'Component Error: Unable to retrieve classes; element not initialized.',
      heightTypeError: 'Component Error: Expected type string for height.',
      idTypeError: 'Component Error: Expected type string for id.',
      noTagNameParameterError: 'Component Error: No tagName parameter was detected.',
      onTapTypeError: 'Component Error: Expected type function for onTap.',
      removeAttributeKeyTypeError: 'Component Error: Expected type string for key when trying to remove the attribute value that corresponds with the key provided.',
      removeEvEventTypeError: 'Component Error: Expected type string for event when trying to remove an event listener',
      removeEvHandlerTypeError: 'Component Error: Expected type function for handler when trying to remove an event listener.',
      removeClassTypeError: 'Component Error: Expected type string for className when trying to remove a class.',
      removeComponentError: 'Component Error: Component could not be removed as expected.',
      setAttributeKeyTypeError: 'Component Error: Expected type string for key when trying to set the attribute value that corresponds with the key provided.',
      setAttributeValueTypeError: 'Component Error: Expected type string for value when trying to set the attribute value that corresponds with the key provided.',
      tagNameTypeError: 'Component Error: Expected type string for tagName.',
      widthTypeError: 'Component Error: Expected type string for width.'
    };

    if(tagName) this.#createElement({ tagName: tagName });
    if(options.alpha) this.alpha = options.alpha;
    if(options.backgroundColor) this.backgroundColor = options.backgroundColor;
    if(options.borderColor) this.borderColor = options.borderColor;
    if(options.borderWidth) this.borderWidth = options.borderWidth;
    if(options.height) this.height = options.height;
    if(options.id) this.id = options.id;
    if(options.onTap) this.onTap = options.onTap;
    if(options.width)  this.width = options.width;
  }
  
  /** 
   * Private method to create the base element via supplied html tag.
   * @param {string} tagName - Name of the html tag to be created.
   */
  #createElement({ tagName } = {})
  {
    if(!tagName) console.error(this.#errors.noTagNameParameterError);
    if(!typechecker.check({ type: 'string', value: tagName })) console.error(this.#errors.tagNameTypeError);
    this.#element = document.createElement(tagName);
  }
  
  /** 
   * Get property to return the component's alpha or opacity value.
   * @return {string} The alpha or opacity value.
   */
  get alpha() 
  { 
    return this.#element.style.opacity; 
  }
  
  /** 
   * Set property to change the component's alpha or opacity value.
   * @param {string} value - The alpha or opacity value. Must be between "0.0" and "1.0" inclusive.
   */
  set alpha(value)
  { 
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.alphaTypeError);
    const numeric = parseFloat(value);
    if(isNaN(numeric) || numeric < 0.0 || numeric > 1.0) console.error(this.#errors.alphaInvalidError);
    this.#element.style.opacity = value;
  }
  
  /** 
   * Get property to return the component's background color value.
   * @return {string} The background color value.
   */
  get backgroundColor() 
  { 
    return this.#element.style.backgroundColor; 
  }
  
  /** 
   * Set property to change the component's background color value.
   * @param {string} value - The valid color value.
   */
  set backgroundColor(value)
  {   
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.backgroundColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.backgroundColorInvalidTypeError);
    this.#element.style.backgroundColor = value;
  }

  /** 
   * Get property to return the component's border color value.
   * @return {string} The border color value.
   */
  get borderColor() 
  { 
    return this.style.borderColor 
  }

  /** 
   * Set property to change the component's border color value.
   * @param {string} value - The valid color value.
   */
  set borderColor(value) 
  {
    if(!typechecker.check({ type: 'string', value })) console.error(this.#errors.borderColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.borderColorInvalidError);
    this.style.borderColor = value;
    this.style.borderStyle = 'solid';
  }

  /** 
   * Get property to return the component's border width value.
   * @return {string} The border width value.
   */
  get borderWidth() 
  { 
    return this.style.borderWidth 
  }

  /** 
   * Set property to change the component's border width value.
   * @param {string} value - The valid width value.
   */
  set borderWidth(value) 
  {
    if(!typechecker.check({ type: 'string', value })) console.error(this.#errors.borderWidthTypeError);
    this.style.borderWidth = value;
    this.style.borderStyle = 'solid';
  }
  
  /** 
   * Get property to return the component's html element structure.
   * @return {object} The html element structure of the component.
   */
  get element() 
  { 
    return this.#element; 
  }
  
  /** 
   * Get property to return the component's height value.
   * @return {string} The component's height value.
   */
  get height() 
  { 
    return this.#element.style.height; 
  }
  
  /** 
   * Set property to change the component's height value.
   * @param {string} value - The component's height value.
   */
  set height(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.heightTypeError);
    this.#element.style.height = value;
  }

  /** 
   * Get property to return the component's id value.
   * @return {string} The component's id value.
   */
  get id() 
  { 
    return this.#element.id; 
  }
  
  /** 
   * Set property to change the component's id value.
   * @param {string} value - The component's id value.
   */
  set id(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.idTypeError);
    this.#element.id = value;
  }
  
  /** 
   * Get property to return the component's function declaration for onTap events.
   * @return {function} The component's function declaration for onTap events.
   */
  get onTap() 
  {
    return this.#onTap;
  }
  
  /** 
   * Set property to change the component's function declaration for onTap events.
   * @param {array} value - The component's function declaration for onTap events.
   */
  set onTap(value) 
  {
    if(!typechecker.check({ type: 'function', value: value })) console.error(this.#errors.onTapTypeError);
    if(this.#onTap) this.removeEventListener({ event: 'click', handler: this.#onTap });
    this.#onTap = value;
    this.addEventListener({ event: 'click', handler: value });
  }
  
  /** 
   * Get property to return the component's internal style property.
   * @return {object} The component's internal style property.
   */
  get style() 
  { 
    return this.#element.style; 
  }
  
  /** 
   * Get property to return the component's width.
   * @return {string} The component's width value.
   */
  get width() 
  { 
    return this.#element.style.width;
  }
  
  /** 
   * Set property to change the component's width value.
   * @param {string} value - The component's width value.
   */
  set width(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.widthTypeError);
    this.#element.style.width = value;
  }

  /**
   * Public method to add a class to the component.
   * @param {string} className - The CSS class name to add.
   */
  addClass({ className } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: className })) console.error(this.#errors.addClassTypeError);
    this.#element.classList.add(className);
  }
  
  /** 
   * Public method to add a custom event listener to the component.
   * @param {string} event - Event type to listen to.
   * @param {function} handler - Function to be called when the event is triggered.
   */
  addEventListener({ event, handler } = {}) 
  { 
    if(!typechecker.check({ type: 'string', value: event })) console.error(this.#errors.addEvEventTypeError);
    if(!typechecker.check({ type: 'function', value: handler })) console.error(this.#errors.addEvHandlerTypeError);
    this.#element.addEventListener(event, handler);
  }
  
  /** 
   * Public method to add a child component to the current component.
   * @param {Component} child - Child component to be added to the current component.
   */
  addComponent({ component } = {}) 
  {
    if(typechecker.check({ type: 'component', value: component })) this.#element.appendChild(component.element);
    else this.#element.appendChild(component); 
  }
  
  /** Public method to add the disabled atrribute to the component. */
  disable() 
  { 
    this.setAttribute({ key: 'disabled', value: '' }); 
  }
  
  /** Public method to remove the disabled atrribute to the component. */
  enable() 
  { 
    this.removeAttribute({ key: 'disabled' });
  }
  
  /** 
   * Public method to get the current attribute value for the provided key of the component.
   * @param {string} key - The key to retrive the associative attribute value.
   * @return {string} The attribute value associated with the key provided
   */
  getAttribute({ key } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: key })) console.error(this.#errors.getAttributeKeyTypeError);
    return this.#element.getAttribute(key);
  }

  /**
   * Public method to get all current classes of the component.
   * @return {string[]} An array of class names.
   */
  getClasses() 
  {
    if(!this.#element) console.error(this.#errors.getClassesError);
    return Array.from(this.#element.classList);
  }
  
  /** Public method to hide the component. */
  hide() 
  { 
    this.#element.style.display = 'none';
  }
  
  /** Public method to remove the component from the DOM. */
  remove() 
  {
    if(this.#element.parentNode) this.#element.parentNode.removeChild(this.#element);
    else console.error(this.#errors.removeComponentError);
  }
  
  /** 
   * Public method to remove the current attribute value for the provided key of the component.
   * @param {string} key - The key to remove the associative attribute value.
   */
  removeAttribute({ key } = {})
  {
    if(!typechecker.check({ type: 'string', value: key })) console.error(this.#errors.removeAttributeKeyTypeError);
    this.#element.removeAttribute(key);
  }

  /**
   * Public method to remove a class from the component.
   * @param {string} className - The CSS class name to remove.
   */
  removeClass({ className } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: className })) console.error(this.#errors.removeClassTypeError);
    this.#element.classList.remove(className);
  }
  
  /** 
   * Public method to remove a custom event listener to the component.
   * @param {string} event - Event type to be removed.
   * @param {function} handler - Function to be removed.
   */
  removeEventListener({ event, handler } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: event })) console.error(this.#errors.removeEvEventTypeError);
    if(!typechecker.check({ type: 'function', value: handler })) console.error(this.#errors.removeEvHandlerTypeError);
    this.#element.removeEventListener(event, handler);
  }

  /** 
   * Public method to set the attribute value for the provided key of the component.
   * @param {string} key - The key to set the associative attribute value.
   * @return {string} The attribute value associated with the key provided
   */
  setAttribute({ key, value } = {}) 
  { 
    if(!typechecker.check({ type: 'string', value: key })) console.error(this.#errors.setAttributeKeyTypeError);
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.setAttributeValueTypeError);
    this.#element.setAttribute(key, value);
  }
  
  /** Public method to show the component. */
  show() 
  { 
    this.#element.style.display = '';
  }  
}

/////////////////////////////////////////////////

/** Class representing the Blockquote Component. */
class Blockquote extends Component
{
  /**
   * Creates the blockquote object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'blockquote', options: options });
  }
}

/////////////////////////////////////////////////

/** Class representing the Button Component. */
class Button extends Component 
{
  #errors;
  #supportedStyles;
  #styles;

  /**
   * Creates the button object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'button', options: options });

    this.#errors = 
    {
      invalidStyleError: style => `Button Error: Unsupported style "${style}".`,
      stylesTypeError: 'Button Error: Expected styles to be an array of strings.',
      textTypeError: 'Button Error: Expected type string for text.'
    };

    this.#supportedStyles = 
    [
      "outline", 
      "secondary", 
      "contrast", 
      "primary"
    ];

    this.#styles = [];
    if(options.styles) this.styles = options.styles;
    if(options.text) this.text = options.text;
  }

  /**
   * Get property to get the current button styles.
   * @returns {string[]}
   */
  get styles() 
  {
    return [...this.#styles];
  }

  /**
   * Set property to set the button styles (overwrites current styles).
   * @param {string[]} value - The array of styles as strings to apply to the button.
   */
  set styles(value) 
  {
    if(!typechecker.check({ type: 'array', value: value })) console.error(this.#errors.stylesTypeError);
    this.element.className = '';
    this.#styles = value.filter(style => 
    {
      if(this.#supportedStyles.includes(style)) 
      {
        this.element.classList.add(style);
        return true;
      } 
      else 
      {
        console.error(this.#errors.invalidStyleError(style));
        return false;
      }
    });
  }

  /**
   * Get property to get the current text of the button.
   * @returns {string}
   */
  get text()
  {
    return this.element.textContent;
  }

  /**
   * Set property to set button text.
   * @param {string} value - Text of the button.
   */
  set text(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.textTypeError);
    this.element.textContent = value;
  }
}

/////////////////////////////////////////////////

/** Class representing the Card Component. */
class Card extends Component
{
  /**
   * Creates the card object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'article', options: options });
  }
}

/////////////////////////////////////////////////

/** Class representing the Column Component. */
class Column extends Component
{
  #errors;

  /**
   * Creates the column object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'div', options: options });

    this.#errors = 
    {
      alignTypeError: 'Column Error: Expected type string for align.'
    };

    this.align = options.align || 'center';
    if(options.component) this.addComponent({ component: options.component });
  }

  /**
   * Set horizontal alignment of column content.
   * @param {string} value - 'left' | 'center' | 'right'
   */
  set align(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.alignTypeError);
    this.element.style.display = 'flex';
    if(value === 'left') this.style.justifyContent = 'flex-start';
    else if(value === 'right') this.element.style.justifyContent = 'flex-end';
    else this.element.style.justifyContent = 'center';
  }

  /** 
   * Get property to return the column's align value.
   * @return {string} The column's align value.
   */
  get align() 
  {
    switch(this.element.style.justifyContent) 
    {
      case 'flex-start':
        return 'left';
      case 'flex-end':
        return 'right';
      case 'center':
      default:
        return 'center';
    }
  }
}

/////////////////////////////////////////////////

/** Class representing the Divider Component. */
class Divider extends Component
{
  /**
   * Creates the divider object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'hr', options: options });
  }
}

/////////////////////////////////////////////////

/** Class representing the Footer Component. */
class Footer extends Component
{
  #errors;

  /**
   * Creates the footer object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {
    super({ tagName: 'footer', options: options });

    this.#errors = 
    {
      containerInvalidError: `Footer Error: Expected values 'fluid' or 'fixed' for container.`,
      containerTypeError: 'Footer Error: Expected type string for container.',
    };

    this.container = options.container || 'fluid';
  }

  /**
   * Get property to return the current container layout type of the footer. Checks the class list of the main element.
   * @return {string|null} Returns 'fluid' if using 'container-fluid', 'fixed' if using 'container', or null if neither class is present.
   */
  get container()
  {
    if(this.getClasses().includes('container-fluid')) return 'fluid';
    else if(this.getClasses().includes('container')) return 'fixed';
    else return null;
  }

  /**
   * Set property to change the container layout type of the footer. Removes any existing container classes and applies the requested one.
   * @param {string} value - Accepts 'fluid' or 'fixed'.
   */
  set container(value)
  {
    if(!typechecker.check({ type: 'string', value })) console.error(this.#errors.containerTypeError);
    this.removeClass({ className: 'container-fluid' });
    this.removeClass({ className: 'container' });
    if(value === 'fluid') this.addClass({ className: 'container-fluid' });
    else if(value === 'fixed') this.addClass({ className: 'container' });
    else console.error(this.#errors.containerInvalidError);
  }
}

/////////////////////////////////////////////////

/** Class representing the Form Component. */
class Form extends Component
{
  #errors;
  #supportedControls;
  fieldset;

  /**
   * Creates the form object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'form', options: options });

    this.#errors = 
    {
      controlTypeError: 'Form Error: Expected one of the following types for control: ',
      labelTypeError : 'Form Error: Expected type string for label.'
    };

    this.#supportedControls = ['switch'];
    this.fieldset = new ui.Component({ tagName: 'fieldset', options: {} });
    this.addComponent({ component: this.fieldset });
  }

  addControl({ control, label } = {})
  {
    if(!typechecker.checkMultiple({ types: this.#supportedControls, value: control })) console.error(this.#errors.controlTypeError);
    if(!typechecker.check({ type: 'string', value: label })) console.error(this.#errors.labelTypeError);
    if(label)
    {
      let controlLabel = new ui.Component({ tagName: 'label', options: {} });
      controlLabel.addComponent({ component: control });
      controlLabel.element.appendChild(document.createTextNode(' ' + label));
      this.fieldset.addComponent({ component: controlLabel });
    }
    else this.fieldset.addComponent({ component: control });
  }
}

/////////////////////////////////////////////////

/** Class representing the Header Component. */
class Header extends Component
{
  #errors;

  /**
   * Creates the header object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {
    super({ tagName: 'header', options: options });

    this.#errors = 
    {
      containerInvalidError: `Header Error: Expected values 'fluid' or 'fixed' for container.`,
      containerTypeError: 'Header Error: Expected type string for container.',
    };

    this.container = options.container || 'fluid';
  }

  /**
   * Get property to return the current container layout type of the header. Checks the class list of the main element.
   * @return {string|null} Returns 'fluid' if using 'container-fluid', 'fixed' if using 'container', or null if neither class is present.
   */
  get container()
  {
    if(this.getClasses().includes('container-fluid')) return 'fluid';
    else if(this.getClasses().includes('container')) return 'fixed';
    else return null;
  }

  /**
   * Set property to change the container layout type of the header. Removes any existing container classes and applies the requested one.
   * @param {string} value - Accepts 'fluid' or 'fixed'.
   */
  set container(value)
  {
    if(!typechecker.check({ type: 'string', value })) console.error(this.#errors.containerTypeError);
    this.removeClass({ className: 'container-fluid' });
    this.removeClass({ className: 'container' });
    if(value === 'fluid') this.addClass({ className: 'container-fluid' });
    else if(value === 'fixed') this.addClass({ className: 'container' });
    else console.error(this.#errors.containerInvalidError);
  }
}

/////////////////////////////////////////////////

/** Class representing the Heading Component. */
class Heading extends Component 
{
  #errors;
  #rawText;

  /**
   * Creates the heading object.
   * @param {object} options - Custom options object to init properties from the constructor.
   * Requires: options.level (1–6)
   */
  constructor(options = {}) 
  {
    if(!options.level || options.level < 1 || options.level > 6)
    {
      console.error('Heading Error: Must specify a level 1-6 for a new heading. Using 1 as a default.');
      options.level = 1;
    }

    super({ tagName: `h${options.level}`, options: options });

    this.#errors = 
    {
      textTypeError: 'Heading Error: Expected type string for text.',
      textColorInvalidError: 'Heading Error: Invalid color value provided for text color.',
      textColorTypeError: 'Heading Error: Expected type string for textColor.'
    };

    this.#rawText = '';
    if(options.text) this.text = options.text;
    if(options.textColor) this.textColor = options.textColor;
  }

  /** 
   * Get property to return the heading's text value.
   * @return {string} The heading's text value.
   */
  get text() 
  {
    return this.#rawText;
  }

  /** 
   * Set property to set the heading's text value.
   * @param {string} value - The heading's text value.
   */
  set text(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.textTypeError);
    this.#rawText = value;
    this.element.textContent = value;
  }

  /** 
   * Get property to return the heading's text color value.
   * @return {string} The heading's text color value.
   */
  get textColor() 
  {
    return this.element.style.color;
  }

  /** 
   * Set property to set the heading's text color value.
   * @param {string} value - The heading's text color value. Will throw an error if invalid.
   */
  set textColor(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.textColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.textColorInvalidError);
    this.element.style.color = value;
  }
}

/////////////////////////////////////////////////

/** Class representing the HeadingGroup Component. */
class HeadingGroup extends Component
{
  /**
   * Creates the heading group object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'hgroup', options: options });
  }
}

/////////////////////////////////////////////////

/** Class representing the Icon Component. */
class Icon extends Component
{
  #errors;
  #name;

  /**
   * Creates the icon object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'i', options: options });

    this.#errors = 
    {
      colorInvalidError: 'Icon Error: Invalid color value provided for color.',
      colorTypeError: 'Icon Error: Expected type string for color.',
      nameTypeError: 'Icon Error: Expected type string for name.',
      sizeTypeError: 'Icon Error: Expected type string for size.'
    };

    if(options.color) this.color = options.color;
    if(options.name) this.name = options.name;
    if(options.size) this.size = options.size;
  }

  /** 
   * Get property to return the icon's color value.
   * @return {string} The icon's color value.
   */
  get color()
  {
    return this.element.style.color;
  }

  /** 
   * Set property to set the icon's color value.
   * @param {string} value - The icon's color value. Will throw an error if the color value is not valid.
   */
  set color(value)
  { 
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.colorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.colorInvalidError);
    this.element.style.color = value;
  }

  /**
   * Get property to get the current name of the icon.
   * @returns {string | null}
   */
  get name()
  {
    return this.#name || null;
  }

  /**
   * Set property to set the name of the icon. 
   * Currently supports font-awesome, ionicons, and bootstrap icon sets.
   * @param {string} value - Name of the icon.
   */
  set name(value) 
  {
    if(!typechecker.check({ type: 'string', value })) console.error(this.#errors.nameTypeError);
    this.element.classList.forEach(cls => this.element.classList.remove(cls));
    value.trim().split(/\s+/).forEach(cls => this.element.classList.add(cls));
    this.#name = value.trim();
  }

  /**
   * Get property to get the current size of the icon.
   * @returns {string}
   */
  get size()
  {
    return this.style.fontSize;
  }

  /**
   * Set property to set the size of the icon. Uses font size property internally.
   * @param {string} value - Size of the icon.
   */
  set size(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.sizeTypeError);
    this.style.fontSize = value;
  }
}

/////////////////////////////////////////////////

/** Class representing the Link Component. */
class Link extends Component
{
  #errors;
  #supportedStyles;
  #styles;
  #target;

  /**
   * Creates the link object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'a', options: options });

    this.#errors = 
    {
      colorInvalidError: 'Icon Error: Invalid color value provided for color.',
      colorTypeError: 'Icon Error: Expected type string for color.',
      invalidStyleError: style => `Link Error: Unsupported style "${style}".`,
      invalidTargetError: target => `Link Error: Unsupported target "${target}".`,
      stylesTypeError: 'Link Error: Expected styles to be an array of strings.',
      targetTypeError: 'Link Error: Expected type string for target.',
      textTypeError: 'Link Error: Expected type string for text.',
      urlTypeError: 'Link Error: Expected type string for url.'
    };

    this.#supportedStyles = 
    [
      'secondary', 
      'contrast', 
      'primary'
    ];

    this.#styles = [];
    this.target = options.target || 'self';
    if(options.color) this.color = options.color;
    if(options.styles) this.styles = options.styles;
    if(options.text) this.text = options.text;
    if(options.url) this.url = options.url;
  }

  /** 
   * Get property to return the link's color value.
   * @return {string} The link's color value.
   */
  get color()
  {
    return this.style.color;
  }

  /** 
   * Set property to set the link's color value.
   * @param {string} value - The link's color value. Will throw an error if the color value is not valid.
   */
  set color(value)
  { 
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.colorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.colorInvalidError);
    this.style.setProperty('--pico-underline', value);
    this.style.color = value;
  }

  /**
   * Get property to get the current link styles.
   * @returns {string[]}
   */
  get styles() 
  {
    return [...this.#styles];
  }

  /**
   * Set property to set the link styles (overwrites current styles).
   * @param {string[]} value - The array of styles as strings to apply to the link.
   */
  set styles(value) 
  {
    if(!typechecker.check({ type: 'array', value: value })) console.error(this.#errors.stylesTypeError);
    this.element.className = '';
    this.#styles = value.filter(style => 
    {
      if(this.#supportedStyles.includes(style)) 
      {
        this.element.classList.add(style);
        return true;
      } 
      else 
      {
        console.error(this.#errors.invalidStyleError(style));
        return false;
      }
    });
  }

  /**
   * Get property to get the target type of the link.
   * @returns {string}
   */
  get target()
  {
    return this.#target;
  }

  /**
   * Set property to set the link target.
   * @param {string} value - Target of where the link should be opened.
   */
  set target(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.targetTypeError);

    if(value === 'blank') value = '_blank';
    else if(value === 'self') value = '_self';
    else if(value === 'parent') value = '_parent';
    else if(value === 'top') value = '_top';
    else console.error(this.#errors.invalidTargetError(value));

    this.setAttribute({ key: 'target', value: value });
    this.#target = value;
  }

  /**
   * Get property to get the current text of the link.
   * @returns {string}
   */
  get text()
  {
    return this.element.textContent;
  }

  /**
   * Set property to set link text.
   * @param {string} value - Text of the link.
   */
  set text(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.textTypeError);
    this.element.textContent = value;
  }

  /** 
   * Get property to return the link's url value.
   * @return {string} The link's url value.
   */
  get url()
  {
    return this.getAttribute({ key: 'href'});
  }

   /**
   * Set property to set the url of the link. 
   * @param {string} value - Url of the link.
   */
  set url(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.urlTypeError);
    this.setAttribute({ key: 'href', value: value });
  }
}

/////////////////////////////////////////////////

/** Class representing the Page Component. */
class Page 
{
  #errors;
  footer;
  header;
  main;

  /**
   * Creates the page object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    this.#errors = 
    {
      componentTypeError: 'Page Error: Expected a value of type Component for component.',
      containerInvalidError: `Page Error: Expected values 'fluid' or 'fixed' for container.`,
      containerTypeError: 'Page Error: Expected type string for container.',
      faviconTypeError: 'Page Error: Expected type string for favicon url.',
      footerTypeError: 'Page Error: Expected type Footer for footer.',
      headerTypeError: 'Page Error: Expected type Header for header.',
      pageExistsError: 'Page Error: A page object already exists in the document.',
      titleTypeError: 'Page Error: Expected type string for title.'
    };

    if(document.body.querySelector('main')) 
    {
      console.error(this.#errors.pageExistsError);
      return;
    }

    this.main = new ui.Component({ tagName: 'main', options: {} });
    document.body.appendChild(this.main.element);

    this.container = options.container || 'fluid';
    if(options.favicon) this.favicon = options.favicon;
    if(options.title) this.title = options.title;
  }

  /**
   * Get property to return the current container layout type of the page. Checks the class list of the main element.
   * @return {string|null} Returns 'fluid' if using 'container-fluid', 'fixed' if using 'container', or null if neither class is present.
   */
  get container()
  {
    if(this.main.getClasses().includes('container-fluid')) return 'fluid';
    else if(this.main.getClasses().includes('container')) return 'fixed';
    else return null;
  }

  /**
   * Set property to change the container layout type of the page. Removes any existing container classes and applies the requested one.
   * @param {string} value - Accepts 'fluid' or 'fixed'.
   */
  set container(value)
  {
    if(!typechecker.check({ type: 'string', value })) console.error(this.#errors.containerTypeError);
    this.main.removeClass({ className: 'container-fluid' });
    this.main.removeClass({ className: 'container' });
    if(value === 'fluid') this.main.addClass({ className: 'container-fluid' });
    else if(value === 'fixed') this.main.addClass({ className: 'container' });
    else console.error(this.#errors.containerInvalidError);
  }

  /**
   * Get property to return the current page title (from document.title).
   * @return {string} The current document title.
   */
  get title() 
  {
    return document.title;
  }

  /**
   * Set property to change the page title (sets document.title).
   * @param {string} value - The new title string.
   */
  set title(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.titleTypeError);
    document.title = value;
  }

  /** 
   * Get property to return the current favicon URL from <head>.
   * @return {string|null} The href of the favicon link, or null if none exists.
   */
  get favicon() 
  {
    let link = document.querySelector("link[rel~='icon']");
    return link ? link.href : null;
  }

  /** 
   * Set property to change the favicon in <head>.
   * Creates a <link rel="icon"> if none exists.
   * @param {string} value - The favicon path or URL.
   */
  set favicon(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.faviconTypeError);
    let link = document.querySelector("link[rel~='icon']");
    if(!link) 
    {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = value;
  }

  /** 
   * Public method to add a new component as a child in main content DOM of the Page.
   * @param {Header} header - The header component to insert.
   */
  addComponent({ component } = {})
  {
    if(!typechecker.check({ type: 'component', value: component })) console.error(this.#errors.componentTypeError);
    this.main.addComponent({ component: component });
  }

  /** 
   * Public method to add a header element before the main element in the DOM.
   * @param {Header} header - The header component to insert.
   */
  addHeader({ header } = {})
  {
    if(!typechecker.check({ type: 'header', value: header })) console.error(this.#errors.headerTypeError);
    if(this.main.element.parentNode) this.main.element.parentNode.insertBefore(header.element, this.main.element);
    this.header = header;
  }

  /** 
   * Public method to add a footer element after the main element in the DOM.
   * @param {Footer} footer - The footer component to insert.
   */
  addFooter({ footer } = {})
  {
    if(!typechecker.check({ type: 'footer', value: footer })) console.error(this.#errors.footerTypeError);
    if(this.main.element.parentNode) this.main.element.parentNode.insertBefore(footer.element, this.main.element.nextSibling);
    this.footer = footer;
  }

  /** Public method to remove the footer element from the DOM if it exists. */
  removeFooter()
  {
    if(this.footer && this.footer.element && this.footer.element.parentNode)
    {
      this.footer.element.parentNode.removeChild(this.footer.element);
      this.footer = null;
    }
  }

  /** Public method to remove the header element from the DOM if it exists. */
  removeHeader()
  {
    if(this.header && this.header.element && this.header.element.parentNode)
    {
      this.header.element.parentNode.removeChild(this.header.element);
      this.header = null;
    }
  }
}

/////////////////////////////////////////////////

/** Class representing the Paragraph Component. */
class Paragraph extends Component 
{
  #errors;
  #rawText;

  /**
   * Creates the paragraph object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'p', options: options });

    this.#errors = 
    {
      textTypeError: 'Paragraph Error: Expected type string for text.',
      textColorInvalidError: 'Paragraph Error: Invalid color value provided for text color.',
      textColorTypeError: 'Paragraph Error: Expected type string for textColor.'
    };

    this.#rawText = '';
    if(options.text) this.text = options.text;
    if(options.textColor) this.textColor = options.textColor;
  }

  /** 
   * Get property to return the paragraph's text value.
   * @return {string} The paragraph's text value. If inline elements were used the same text will be returned. 
   */
  get text() 
  {
    if(!this.#rawText) return '';
    let raw = this.element.innerHTML;
    raw = raw.replace(
      /<abbr title="(.+?)">(.+?)<\/abbr>/g,
      '[abbr:$2|$1]'
    );

    let tagMap = [
      'strong', 'b', 'i', 'em', 'cite',
      'del', 'ins', 'kbd', 'mark',
      's', 'small', 'sub', 'sup', 'u'
    ];

    for(let tag of tagMap) 
    {
      let regex = new RegExp(`<${tag}>(.+?)<\/${tag}>`, 'g');
      raw = raw.replace(regex, `[${tag}:$1]`);
    }

    return raw;
  }

  /** 
   * Set property to set the paragraph's text value.
   * @param {string} value - The paragraph's text value. Supports inline element support through bracket notation.
   * Ex: This is a [em:very] [strong:strong] paragraph! 
   * It Supports the following tags: strong, b, i, em, cite, del, ins, kbd, mark, s, small, sub, sup, u.
   */
  set text(value) 
  {
    if(!typechecker.check({ type: 'string', value })) console.error(this.#errors.textTypeError);

    this.#rawText = value;
    let tagMap = [
      'strong', 'b', 'i', 'em', 'cite',
      'del', 'ins', 'kbd', 'mark',
      's', 'small', 'sub', 'sup', 'u'
    ];

    let formatted = value;
    formatted = formatted.replace(
      /\[abbr:(.+?)\|(.+?)\]/g,
      '<abbr title="$2">$1</abbr>'
    );

    for(let tag of tagMap) 
    {
      let regex = new RegExp(`\\[${tag}:(.+?)\\]`, 'g');
      formatted = formatted.replace(regex, `<${tag}>$1</${tag}>`);
    }

    this.element.innerHTML = formatted;
  }

  /** 
   * Get property to return the paragraph's text color value.
   * @return {string} The paragraph's text color value.
   */
  get textColor() 
  {
    return this.element.style.color;
  }

  /** 
   * Set property to set the paragraph's text color value.
   * @param {string} value - The paragraph's text color value. Will throw an error if the color value is not valid.
   */
  set textColor(value) 
  {
    if(!typechecker.check({ type: 'string', value })) console.error(this.#errors.textColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.textColorInvalidError);
    this.element.style.color = value;
  }
}

/////////////////////////////////////////////////

/** Class representing the Row Component. */
class Row extends Component
{
  #errors;

  /**
   * Creates the row object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'div', options: options });

    this.#errors = 
    {
      columnTyperError: 'Row Error: Expected type Column for column.'
    };

    this.addClass({ className: 'grid' });
  }

  /**
   * Public method to add a column to a row in the grid system.
   * @param {Column} column - Column to be added to the row object.
   */
  addColumn({ column })
  {
    if(!typechecker.check({ type: 'column', value: column })) console.error(this.#errors.columnTyperError);
    this.addComponent({ component: column });
  }
}

/////////////////////////////////////////////////

/** Class representing the Section Component. */
class Section extends Component
{
  /**
   * Creates the section object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'section', options: options });
  }
}

/////////////////////////////////////////////////

/** Class representing the Switch Component. */
class Switch extends Component
{
  #errors;
  #checked;
  #color;
  #name;
  #onChange;

  /**
   * Creates the switch object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'input', options: options });

    this.#errors = 
    {
      checkedTypeError : 'Switch Error: Expected type boolean for checked.',
      colorInvalidError: 'Switch Error: Invalid color value for color.',
      colorTypeError: 'Switch Error: Expected type string for color.',
      nameTypeError : 'Switch Error: Expected type string for name.',
      onChangeTypeError: 'Switch Error: Expected type function for onChange.'
    };

    this.setAttribute({ key: 'type', value: 'checkbox' });
    this.setAttribute({ key: 'role', value: 'switch' });

    this.checked = options.checked || false;
    if(options.color) this.color = options.color;
    if(options.name) this.name = options.name;
    if(options.onChange) this.onChange = options.onChange;
  }

  /* Private method to emit switch changes internally. */
  #emitChange()
  {
    const event = new Event('change', { bubbles: true });
    this.element.dispatchEvent(event);
  }

  /** 
   * Get property to return the checked value of the switch.
   * @return {boolean} The checked value of the switch. 
   */
  get checked()
  {
    return this.#checked;
  }

  /** 
   * Set property to set the checked value of the switch.
   * @param {string} value - The checked value of the switch.
   */
  set checked(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) console.error(this.#errors.checkedTypeError);
    if(value == true) this.on();
    else this.off();
  }

  /** 
   * Get property to return the color of the switch.
   * @return {string} The color of the switch. 
   */
  get color() 
  { 
    return this.#color; 
  }
  
  /** 
   * Set property to set the color of the switch.
   * @param {string} value - The color of the switch.
   */
  set color(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.colorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.colorInvalidError);
    this.style.setProperty("--pico-switch-checked-background-color", value);
    this.#color = value;
  }

  /** 
   * Get property to return the name of the switch.
   * @return {string} The name of the switch. 
   */
  get name()
  {
    return this.#name;
  }

  /** 
   * Set property to set the name of the switch.
   * @param {string} value - The name of the switch.
   */
  set name(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.nameTypeError);
    this.removeAttribute({ key: 'name' });
    this.setAttribute({ key: 'name', value: value });
    this.#name = value;
  }

  /** 
   * Get property to return the function being called during on change events.
   * @return {function} The function being called during on change events.
   */
  get onChange() 
  { 
    return this.#onChange; 
  }

  /** 
   * Set property to set the function being called during on change events.
   * @param {function} value - The function being called during on change events. Returns the state of the switch.
   */
  set onChange(value)
  {
    if(!typechecker.check({ type: 'function', value: value })) console.error(this.#errors.onChangeTypeError);
  
    if(this.#onChange) this.removeEventListener({ event: 'change', handler: this.#onChange });
    const handler = (event) => value(event.target.checked);
  
    this.#onChange = handler;
    this.addEventListener({ event: 'change', handler: handler });
  }

  /* Public method to turn the switch on. */
  on(tap = false) 
  { 
    this.setAttribute({ key: 'checked', value: '' });
    this.#checked = true;
    if(tap == false) this.#emitChange();
  }

  /* Public method to turn the switch off. */
  off(tap = false)
  {
    this.removeAttribute({ key: 'checked' });
    this.#checked = false;
    if(tap == false) this.#emitChange();
  }

  /* Public method to toggle the switch state. */
  toggle(tap = false)
  {
    if(this.#checked === true) this.off(tap);
    else this.on(tap);
  }
}

/////////////////////////////////////////////////

/** Class representing the Table Component. */
class Table extends Component
{
  #errors;
  #scopeTypes;
  body;
  footer;
  header;

  /**
   * Creates the table object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'table', options: options });

    this.#errors = 
    {
      invalidScopeError: scope => `Table Error: Unsupported scope "${scope}".`,
      rowTypeError: 'Table Error: Expected type TableRow for row.',
      scopeTypeError: 'Table Error: Expected type string for scope.',
      stripedTypeError: 'Table Error: Expected type boolean for striped.'
    };

    this.#scopeTypes = 
    {
      header: 'header',
      body: 'body',
      footer: 'footer',
    };

    this.header = new ui.Component({ tagName: 'thead', options: {} });
    this.body = new ui.Component({ tagName: 'tbody', options: {} });
    this.footer = new ui.Component({ tagName: 'tfoot', options: {} });

    this.addComponent({ component: this.header });
    this.addComponent({ component: this.body });
    this.addComponent({ component: this.footer });

    if(options.striped) this.striped = options.striped;
  }

  /** 
   * Get property to return the table striped value.
   * @return {boolean} The table striped value.
   */
  get striped()
  {
    return this.element.classList.contains('striped');
  }

  /** 
   * Set property to set the table's striped value.
   * @param {boolean} value - The table's striped value.
   */
  set striped(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) console.error(this.#errors.stripedTypeError);
    if(value === true) this.addClass({ className: 'striped' })
    else this.removeClass({ className: 'striped '});
  }

  /** 
   * Public method to add a new row to the table.
   * @param {TableRow} row - The row to be inserted in the table.
   * @param {string} scope - The scope of which the row should be added to the table. Accepts header, body, or footer.
   */
  addRow({ row, scope } = {})
  {
    if(!typechecker.check({ type: 'table-row', value: row })) console.error(this.#errors.rowTypeError);
    if(!typechecker.check({ type: 'string', value: scope })) console.error(this.#errors.scopeTypeError);
    if(scope === this.#scopeTypes.header) this.header.addComponent({ component: row });
    else if(scope === this.#scopeTypes.body) this.body.addComponent({ component: row });
    else if(scope === this.#scopeTypes.footer) this.footer.addComponent({ component: row });
    else console.error(this.#errors.invalidScopeError(scope));
  }
}

/////////////////////////////////////////////////

/** Class representing the TableCell Component. */
class TableCell extends Component
{
  #errors;
  #rawText;
  #type;

  /**
   * Creates the table cell object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    let validTypes = 
    {
      th: 'header',
      td: 'data'
    };

    let tagName = 'td';
    if(options.type  == validTypes.th) tagName = 'th';
    else tagName = 'td';

    if(!typechecker.check({ type: 'string', value: tagName })) console.error('Table Cell Error: Expected type string for type.');

    super({ tagName: tagName, options: options });
    this.#type = tagName;

    this.#errors = 
    {
      textTypeError: 'Table Cell Error: Expected type string for text.',
      textColorInvalidError: 'Table Cell Error: Invalid color value provided for text color.',
      textColorTypeError: 'Table Cell Error: Expected type string for textColor.'
    };

    this.#rawText = '';
    if(options.component) this.addComponent({ component: options.component });
    if(options.text) this.text = options.text;
    if(options.textColor) this.textColor = options.textColor;  
  }

  /** 
   * Get property to return the table cell's type.
   * @return {string} The table cell's type.
   */
  get type()
  {
    return this.#type;
  }

  /** 
   * Get property to return the table cell's text value.
   * @return {string} The table cell's text value. If inline elements were used the same text will be returned. 
   */
  get text()
  {
    if(!this.#rawText) return '';
    let raw = this.element.innerHTML;
    raw = raw.replace(
      /<abbr title="(.+?)">(.+?)<\/abbr>/g,
      '[abbr:$2|$1]'
    );

    let tagMap = [
      'strong', 'b', 'i', 'em', 'cite',
      'del', 'ins', 'kbd', 'mark',
      's', 'small', 'sub', 'sup', 'u'
    ];

    for(let tag of tagMap) 
    {
      let regex = new RegExp(`<${tag}>(.+?)<\/${tag}>`, 'g');
      raw = raw.replace(regex, `[${tag}:$1]`);
    }

    return raw;
  }

  /** 
   * Set property to set the table cell's text value.
   * @param {string} value - The table cell's text value. Supports inline element support through bracket notation.
   * Ex: This is a [em:very] [strong:strong] table cell! 
   * It Supports the following tags: strong, b, i, em, cite, del, ins, kbd, mark, s, small, sub, sup, u.
   */
  set text(value)
  {
    if(!typechecker.check({ type: 'string', value })) console.error(this.#errors.textTypeError);

    this.#rawText = value;
    let tagMap = [
      'strong', 'b', 'i', 'em', 'cite',
      'del', 'ins', 'kbd', 'mark',
      's', 'small', 'sub', 'sup', 'u'
    ];

    let formatted = value;
    formatted = formatted.replace(
      /\[abbr:(.+?)\|(.+?)\]/g,
      '<abbr title="$2">$1</abbr>'
    );

    for(let tag of tagMap) 
    {
      let regex = new RegExp(`\\[${tag}:(.+?)\\]`, 'g');
      formatted = formatted.replace(regex, `<${tag}>$1</${tag}>`);
    }

    this.element.innerHTML = formatted;
  }

  /** 
   * Get property to return the table cell's text color value.
   * @return {string} The table cell's text color value.
   */
  get textColor() 
  {
    return this.element.style.color;
  }

  /** 
   * Set property to set the table cell's text color value.
   * @param {string} value - The table cell's text color value. Will throw an error if the color value is not valid.
   */
  set textColor(value) 
  {
    if(!typechecker.check({ type: 'string', value })) console.error(this.#errors.textColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.textColorInvalidError);
    this.element.style.color = value;
  }
}

/////////////////////////////////////////////////

/** Class representing the TableRow Component. */
class TableRow extends Component
{
  /**
   * Creates the table row object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'tr', options: options });
  }

  /** 
   * Public method to add a new table cell to the row.
   * @param {TableCell} cell - The cell to be inserted in the row.
   */
  addCell({ cell } = {})
  {
    if(!typechecker.check({ type: 'table-cell', value: cell })) console.error('Table Row Error: Expected type TableCell for cell.');
    this.addComponent({ component: cell });
  }
}

///////////////////////////////////////////////////////////

globalThis.typechecker = TypeChecker.getInstance();
globalThis.color = ColorManager.getInstance();
globalThis.ui = UserInterface.getInstance();

typechecker.register({ name: 'blockquote', constructor: Blockquote });
typechecker.register({ name: 'button', constructor: Button });
typechecker.register({ name: 'card', constructor: Card });
typechecker.register({ name: 'column', constructor: Column });
typechecker.register({ name: 'component', constructor: Component });
typechecker.register({ name: 'divider', constructor: Divider });
typechecker.register({ name: 'footer', constructor: Footer });
typechecker.register({ name: 'form', constructor: Form });
typechecker.register({ name: 'header', constructor: Header });
typechecker.register({ name: 'heading', constructor: Heading });
typechecker.register({ name: 'heading-group', constructor: HeadingGroup });
typechecker.register({ name: 'icon', constructor: Icon });
typechecker.register({ name: 'link', constructor: Link });
typechecker.register({ name: 'page', constructor: Page });
typechecker.register({ name: 'paragraph', constructor: Paragraph });
typechecker.register({ name: 'row', constructor: Row });
typechecker.register({ name: 'section', constructor: Section });
typechecker.register({ name: 'switch', constructor: Switch });
typechecker.register({ name: 'table', constructor: Table });
typechecker.register({ name: 'table-cell', constructor: TableCell });
typechecker.register({ name: 'table-row', constructor: TableRow });

ui.register({ name: 'Blockquote', constructor: Blockquote });
ui.register({ name: 'Button', constructor: Button });
ui.register({ name: 'Card', constructor: Card });
ui.register({ name: 'Column', constructor: Column });
ui.register({ name: 'Component', constructor: Component });
ui.register({ name: 'Divider', constructor: Divider });
ui.register({ name: 'Footer', constructor: Footer });
ui.register({ name: 'Form', constructor: Form });
ui.register({ name: 'Header', constructor: Header });
ui.register({ name: 'Heading', constructor: Heading });
ui.register({ name: 'HeadingGroup', constructor: HeadingGroup });
ui.register({ name: 'Icon', constructor: Icon });
ui.register({ name: 'Link', constructor: Link });
ui.register({ name: 'Page', constructor: Page });
ui.register({ name: 'Paragraph', constructor: Paragraph });
ui.register({ name: 'Row', constructor: Row });
ui.register({ name: 'Section', constructor: Section });
ui.register({ name: 'Switch', constructor: Switch });
ui.register({ name: 'Table', constructor: Table });
ui.register({ name: 'TableCell', constructor: TableCell });
ui.register({ name: 'TableRow', constructor: TableRow });