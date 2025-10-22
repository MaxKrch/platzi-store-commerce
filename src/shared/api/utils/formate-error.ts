const formateError = (err: unknown) => {
  if (err instanceof Error) {
    return err;
  }

  return new Error('Unknown Error');
};

export default formateError;
