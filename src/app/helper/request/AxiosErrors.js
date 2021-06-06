export default class AxiosErrors {
  constructor(axiosErrorResponse) {
    try {
      let {response} = axiosErrorResponse;
      let {
        data: {errors, data, message},
        status,
      } = response;
      this.errors = errors;
      this.data = data;
      this.message = message;
      this.status = status;
    } catch (error) {
      this.errors = error;
      this.status = -1;
      this.data = null;
      this.message = null;
    }
  }
  /**
   *
   * @param {(status, errors, messagem data) => { }} handle
   */
  run = (handle = (status, errors, message, data) => {}) => {
    if (this.status == -1) {
    }
    return handle(this.status, this.errors, this.message, this.data);
  };
  /**
   *
   * @param {AxiosErrors} axiosErrorResponse
   * @returns {AxiosErrors}
   */
  static handle = axiosErrorResponse => {
    return new AxiosErrors(axiosErrorResponse);
  };

  /**
   *
   *
   * @static
   * @memberof AxiosErrors
   *
   * @param AxiosErrors axiosErrors
   * @param object objectThatCopy
   *
   * @returns objectThatCopy
   */
  static copyErrorsToStringObject = (axiosErrors, objectThatCopy) => {
    if (axiosErrors.status === 422) {
      let {errors} = axiosErrors;
      for (let key in objectThatCopy) {
        if (errors[key]) {
          objectThatCopy[key] = errors[key][0] ?? null;
        }
      }
    }

    return objectThatCopy;
  };
}
