// Local wrapper for better-auth node integration
// This is needed because better-auth/integrations/node is not exported in package.json
import path from 'path';

// Calculate path to better-call node module
// Using process.cwd() to get project root (works in both dev and production)
// At runtime in CommonJS, __dirname will be available, but for TypeScript compilation
// we use a relative path from the project root
const getBetterCallPath = (): string => {
  // Try to use __dirname at runtime (available in CommonJS)
  // @ts-ignore - __dirname is available in CommonJS but TypeScript doesn't recognize it
  if (typeof __dirname !== 'undefined') {
    // @ts-ignore
    return path.resolve(__dirname, '../../node_modules/better-auth/node_modules/better-call/dist/node.js');
  }
  // Fallback to process.cwd() (project root)
  return path.resolve(process.cwd(), 'node_modules/better-auth/node_modules/better-call/dist/node.js');
};

const betterCallNodePath = getBetterCallPath();

let toNodeHandlerImpl: any;

// Dynamic import
async function loadHandler() {
  if (!toNodeHandlerImpl) {
    const module = await import(betterCallNodePath);
    toNodeHandlerImpl = module.toNodeHandler;
  }
  return toNodeHandlerImpl;
}

export async function toNodeHandler(auth: any) {
  const handlerFn = await loadHandler();
  // Check if auth has a handler property, otherwise use auth directly
  const handler = 'handler' in auth ? auth.handler : auth;
  return handlerFn(handler);
}

