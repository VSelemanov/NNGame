let lastResponse;

export function setResponse(resp) {
  lastResponse = resp;
}

export function getResponse() {
  return lastResponse;
}
