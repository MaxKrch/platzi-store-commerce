const formateError = (err: unknown) => {
  if (err instanceof Error) {
    return err;
  }

  if(typeof err === 'object' && err !== null && 'message' in err && typeof err.message === 'string') {
    return new Error(err.message);
  }

  return new Error('Unknown Error');
};

export default formateError;
