let lastResponse;

let lastSocketResponse;

export function setResponse(resp) {
  lastResponse = resp;
}

export function getResponse() {
  return lastResponse;
}

export function setSocketResponse(resp) {
  lastSocketResponse = resp;
}

export function getSocketResponse() {
  return lastSocketResponse;
}
