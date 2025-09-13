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
  #name;
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
      nameTypeError: 'Component Error: Expected type string for name.',
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

/** Class representing the Accordion Component. */
class Accordion extends Component
{
  #errors;
  summary;

  /**
   * Creates the accordion object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {
    super({ tagName: 'details', options: options });

    this.#errors = 
    {
      titleTypeError: 'Accordion Error: Expected type string for title.',
      textColorInvalidError: 'Accordion Error: Invalid color value provided for title color.',
      titleColorTypeError: 'Accordion Error: Expected type string for title color'
    };

    this.summary = new ui.Component({ tagName: 'summary', options: {} });
    this.addComponent({ component: this.summary });

    if(options.title) this.title = options.title;
    if(options.titleColor) this.titleColor = options.titleColor;
  }

  /**
   * Get property to get the current title of the accordion.
   * @returns {string}
   */
  get title()
  {
    return this.summary.element.textContent;
  }

  /**
   * Set property to set accordion title.
   * @param {string} value - Title of the accordion.
   */
  set title(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error('Accordion Error: Expected type string for title.');
    this.summary.element.textContent = value;
  }

  /** 
   * Get property to return the accordion's title color value.
   * @return {string} The accordion's title color value.
   */
  get titleColor() 
  {
    return this.summary.element.style.color;
  }

  /** 
   * Set property to set the accordion's title color value.
   * @param {string} value - The accordion's title color value. Will throw an error if invalid.
   */
  set titleColor(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.titleColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.textColorInvalidError);
    this.summary.element.style.color = value;
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

/** Class representing the Checkbox Component. */
class Checkbox extends Component
{
  #errors;
  #failure;
  #checked;
  #onChange;
  #success;

  /**
   * Creates the checkbox object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'input', options: options });
    this.setAttribute({ key: 'type', value: 'checkbox' });

    this.#errors = 
    {
      checkedTypeError: 'Checkbox Error: Expected type boolean for checked.',
      failureTypeError: 'Checkbox Error: Expected type boolean for failure.',
      onChangeTypeError: 'Checkbox Error: Expected type function for onChange.',
      successTypeError: 'Checkbox Error: Expected type boolean for success.'
    };

    this.checked = options.checked || false;
    if(options.failure) this.failure = options.failure;
    if(options.onChange) this.onChange = options.onChange;
    if(options.success) this.success = options.success;
  }
  
  /* Private method to emit switch changes internally. */
  #emitChange()
  {
    let event = new Event('change', { bubbles: true });
    this.element.dispatchEvent(event);
  }
  
  /**
   * Get property to return the checkbox state.
   * @return {boolean} True if checked, false otherwise.
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
    if(value == true) this.check();
    else this.uncheck();
  }
  
  /** 
   * Get property to return the failure property for the selector.
   * @return {boolean} The failure property for the selector.
   */
  get failure()
  {
    return this.#failure;
  }

