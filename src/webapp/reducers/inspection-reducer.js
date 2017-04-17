export default function inspectionReducer(state = {}, {type, payload}) {
  switch (type) {
  case 'INSPECTION_LOCATION':
    return {
      path: payload.path,
      id: payload.id
    };
  default:
    return state;
  }
}
