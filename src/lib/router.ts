/**
 * Hash-based Router
 *
 * Simple client-side routing using URL hash
 * Supports parameterized routes like /publication/:id
 */

type RouteHandler = (params: Record<string, string>) => void;

interface Route {
  pattern: RegExp;
  handler: RouteHandler;
}

class Router {
  private routes: Route[] = [];
  private currentPath: string = '';

  /**
   * Register a route with optional parameters
   *
   * @param pattern - Route pattern like '/publication/:id'
   * @param handler - Function called when route matches
   *
   * @example
   * router.add('/publication/:id', ({ id }) => {
   *   console.log('Viewing publication', id);
   * });
   */
  add(pattern: string, handler: RouteHandler): void {
    // Convert /publication/:id to regex with named groups
    // e.g., /publication/:id -> ^/publication/(?<id>[^/]+)$
    const regexPattern = pattern.replace(/:(\w+)/g, '(?<$1>[^/]+)');
    this.routes.push({
      pattern: new RegExp(`^${regexPattern}$`),
      handler,
    });
  }

  /**
   * Initialize the router
   * Sets up hashchange listener and handles initial route
   */
  init(): void {
    window.addEventListener('hashchange', () => this.route());
    // Handle initial route
    this.route();
  }

  /**
   * Process current hash and call matching route handler
   */
  private route(): void {
    const hash = window.location.hash.slice(1) || '/';

    // Skip if same route (prevents duplicate handling)
    if (hash === this.currentPath) return;
    this.currentPath = hash;

    for (const { pattern, handler } of this.routes) {
      const match = hash.match(pattern);
      if (match) {
        handler(match.groups || {});
        return;
      }
    }

    // 404 fallback - navigate to home
    this.navigate('/');
  }

  /**
   * Programmatically navigate to a path
   *
   * @param path - The path to navigate to
   *
   * @example
   * router.navigate('/publication/pub-1');
   */
  navigate(path: string): void {
    window.location.hash = path;
  }

  /**
   * Get the current route path
   */
  getCurrentPath(): string {
    return this.currentPath;
  }
}

export const router = new Router();
