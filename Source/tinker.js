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

globalThis.typechecker = TypeChecker.getInstance();