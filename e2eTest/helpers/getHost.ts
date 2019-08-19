export default function getHost() {
  if (process.env.STAGE === 'stage') {
    return 'stage.scinapse.io';
  }
  return 'scinapse.io';
}
