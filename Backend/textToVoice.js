const ElevenLabsClient = request('elevenlabs');
require('dotenv').config();

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_KEY,
});

import { ElevenLabsClient, stream } from 'elevenlabs';
import { Readable } from 'stream';

async function main() {
  const audioStream = await client.textToSpeech.convertAsStream('JBFqnCBsd6RMkjVDRZzb', {
    text: 'This is a test',
    model_id: 'eleven_multilingual_v2',
  });

  // option 1: play the streamed audio locally
  await stream(Readable.from(audioStream));

  // option 2: process the audio manually
  for await (const chunk of audioStream) {
    console.log(chunk);
  }
}

main();