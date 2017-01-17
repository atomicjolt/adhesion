const defaultOnComplete = (payload, action) => ({
  type: `LISTENER_${action.url}_COMPLETE`,
  payload,
});

const defaultOnError = (payload, action) => ({
  type: `LISTENER_${action.url}_ERR`,
  payload,
});

export default function (
  url,
  params,
  predicate,
  completePredicate,
  uniqueParam = '',
  canvas,
  onComplete = defaultOnComplete,
  onError = defaultOnError,
  interval,
) {
  let updatedParams = params;
  if (canvas) {
    updatedParams = { ...updatedParams, type: canvas.type };
  }
  return {
    type: 'CREATE_ATOMIC_LISTENER',
    params: updatedParams,
    predicate,
    completePredicate,
    uniqueParam,
    onComplete,
    onError,
    interval,
    url,
  };
}
