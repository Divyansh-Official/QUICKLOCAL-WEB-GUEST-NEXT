import type { NextConfig } from 'next';

/**
 * Nothing to configure.
 *
 * The site reads only from JSON committed beside the components, so there are
 * no remote image hosts to allow, no rewrites and no environment to thread
 * through. That is the point of it: the whole thing renders without a backend.
 */
const nextConfig: NextConfig = {};

export default nextConfig;
