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
      alphaInvalidError: 'Component Error: Alpha value must be a string between "0.0" and "1.0" inclusive.',
      alphaTypeError: 'Component Error: Expected type string for alpha.',
      backgroundColorInvalidTypeError: 'Component Error: Invalid color value provided for backgroundColor.',
      backgroundColorTypeError: 'Component Error: Expected type string for backgroundColor.',
      borderColorTypeError: 'Component Error: Expected type string for borderColor.',
      borderColorInvalidError: 'Component Error: Invalid color value for borderColor.',
      borderWidthTypeError: 'Component Error: Expected type string for borderWidth.',
      getAttributeKeyTypeError: 'Component Error: Expected type string for key when trying to get the attribute value that corresponds with the key provided.',
      heightTypeError: 'Component Error: Expected type string for height.',
      idTypeError: 'Component Error: Expected type string for id.',
      noTagNameParameterError: 'Component Error: No tagName parameter was detected.',
      onTapTypeError: 'Component Error: Expected type function for onTap.',
      removeAttributeKeyTypeError: 'Component Error: Expected type string for key when trying to remove the attribute value that corresponds with the key provided.',
      removeEvEventTypeError: 'Component Error: Expected type string for event when trying to remove an event listener',
      removeEvHandlerTypeError: 'Component Error: Expected type function for handler when trying to remove an event listener.',
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
  appendChild({ child } = {}) 
  {
    if(typechecker.check({ type: 'component', value: child })) this.#element.appendChild(child.#element);
    else this.#element.appendChild(child); 
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

class Page extends Component 
{
  #errors;

  constructor(options = {}) 
  {
    super({ tagName: 'main', options: options });

    this.#errors = 
    {
      faviconTypeError: 'Page Error: Expected type string for favicon url.',
      titleTypeError: 'Page Error: Expected type string for title.'
    };

    if(options.favicon) this.favicon = options.favicon;
    if(options.title) this.title = options.title;
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
    if (!typechecker.check({ type: 'string', value })) console.error(this.#errors.titleTypeError);
    document.title = value;
  }

  /** 
   * Get property to return the current favicon URL from <head>.
   * @return {string|null} The href of the favicon link, or null if none exists.
   */
  get favicon() 
  {
    const link = document.querySelector("link[rel~='icon']");
    return link ? link.href : null;
  }

  /** 
   * Set property to change the favicon in <head>.
   * Creates a <link rel="icon"> if none exists.
   * @param {string} value - The favicon path or URL.
   */
  set favicon(value) 
  {
    if(!typechecker.check({ type: 'string', value })) console.error(this.#errors.faviconTypeError);

    let link = document.querySelector("link[rel~='icon']");
    if(!link) 
    {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    link.href = value;
  }

  /** Public method to present the page by attaching it to document.body. */
  present() 
  {
    document.body.appendChild(this.element);
  }
}

///////////////////////////////////////////////////////////

globalThis.typechecker = TypeChecker.getInstance();
globalThis.color = ColorManager.getInstance();
globalThis.ui = UserInterface.getInstance();

ui.register({ name: 'Component', constructor: Component });