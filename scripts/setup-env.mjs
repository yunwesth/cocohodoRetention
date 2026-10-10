import { copyFile, chmod } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
for (const directory of ['', 'apps/rewards/', 'apps/website/']) {
  const source = new URL(`${directory}.env.example`, root);
  const destination = new URL(`${directory}.env.local`, root);
  try {
    // COPYFILE_EXCL preserves any existing credentials/configuration.
    await copyFile(source, destination, constants.COPYFILE_EXCL);
    await chmod(destination, 0o600);
    console.log(`Created ${directory}.env.local (values omitted)`);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    console.log(`Preserved ${directory}.env.local`);
  }
}
console.log(`Environment files are ignored by ${fileURLToPath(new URL('.gitignore', root))}.`);
