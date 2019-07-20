export function updateOneState(nameState: string, param: any) {
  return {
    type: 'updateOneState',
    payload: param,
    payload_state: nameState
  };
}
