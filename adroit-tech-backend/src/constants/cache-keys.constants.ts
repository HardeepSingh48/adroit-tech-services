export const CACHE_KEYS = {
  JOBS_LIST: (filterHash: string) => `jobs:list:${filterHash}`,
  JOB_DETAIL: (id: string) => `job:${id}`,
  JOBS_FEATURED: 'jobs:featured',
  PLATFORM_STATS: 'stats:platform',
  EMPLOYER_STATS: (id: string) => `stats:employer:${id}`,
} as const;
