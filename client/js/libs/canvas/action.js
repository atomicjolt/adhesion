export default function(canvas, params, body, localOptions = {}){
  return {
    type: canvas.type,
    canvas,
    params,
    body,
    localOptions
  };
}
