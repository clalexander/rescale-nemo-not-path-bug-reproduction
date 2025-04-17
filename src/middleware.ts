import { createNEMO } from '@rescale/nemo';
import { NextRequest } from 'next/server';

const middlewares = {
  // ERROR
  '/:path(!api)': () => console.log('Middleware for path except /api (FAILS!)'),
  '/:path*(!api)': () => console.log('Middleware for all paths except /api/* (FAILS!)'),
  '/(!api)': () => console.log('Middleware for path except /api (FAILS, though doesn\'t seem to be part of NEMO API)'),

  // workarounds
  '/:path((?!api)\\w+)': () => console.log('[WORKAROUND A] Middleware for path except /api (works)'),
  // works but resulting regex is large
  '/:path((?!api)\\w+)/:subpath*': () => console.log('[WORKAROUND B] Middleware for all paths except /api/* (works)'),
  
  // additional ERROR: incorrectly matches /api/*
  '/:path*((?!api)\\w+)': () => console.log('Middleware for all paths except /api/* (FAILS!)'),
  
  '/:path*': [
    () => console.log('Middleware for all paths'),

    // WORKAROUND Our current workaround for "all paths including root but except /api/*"
    (request: NextRequest) => {
      if (!request.nextUrl.pathname.startsWith('/api')) {
        console.log('[WORKAOUND C] Middleware for all paths except /api/* (works, but hacky)');
      }
    },
  ],
};

export const middleware = createNEMO(middlewares);

export const config = {
  matcher: '/((?!_next|public|.*\\.).*)',
};
