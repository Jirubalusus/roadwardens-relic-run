import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const promptsPath = resolve(root, 'assets/gpt-image-2/prompts.json');
const prompts = JSON.parse(await readFile(promptsPath, 'utf8'));
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.GPT_IMAGE_MODEL || 'gpt-image-2';

if (!apiKey) {
  console.error('OPENAI_API_KEY is required to generate assets.');
  process.exit(1);
}

for (const item of prompts) {
  const body = {
    model,
    prompt: item.prompt,
    size: item.size || '1024x1024',
    quality: item.quality || 'high',
    background: item.background || 'transparent',
    output_format: item.output_format || 'png',
  };

  if (item.output_compression !== undefined) {
    body.output_compression = item.output_compression;
  }

  console.log(`Generating ${item.id} -> ${item.output}`);
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Image generation failed for ${item.id}: ${response.status} ${detail}`);
  }

  const json = await response.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error(`Image generation for ${item.id} did not return b64_json.`);
  }

  const outputPath = resolve(root, item.output);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, Buffer.from(b64, 'base64'));
}

console.log(`Generated ${prompts.length} asset(s) with ${model}.`);
