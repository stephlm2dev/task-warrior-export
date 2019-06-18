export interface Validator {
  isValid(
    value: string | any, arrayOfValues: Array<any> | any | null
  ): boolean | string | Array<string>
}
