// Its own module so tests can stand in for the page navigation.
export function openMailto(email: string) {
  window.location.assign(`mailto:${email}`);
}
