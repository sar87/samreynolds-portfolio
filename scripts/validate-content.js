import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'data');
const schemaDir = join(dataDir, 'schemas');

const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

// Compile schemas once at startup
const schemas = {
  publication: ajv.compile(JSON.parse(readFileSync(join(schemaDir, 'publication.schema.json')))),
  talk: ajv.compile(JSON.parse(readFileSync(join(schemaDir, 'talk.schema.json')))),
  media: ajv.compile(JSON.parse(readFileSync(join(schemaDir, 'media.schema.json')))),
  research: ajv.compile(JSON.parse(readFileSync(join(schemaDir, 'research.schema.json')))),
  about: ajv.compile(JSON.parse(readFileSync(join(schemaDir, 'about.schema.json'))))
};

// Map schema names to data files
const files = {
  publication: 'publications.json',
  talk: 'talks.json',
  media: 'media.json',
  research: 'research.json',
  about: 'about.json'
};

let hasErrors = false;

console.log('Validating content files against schemas...\n');

for (const [schemaName, fileName] of Object.entries(files)) {
  const filePath = join(dataDir, fileName);

  try {
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    const validate = schemas[schemaName];
    const valid = validate(data);

    if (!valid) {
      hasErrors = true;
      // Copy errors immediately - Ajv overwrites errors property on next validation
      const errors = [...validate.errors];
      console.error(`✗ ${fileName} validation failed:`);
      errors.forEach(err => {
        console.error(`  - ${err.instancePath || '/'}: ${err.message}`);
      });
      console.error('');
    } else {
      console.log(`✓ ${fileName} valid`);
    }
  } catch (err) {
    hasErrors = true;
    console.error(`✗ ${fileName}: ${err.message}\n`);
  }
}

console.log('');
if (hasErrors) {
  console.error('Validation failed - see errors above');
  process.exit(1);
} else {
  console.log('All content files validated successfully');
  process.exit(0);
}