  /** 
   * Set property to set the failure property of the selector.
   * @param {boolean} value - The failure property of the selector.
   */
  set failure(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) console.error(this.#errors.failureTypeError);
    if(value === true) this.setAttribute({ key: 'aria-invalid', value: String(value) });
    else this.removeAttribute({ key: 'aria-invalid' });
    this.#failure = value;
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
  
  /** 
   * Get property to return the success property for the selector.
   * @return {boolean} The failure property for the selector.
   */
  get success()
  {
    return this.#success;
  }

  /** 
   * Set property to set the success property of the selector.
   * @param {boolean} value - The success property of the selector.
   */
  set success(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) console.error(this.#errors.successTypeError);
    if(value === true) this.setAttribute({ key: 'aria-invalid', value: String(false) });
    else this.removeAttribute({ key: 'aria-invalid' });
    this.#success = value;
  }
  
  /* Public method to uncheck the checkbox. */ 
  check(tap = false)
  {
    this.setAttribute({ key: 'checked', value: '' });
    this.#checked = true;
    if(tap == false) this.#emitChange();
  }

  /* Public method to toggle the state of the  checkbox. */ 
  toggle(tap = false) 
  {
    if(this.#checked == true) this.uncheck(tap);
    else this.check(tap);
  }
  
  /* Public method to uncheck the checkbox. */ 
  uncheck(tap = false) 
  { 
    this.removeAttribute({ key: 'checked' });
    this.#checked = false;
    if(tap == false) this.#emitChange();
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

/** Class representing the FilePicker Component. */
class FilePicker extends Component
{
  #errors;
  #onUpload;

  /**
   * Creates the file picker object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'input', options: options });
    this.setAttribute({ key: 'type', value: 'file' });

    this.#errors = 
    {
      onUploadTypeError: 'File Picker error: Expected type function for onUpload.'
    };
  }

  /** 
   * Get property to return the function being called during on upload events.
   * @return {function} The function being called during on upload events.
   */
  get onUpload() 
  { 
    return this.#onUpload; 
  }

  /** 
   * Set property to set the function being called during on upload events.
   * @param {function} value - The function being called during on upload events.
   */
  set onUpload(value)
  {
    if(!typechecker.check({ type: 'function', value: value })) console.error(this.#errors.onUploadTypeError);

    if(this.#onUpload) this.removeEventListener({ event: 'change', handler: this.#onUpload });
    const handler = (event) => value(event.target.value);

    this.#onUpload = handler;
    this.addEventListener({ event: 'change', handler: handler });
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
      labelPositionTypeError : 'Form Error: Expected type string for label position.',
      labelTypeError : 'Form Error: Expected type string for label.'
    };

    this.#supportedControls = ['checkbox', 'file-picker', 'search-bar', 'selector', 'slider', 'switch', 'textfield', 'text-area'];
    this.fieldset = new ui.Component({ tagName: 'fieldset', options: {} });
    this.addComponent({ component: this.fieldset });
  }

  addControl({ control, label, labelPosition } = {})
  {
    if(!typechecker.checkMultiple({ types: this.#supportedControls, value: control })) console.error(this.#errors.controlTypeError);
    if(label)
    {
      if(!typechecker.check({ type: 'string', value: label })) console.error(this.#errors.labelTypeError);
      let controlLabel = new ui.Component({ tagName: 'label', options: {} });
      if(labelPosition)
      {
        if(!typechecker.check({ type: 'string', value: label })) console.error(this.#errors.labelPositionTypeError);
        if(labelPosition === 'top')
        {
          controlLabel.element.appendChild(document.createTextNode(' ' + label));
          controlLabel.addComponent({ component: control });
        }
        else
        {
          controlLabel.addComponent({ component: control });
          controlLabel.element.appendChild(document.createTextNode(' ' + label));
        }
      }
      else 
      {
        controlLabel.addComponent({ component: control });
        controlLabel.element.appendChild(document.createTextNode(' ' + label));
      }
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

/** Class representing the Searchbar Component. */
class Searchbar extends Component
{
  #errors;
  #maxLength;
  #onChange;
  #onTextChange;
  #placeholder;

  /**
   * Creates the section object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'input', options: options });
    this.setAttribute({ key: 'type', value: 'search' });

    this.#errors = 
    {
      caretColorInvalidError: 'Searchbar Error: Invalid color value provided for caret color.',
      caretColorTypeError: 'Searchbar Error: Expected type string for caret color.',
      maxLengthTypeError: 'Searchbar Error: Expected type number for max length.',
      onChangeTypeError: 'Searchbar Error: Expected type function for onChange.',
      onTextChangeTypeError: 'Searchbar Error: Expected type function for onTextChange.',
      placeholderTypeError: 'Searchbar Error: Expected type string for placeholder.',
      textColorInvalidError: 'Searchbar Error: Invalid color value provided for text color.',
      textColorTypeError: 'Searchbar Error: Expected type string for text color.',
      textTypeError: 'Searchbar Error: Expected type string for text.'
    };
    
    if(options.caretColor) this.caretColor = options.caretColor;
    if(options.maxLength) this.maxLength = options.maxLength;
    if(options.onChange) this.onChange = options.onChange;
    if(options.onTextChange) this.onTextChange = options.onTextChange;
    if(options.text) this.text = options.text;
    this.placeholder = options.placeholder || "Search...";
    if(options.textColor) this.textColor = options.textColor;
  }

  /** 
   * Get property to return the caret color of the search bar.
   * @return {string} The caret color of the search bar.
   */
  get caretColor() 
  { 
    return this.style.caretColor; 
  }
  
  /** 
   * Set property to set the caret color of the search bar.
   * @param {string} value - The caret color of the search bar.
   */
  set caretColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.caretColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.caretColorInvalidError);
    this.style.caretColor = value;
  }
  
  /** 
   * Get property to return the max length value of the search bar.
   * @return {number} The max length value of the search bar.
   */
  get maxLength() 
  { 
    return this.#maxLength; 
  }
  
  /** 
   * Set property to set the max length value of the search bar.
   * @param {number} value - The max length of the search bar.
   */
  set maxLength(value) 
  {
    if(!typechecker.check({ type: 'number', value: value })) console.error(this.#errors.maxLengthTypeError);
    this.setAttribute({ key: 'maxlength', value: String(value) });
    this.#maxLength = value;
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
   * @param {function} value - The function being called during on change events.
   */
  set onChange(value)
  {
    if(!typechecker.check({ type: 'function', value: value })) console.error(this.#errors.onChangeTypeError);

    if(this.#onChange) this.removeEventListener({ event: 'change', handler: this.#onChange });
    const handler = (event) => value(event.target.value);

    this.#onChange = handler;
    this.addEventListener({ event: 'change' , handler });
  }

  /** 
   * Get property to return the function being called during on text change events.
   * @return {function} The function being called during on text change events.
   */
  get onTextChange() 
  { 
    return this.#onTextChange; 
  }

  /** 
   * Set property to set the function being called during on text change events.
   * @param {function} value - The function being called during on text change events.
   */
  set onTextChange(value)
  {
    if(!typechecker.check({ type: 'function', value: value })) console.error(this.#errors.onTextChangeTypeError);

    if(this.#onTextChange) this.removeEventListener({ event: 'input', handler: this.#onTextChange });
    const handler = (event) => value(event.target.value);

    this.#onTextChange = handler;
    this.addEventListener({ event: 'input', handler: handler });
  }

  /** 
   * Get property to return the placeholder value for the search bar.
   * @return {string} The placeholder value for the search bar.
   */
  get placeholder() 
  { 
    return this.#placeholder; 
  }
  
  /** 
   * Set property to set the placeholder value of the search bar.
   * @param {string} value - The placeholder value of the search bar.
   */
  set placeholder(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.placeholderTypeError);
    this.setAttribute({ key: 'placeholder', value: value });
    this.#placeholder = value;
  }
  
  /** 
   * Get property to return the text value for the search bar.
   * @return {string} The text value for the search bar.
   */
  get text() 
  { 
    return this.element.value; 
  }

  /** 
   * Set property to set the text value of the search bar.
   * @param {string} value - The text value of the search bar.
   */
  set text(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.textTypeError);
    this.element.value = value;
  }
  
  /** 
   * Get property to return the text color of the search bar.
   * @return {string} The text color of the search bar.
   */
  get textColor() 
  { 
    return this.style.color; 
  }
  
  /** 
   * Set property to set the text color of the search bar.
   * @param {string} value - The text color of the search bar.
   */
  set textColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.textColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.textColorInvalidError);
    this.style.color = value;
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

/** Class representing the Selector Component. */
class Selector extends Component
{
  #errors;
  #failure;
  #multiple;
  #onChange;
  #options;
  #prompt;
  #required;
  #success;
  
  /**
   * Creates the selector object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'select', options: options });
    
    this.#errors = 
    {
      multipleTypeError: 'Selector Error: Expected type boolean for multiple.',
      onChangeTypeError: 'Selector Error: Expected type function for onChange.',
      optionTypeError: 'Selector Error: Expected type string for option.',
      optionsTypeError: 'Selector Error: Expected type array for options.',
      promptTypeError: 'Selector Error: Expected type string for prompt.',
      requiredTypeError: 'Selector Error: Expected type boolean for required.',
      selectedOptionTypeError: 'Selector Error: Expected type string for selected option.',
      selectedOptionNotFoundError: 'Selector Error: The desired selected option could not be found in the options array.',
    };
    
    this.#options = [];
    if(options.failure) this.failure = options.failure;
    if(options.options) this.options = options.options;
    if(options.onChange) this.onChange = options.onChange;
    if(options.selectedOption) this.selectedOption = options.selectedOption;
    if(options.success) this.success = options.success;
  }
  
  /** 
   * Get property to return the failure property for the selector.
   * @return {boolean} The failure property for the selector.
   */
  get failure()
  {
    return this.#failure;
  }

  /** 
   * Set property to set the failure property of the selector.
   * @param {boolean} value - The failure property of the selector.
   */
  set failure(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) console.error(this.#errors.failureTypeError);
    if(value === true) this.setAttribute({ key: 'aria-invalid', value: String(value) });
    else this.removeAttribute({ key: 'aria-invalid' });
    this.#failure = value;
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
   * @param {function} value - The function being called during on change events. Returns the selected option.
   */
  set onChange(value)
  {
    if(!typechecker.check({ type: 'function', value: value })) console.error(this.#errors.onChangeTypeError);
    if(this.#onChange) this.removeEventListener({ event: 'change', handler: this.#onChange });

    let handler = (event) => 
    {
      const option = event.target.value;
      value(option);
    };

    this.#onChange = handler;
    this.addEventListener({ event: 'change', handler: handler });
  }
  
  /** 
   * Get property to return options of the selector.
   * @return {array} The options of the selector.
   */
  get options() 
  { 
    return this.#options; 
  }
  
  /** 
   * Set property to set the options of the selector.
   * @param {array} value - The sequence of strings with the titles of the selector's options.
   */
  set options(value) 
  {
    if(!typechecker.check({ type: 'array', value: value })) console.error(this.#errors.optionsTypeError);
    this.element.innerHTML = '';
    this.#options = [];
    this.#options = value;
    this.#options.forEach((opt) => 
    {
      if(!typechecker.check({ type: 'string', value: opt })) console.error(this.#errors.optionTypeError);
      let optionElement = document.createElement('option');
      optionElement.textContent = opt;
      optionElement.value = opt;
      this.element.appendChild(optionElement);
    });
  }
  
  get required()
  {
    return this.#required;
  }
  
  set required(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) console.error(this.#errors.requiredTypeError);
    if(value === true) this.setAttribute({ key: 'required', value: String(value) });
    else this.removeAttribute({ key: 'required' });
    this.#required = value;
  }
  
  /** 
   * Get property to return the currently selected option of the selector.
   * @return {string} The currently selected option of the selector.
   */
  get selectedOption() 
  { 
    return this.element.value; 
  }

  /** 
   * Set property to set the selected option of the selector.
   * @param {string} value - The desired option to be selected in the selector. Throws an error if it is not in the set of current options.
   */
  set selectedOption(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.selectedOptionTypeError);
    if(!this.#options.includes(value)) console.error(this.#errors.selectedOptionNotFoundError);
    this.element.value = value;
  }
  
  /** 
   * Get property to return the success property for the selector.
   * @return {boolean} The failure property for the selector.
   */
  get success()
  {
    return this.#success;
  }

  /** 
   * Set property to set the success property of the selector.
   * @param {boolean} value - The success property of the selector.
   */
  set success(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) console.error(this.#errors.successTypeError);
    if(value === true) this.setAttribute({ key: 'aria-invalid', value: String(false) });
    else this.removeAttribute({ key: 'aria-invalid' });
    this.#success = value;
  }
}

/////////////////////////////////////////////////

/** Class representing the Slider Component. */
class Slider extends Component
{
  #errors;
  #max;
  #min;
  #step;
  #onChange;
  
  /**
   * Creates the slider object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'input', options: options });
    
    this.#errors = 
    {
      onChangeTypeError: 'Slider Error: Expected type function for onChange.',
      maxTypeError: 'Slider Error: Expected type number for max.',
      minTypeError: 'Slider Error: Expected type number for min.',
      stepTypeError: 'Slider Error: Expected type number for step.',
      valueTypeError: 'Slider Error: Expected type number for value.'
    };
    
    this.max = options.max || 100;
    this.min = options.min || 0;
    this.step = options.step || 10;

    if(options.onChange) this.onChange = options.onChange;
    if(options.value) this.value = options.value;
    
    this.setAttribute({ key: 'type', value: 'range' });
  }
  
  /** 
   * Get property to return the max value of the slider.
   * @return {number} The max value of the slider.
   */
  get max() 
  { 
    return this.#max; 
  }
  
  /** 
   * Set property to set the max value of the slider.
   * @param {number} value - The max value of the slider.
   */
  set max(value)
  {
    if(!typechecker.check({ type: 'number', value: value })) console.error(this.#errors.maxTypeError);
    this.setAttribute({ key: 'max', value: String(value) });
    this.#max = value;
  }
  
  /** 
   * Get property to return the min value of the slider.
   * @return {number} The min value of the slider.
   */
  get min() 
  { 
    return this.#min; 
  }
  
  /** 
   * Set property to set the min value of the slider.
   * @param {number} value - The min value of the slider.
   */
  set min(value)
  {
    if(!typechecker.check({ type: 'number', value: value })) console.error(this.#errors.minTypeError);
    this.setAttribute({ key: 'min', value: String(value) });
    this.#min = value;
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
   * @param {function} value - The function being called during on change events. Returns the selected option.
   */
  set onChange(value)
  {
    if(!typechecker.check({ type: 'function', value: value })) console.error(this.#errors.onChangeTypeError);
    if(this.#onChange) this.removeEventListener({ event: 'change', handler: this.#onChange });

    let handler = (event) => 
    {
      const val = event.target.value;
      value(val);
    };

    this.#onChange = handler;
    this.addEventListener({ event: 'change', handler: handler });
  }
  
  /** 
   * Get property to return the step value of the slider.
   * @return {number} The step value of the slider.
   */
  get step() 
  { 
    return this.#step; 
  }
  
  /** 
   * Set property to set the step value of the slider.
   * @param {number} value - The step value of the slider.
   */
  set step(value)
  {
    if(!typechecker.check({ type: 'number', value: value })) console.error(this.#errors.stepTypeError);
    this.setAttribute({ key: 'step', value: String(value) });
    this.#step = value;
  }
  
  /** 
   * Get property to return the current value of the slider.
   * @return {number} The current value of the slider.
   */
  get value() 
  { 
    return this.element.value; 
  }

  /** 
   * Set property to set the current value of the slider.
   * @param {number} value - The current value of the slider.
   */
  set value(value) 
  { 
    if(!typechecker.check({ type: 'number', value: value })) console.error(this.#errors.valueTypeError);
    this.element.value = String(value); 
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
    let event = new Event('change', { bubbles: true });
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

/////////////////////////////////////////////////

/** Class representing the TextArea Component. */
class TextArea extends Component
{
  #caretColor;
  #errors;
  #failure;
  #maxLength;
  #onChange;
  #onTextChange;
  #placeholder;
  #resizable;
  #success;

  /**
   * Creates the text area object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {
    super({ tagName: 'textarea', options: options });

    this.#errors = 
    {
      caretColorInvalidError: 'TextArea Error: Invalid color value provided for caretColor.',
      caretColorTypeError: 'TextArea Error: Expected type string for caretColor.',
      failureTypeError: 'TextArea Error: Expected type boolean for failure.',
      maxLengthTypeError: 'TextArea Error: Expected type number for maxLength.',
      onChangeTypeError: 'TextArea Error: Expected type function for onChange.',
      onTextChangeTypeError: 'TextArea Error: Expected type function for onTextChange.',
      placeholderTypeError: 'TextArea Error: Expected type string for placeholder.',
      resizableTypeError: 'TextArea Error: Expected boolean value for resizable.',
      successTypeError: 'TextArea Error: Expected type boolean for success.',
      textColorInvalidError: 'TextArea Error: Invalid color value provided for textColor.',
      textColorTypeError: 'TextArea Error: Expected type string for textColor.',
      textTypeError: 'TextArea Error: Expected type string for text.'
    };

    if(options.caretColor) this.caretColor = options.caretColor;
    if(options.maxLength) this.maxLength = options.maxLength;
    if(options.onChange) this.onChange = options.onChange;
    if(options.onTextChange) this.onTextChange = options.onTextChange;
    if(options.placeholder) this.placeholder = options.placeholder;
    this.resizable = options.resizable || false;
    if(options.text) this.text = options.text;
    if(options.textColor) this.textColor = options.textColor;
  }

  /** 
   * Get property to return the caret color of the text area.
   * @return {string} The caret color of the text area.
   */
  get caretColor() 
  { 
    return this.#caretColor; 
  }
  
  /** 
   * Set property to set the caret color of the text area.
   * @param {string} value - The caret color of the text area.
   */
  set caretColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.caretColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.caretColorInvalidError);
    this.style.caretColor = value;
  }

  /** 
   * Get property to return the failure property for the textarea.
   * @return {boolean} The failure property for the textarea.
   */
  get failure()
  {
    return this.#failure;
  }

  /** 
   * Set property to set the failure property of the textarea.
   * @param {boolean} value - The failure property of the textarea.
   */
  set failure(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) console.error(this.#errors.failureTypeError);
    if(value === true) this.setAttribute({ key: 'aria-invalid', value: String(value) });
    else this.removeAttribute({ key: 'aria-invalid' });
    this.#failure = value;
  }

  /** 
   * Get property to return the max character length for the text area.
   * @return {number} The max character length for the text area.
   */
  get maxLength() 
  { 
    return this.#maxLength; 
  }
  
  /** 
   * Set property to set the max character length for the text area.
   * @param {number} value - The max character length for the text area.
   */
  set maxLength(value) 
  {
    if(!typechecker.check({ type: 'number', value: value })) console.error(this.#errors.maxLengthTypeError);
    this.setAttribute({ key: 'maxlength', value: String(value) });
    this.#maxLength = value;
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
   * @param {function} value - The function being called during on change events.
   */
  set onChange(value)
  {
    if(!typechecker.check({ type: 'function', value: value })) console.error(this.#errors.onChangeTypeError);

    if(this.#onChange) this.removeEventListener({ event: 'change', handler: this.#onChange });
    const handler = (event) => value(event.target.value);

    this.#onChange = handler;
    this.addEventListener({ event: 'change', handler: handler });
  }

  /** 
   * Get property to return the function being called during on text change events.
   * @return {function} The function being called during on text change events.
   */
  get onTextChange() 
  { 
    return this.#onTextChange; 
  }

  /** 
   * Set property to set the function being called during on text change events.
   * @param {function} value - The function being called during on text change events.
   */
  set onTextChange(value)
  {
    if(!typechecker.check({ type: 'function', value: value })) console.error(this.#errors.onTextChangeTypeError);

    if(this.#onTextChange) this.removeEventListener({ event: 'input', handler: this.#onTextChange });
    const handler = (event) => value(event.target.value);

    this.#onTextChange = handler;
    this.addEventListener({ event: 'input', handler: handler });
  }
  
  /** 
   * Get property to return the placeholder value for the text area.
   * @return {string} The placeholder value for the text area.
   */
  get placeholder() 
  { 
    return this.#placeholder; 
  }
  
  /** 
   * Set property to set the placeholder value of the text area.
   * @param {string} value - The placeholder value of the text area.
   */
  set placeholder(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.placeholderTypeError);
    this.setAttribute({ key: 'placeholder', value: value });
    this.#placeholder = value;  
  }

  /** 
   * Get property to return whether the textarea is resizable.
   * @return {boolean} Whether the textarea is resizable.
   */
  get resizable() 
  {
    return this.#resizable;
  }

  /** 
   * Set property to control whether the textarea is resizable.
   * @param {boolean} value - True to make it resizable, false to disable resizing.
   */
  set resizable(value) 
  {
    if(!typechecker.check({ type: 'boolean', value })) console.error(this.#errors.resizableTypeError); 
    this.style.resize = value ? 'both' : 'none';
    this.#resizable = value;
  }

  /** 
   * Get property to return the success property for the textarea.
   * @return {boolean} The failure property for the textarea.
   */
  get success()
  {
    return this.#success;
  }

  /** 
   * Set property to set the failure property of the textarea.
   * @param {boolean} value - The failure property of the textarea.
   */
  set success(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) console.error(this.#errors.successTypeError);
    if(value === true) this.setAttribute({ key: 'aria-invalid', value: String(false) });
    else this.removeAttribute({ key: 'aria-invalid' });
    this.#success = value;
  }

  /** 
   * Get property to return the text value for the text area.
   * @return {string} The text value for the text area.
   */
  get text() 
  { 
    return this.element.value; 
  }

  /** 
   * Set property to set the text value of the text area.
   * @param {string} value - The text value of the text area.
   */
  set text(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.textTypeError);
    this.element.value = value;
  }
  
  /** 
   * Get property to return the text color of the text area.
   * @return {string} The text color of the text area.
   */
  get textColor() 
  { 
    return this.style.color;
  }
  
  /** 
   * Set property to set the text color of the text area.
   * @param {string} value - The text color of the text area.
   */
  set textColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.textColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.textColorInvalidError);
    this.style.color = value;
  }
}

/////////////////////////////////////////////////

/** Class representing the Textfield Component. */
class Textfield extends Component
{
  #caretColor;
  #errors;
  #failure;
  #maxLength;
  #onChange;
  #onTextChange;
  #placeholder;
  #success;
  #type;
  #validTypes;

  /**
   * Creates the textfield object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'input', options: options });

    this.#validTypes = 
    {
      email: 'email',
      number: 'number',
      password: 'password',
      tel: 'tel',
      text: 'text',
      url: 'url'
    };

    this.#errors = 
    {
      caretColorInvalidError: 'Textfield Error: Invalid color value provided for caretColor.',
      caretColorTypeError: 'Textfield Error: Expected type string for caretColor.',
      failureTypeError: 'Textfield Error: Expected type boolean for failure.',
      maxLengthTypeError: 'Textfield Error: Expected type number for maxLength.',
      onChangeTypeError: 'Textfield Error: Expected type function for onChange.',
      onTextChangeTypeError: 'Textfield Error: Expected type function for onTextChange.',
      placeholderTypeError: 'Textfield Error: Expected type string for placeholder.',
      successTypeError: 'Textfield Error: Expected type boolean for success.',
      textColorInvalidError: 'Textfield Error: Invalid color value provided for textColor.',
      textColorTypeError: 'Textfield Error: Expected type string for textColor.',
      textTypeError: 'Textfield Error: Expected type string for text.',
      typeInvalidError: 'Textfield Error: Invalid value provided for type.',
      typeTypeError: 'Textfield Error: Expected type string for type.',
    };

    if(options.caretColor) this.caretColor = options.caretColor;
    if(options.failure) this.failure = options.failure;
    if(options.maxLength) this.maxLength = options.maxLength;
    if(options.onChange) this.onChange = options.onChange;
    if(options.onTextChange) this.onTextChange = options.onTextChange;
    if(options.placeholder) this.placeholder = options.placeholder;
    if(options.success) this.success = options.success;
    if(options.text) this.text = options.text;
    if(options.textColor) this.textColor = options.textColor;
    this.type = options.type || 'text';
  }

  /** 
   * Get property to return the caret color of the textfield.
   * @return {string} The caret color of the textfield.
   */
  get caretColor() 
  { 
    return this.#caretColor; 
  }
  
  /** 
   * Set property to set the caret color of the textfield.
   * @param {string} value - The caret color of the textfield.
   */
  set caretColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.caretColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.caretColorInvalidError); 
    this.style.caretColor = value;
  }

  /** 
   * Get property to return the failure property for the textfield.
   * @return {boolean} The failure property for the textfield.
   */
  get failure()
  {
    return this.#failure;
  }

  /** 
   * Set property to set the failure property of the textfield.
   * @param {boolean} value - The failure property of the textfield.
   */
  set failure(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) console.error(this.#errors.failureTypeError);
    if(value === true) this.setAttribute({ key: 'aria-invalid', value: String(value) });
    else this.removeAttribute({ key: 'aria-invalid' });
    this.#failure = value;
  }

  /** 
   * Get property to return the max character length for the textfield.
   * @return {number} The max character length for the textfield.
   */
  get maxLength() 
  { 
    return this.#maxLength; 
  }
  
  /** 
   * Set property to set the max character length for the textfield.
   * @param {number} value - The max character length for the textfield.
   */
  set maxLength(value) 
  {
    if(!typechecker.check({ type: 'number', value: value })) console.error(this.#errors.maxLengthTypeError);
    this.setAttribute({ key: 'maxlength', value: String(value) });
    this.#maxLength = value;
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
   * @param {function} value - The function being called during on change events.
   */
  set onChange(value)
  {
    if(!typechecker.check({ type: 'function', value: value })) console.error(this.#errors.onChangeTypeError);

    if(this.#onChange) this.removeEventListener({ event: 'change', handler: this.#onChange });
    const handler = (event) => value(event.target.value);

    this.#onChange = handler;
    this.addEventListener({ event: 'change', handler: handler });
  }

  /** 
   * Get property to return the function being called during on text change events.
   * @return {function} The function being called during on text change events.
   */
  get onTextChange() 
  { 
    return this.#onTextChange; 
  }

  /** 
   * Set property to set the function being called during on text change events.
   * @param {function} value - The function being called during on text change events.
   */
  set onTextChange(value)
  {
    if(!typechecker.check({ type: 'function', value: value })) console.error(this.#errors.onTextChangeTypeError);

    if(this.#onTextChange) this.removeEventListener({ event: 'input', handler: this.#onTextChange });
    const handler = (event) => value(event.target.value);

    this.#onTextChange = handler;
    this.addEventListener({ event: 'input', handler: handler });
  }

  /** 
   * Get property to return the placeholder value for the textfield.
   * @return {string} The placeholder value for the textfield.
   */
  get placeholder() 
  { 
    return this.#placeholder; 
  }
  
  /** 
   * Set property to set the placeholder value of the textfield.
   * @param {string} value - The placeholder value of the textfield.
   */
  set placeholder(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.placeholderTypeError);
    this.setAttribute({ key: 'placeholder', value: value });
    this.#placeholder = value;  
  }

  /** 
   * Get property to return the success property for the textfield.
   * @return {boolean} The failure property for the textfield.
   */
  get success()
  {
    return this.#success;
  }

  /** 
   * Set property to set the failure property of the textfield.
   * @param {boolean} value - The failure property of the textfield.
   */
  set success(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) console.error(this.#errors.successTypeError);
    if(value === true) this.setAttribute({ key: 'aria-invalid', value: String(false) });
    else this.removeAttribute({ key: 'aria-invalid' });
    this.#success = value;
  }

  /** 
   * Get property to return the text value for the textfield.
   * @return {string} The text value for the textfield.
   */
  get text() 
  { 
    return this.element.value; 
  }
  
  /** 
   * Set property to set the text value of the textfield.
   * @param {string} value - The text value of the textfield.
   */
  set text(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.textTypeError);
    this.element.value = value;
  }

  /** 
   * Get property to return the text color of the textfield.
   * @return {string} The text color of the textfield.
   */
  get textColor() 
  { 
    return this.style.color;
  }
  
  /** 
   * Set property to set the text color of the textfield
   * @param {string} value - The text color of the textfield.
   */
  set textColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.textColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.textColorInvalidError);
    this.style.color = value;
  }

  /** 
   * Get property to return the type of the textfield.
   * @return {string} The type of the textfield. 
   */
  get type() 
  { 
    return this.#type; 
  }

  /** 
   * Set property to set the type of the textfield
   * @param {string} value - The type of the textfield.
   */
  set type(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.typeTypeError);
    if(!Object.values(this.#validTypes).includes(value)) console.error(this.#errors.typeInvalidError);
    this.setAttribute({ key: 'type', value: value });
    this.#type = value;
  }
}

///////////////////////////////////////////////////////////

globalThis.typechecker = TypeChecker.getInstance();
globalThis.color = ColorManager.getInstance();
globalThis.ui = UserInterface.getInstance();

typechecker.register({ name: 'accordion', constructor: Accordion });
typechecker.register({ name: 'blockquote', constructor: Blockquote });
typechecker.register({ name: 'button', constructor: Button });
typechecker.register({ name: 'card', constructor: Card });
typechecker.register({ name: 'checkbox', constructor: Checkbox });
typechecker.register({ name: 'column', constructor: Column });
typechecker.register({ name: 'component', constructor: Component });
typechecker.register({ name: 'divider', constructor: Divider });
typechecker.register({ name: 'file-picker', constructor: FilePicker });
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
typechecker.register({ name: 'search-bar', constructor: Searchbar });
typechecker.register({ name: 'section', constructor: Section });
typechecker.register({ name: 'selector', constructor: Selector });
typechecker.register({ name: 'slider', constructor: Slider });
typechecker.register({ name: 'switch', constructor: Switch });
typechecker.register({ name: 'table', constructor: Table });
typechecker.register({ name: 'table-cell', constructor: TableCell });
typechecker.register({ name: 'table-row', constructor: TableRow });
typechecker.register({ name: 'text-area', constructor: TextArea });
typechecker.register({ name: 'textfield', constructor: Textfield });

ui.register({ name: 'Accordion', constructor: Accordion });
ui.register({ name: 'Blockquote', constructor: Blockquote });
ui.register({ name: 'Button', constructor: Button });
ui.register({ name: 'Card', constructor: Card });
ui.register({ name: 'Checkbox', constructor: Checkbox });
ui.register({ name: 'Column', constructor: Column });
ui.register({ name: 'Component', constructor: Component });
ui.register({ name: 'Divider', constructor: Divider });
ui.register({ name: 'FilePicker', constructor: FilePicker });
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
ui.register({ name: 'Searchbar', constructor: Searchbar });
ui.register({ name: 'Section', constructor: Section });
ui.register({ name: 'Selector', constructor: Selector });
ui.register({ name: 'Slider', constructor: Slider });
ui.register({ name: 'Switch', constructor: Switch });
ui.register({ name: 'Table', constructor: Table });
ui.register({ name: 'TableCell', constructor: TableCell });
ui.register({ name: 'TableRow', constructor: TableRow });
ui.register({ name: 'TextArea', constructor: TextArea });
ui.register({ name: 'Textfield', constructor: Textfield });