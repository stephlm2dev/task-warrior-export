export interface Validator {
  isValid(value: string, arrayOfValues: Array<any> | null): boolean | string
}
