// Local wrapper for better-auth node integration
// This is needed because better-auth/integrations/node is not exported in package.json
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import from the dist file directly
const betterCallNodePath = path.resolve(
  __dirname,
  '../../node_modules/better-auth/node_modules/better-call/dist/node.js'
);

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

