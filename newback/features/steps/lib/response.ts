let lastResponse;

let lastStreamResponse;

export function setResponse(resp) {
  lastResponse = resp;
}

export function getResponse() {
  return lastResponse;
}

export function setStreamResponse(resp) {
  lastStreamResponse = resp;
}

export function getStreamResponse() {
  return lastStreamResponse;
}
