// The starter targets Node 22.12+. This project runs on the Node version
// installed on the machine, so accept any engine new enough for Vite 8.
export function checkNode(version = process.versions.node) {
  const [major, minor] = version.split('.').map(Number);
  const supported = major > 22 || (major === 22 && minor >= 12);
  if (!supported) {
    throw new Error(`This starter requires Node 22.12 or newer; current Node is ${version}.`);
  }
}
checkNode();
