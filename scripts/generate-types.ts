import { Project, SyntaxKind, Node, InterfaceDeclaration, PropertySignature } from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';

const project = new Project({
  tsConfigFilePath: 'tsconfig.base.json',
});

// Path to your schema files
const SCHEMA_DIR = 'apps/';
// Path to output models
const MODELS_DIR = 'libs/shared/src/lib/models';

// Ensure the models directory exists
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
}

// Function to convert schema property to type property
function convertPropToType(prop: any): string {
  const type = prop.type?.toLowerCase() || 'any';
  const isRequired = prop.required === true;
  const isArray = Array.isArray(type);
  
  let typeString = isArray ? `${type[0]}[]` : type;
  
  // Handle special types
  if (typeString === 'string') typeString = 'string';
  else if (typeString === 'number') typeString = 'number';
  else if (typeString === 'boolean') typeString = 'boolean';
  else if (typeString === 'date') typeString = 'Date';
  else if (typeString === 'objectid') typeString = 'string';
  
  return isRequired ? typeString : `${typeString} | null`;
}

// Function to update index.ts exports
function updateIndexExports(modelName: string) {
  const indexPath = path.join(MODELS_DIR, 'index.ts');
  const exportStatement = `export * from './${modelName.toLowerCase()}.model';\n`;
  
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, exportStatement);
    return;
  }

  const content = fs.readFileSync(indexPath, 'utf-8');
  if (!content.includes(exportStatement.trim())) {
    fs.appendFileSync(indexPath, exportStatement);
  }
}

// Function to process a schema file
function processSchemaFile(filePath: string) {
  // Skip base.schema.ts
  if (filePath.endsWith('base.schema.ts')) {
    console.log(`Skipping base schema file: ${filePath}`);
    return;
  }

  console.log(`Processing file: ${filePath}`);
  const sourceFile = project.addSourceFileAtPath(filePath);
  
  // Get all classes in the file
  const classes = sourceFile.getClasses();
  if (classes.length === 0) {
    console.log(`No classes found in file: ${filePath}`);
    return;
  }

  // Use the first class (assuming it's the main schema class)
  const schemaClass = classes[0];
  const className = schemaClass.getName();
  
  if (!className) {
    console.log(`Class has no name in file: ${filePath}`);
    return;
  }

  const typeName = `${className}Model`;
  console.log(`Found class: ${className}`);

  // Create type properties
  const properties: string[] = [];
  
  // Add base properties
  properties.push('id: string;');
  properties.push('createdAt: Date;');
  properties.push('updatedAt: Date;');
  
  // Add schema properties
  schemaClass.getProperties().forEach(prop => {
    const propName = prop.getName();
    if(propName === 'password') return;
    const decorators = prop.getDecorators();
    const propDecorator = decorators.find(d => d.getName() === 'Prop');
    
    if (propDecorator) {
      const propArgs = propDecorator.getArguments()[0];
      if (propArgs) {
        const type = convertPropToType(propArgs);
        properties.push(`${propName}: ${type};`);
      }
    }
  });

  // Create the type file
  const typeContent = `
export type ${typeName} = {
  ${properties.join('\n  ')}
}
`;

  // Write the type file
  const outputPath = path.join(MODELS_DIR, `${className.toLowerCase()}.model.ts`);
  fs.writeFileSync(outputPath, typeContent);
  console.log(`Generated type file: ${outputPath}`);

  // Update index.ts exports
  updateIndexExports(className.toLowerCase());
}

// Find all schema files recursively
function findSchemaFiles(dir: string): string[] {
  const files: string[] = [];
  
  function traverse(currentDir: string) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.schema.ts') && !item.endsWith('base.schema.ts')) {
        files.push(fullPath);
      }
    });
  }
  
  traverse(dir);
  return files;
}

// Find all schema files
const schemaFiles = findSchemaFiles(SCHEMA_DIR);
console.log('Found schema files:', schemaFiles);

// Process each schema file
schemaFiles.forEach(processSchemaFile);

// Save the project
project.saveSync(); 