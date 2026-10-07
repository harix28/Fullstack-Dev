import type { Job, JobCategory } from '@/types';
import { mockJobs } from '@/data/mockJobs';

// In-memory mutable copy so save toggles persist across calls during a session
let jobsStore: Job[] = mockJobs.map((j) => ({ ...j }));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface JobFilters {
  search?: string;
  category?: JobCategory | '';
  state?: string;
  organization?: string;
}

// ─── Jobs Service ─────────────────────────────────────────────────────────────

/**
 * Fetch all jobs, optionally filtered.
 *
 * Future: GET to API_ENDPOINTS.jobs.list with query params
 */
export const getJobs = async (filters?: JobFilters): Promise<Job[]> => {
  await delay(400);

  let results = [...jobsStore];

  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    results = results.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.organization.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (filters?.category) {
    results = results.filter((j) => j.category === filters.category);
  }

  if (filters?.state && filters.state.trim() !== '') {
    results = results.filter(
      (j) => j.state.toLowerCase() === filters.state!.toLowerCase(),
    );
  }

  if (filters?.organization && filters.organization.trim() !== '') {
    const org = filters.organization.toLowerCase();
    results = results.filter((j) =>
      j.organization.toLowerCase().includes(org),
    );
  }

  return results;
};

/**
 * Fetch top recommended jobs for the logged-in user, sorted by matchPercentage.
 *
 * Future: GET to API_ENDPOINTS.jobs.recommended
 */
export const getRecommendedJobs = async (): Promise<Job[]> => {
  await delay(400);

  return [...jobsStore]
    .sort((a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0))
    .slice(0, 5);
};

/**
 * Fetch a single job by its ID.
 * Throws if the job is not found.
 *
 * Future: GET to API_ENDPOINTS.jobs.detail(id)
 */
export const getJobById = async (id: string): Promise<Job> => {
  await delay(300);

  const job = jobsStore.find((j) => j.id === id);
  if (!job) {
    throw new Error(`Job with id "${id}" not found.`);
  }
  return { ...job };
};

/**
 * Toggle the isSaved flag for a job.
 * Returns the updated job.
 *
 * Future: POST to API_ENDPOINTS.jobs.save(id)
 */
export const saveJob = async (id: string): Promise<Job> => {
  await delay(200);

  const index = jobsStore.findIndex((j) => j.id === id);
  if (index === -1) {
    throw new Error(`Job with id "${id}" not found.`);
  }

  jobsStore[index] = {
    ...jobsStore[index],
    isSaved: !jobsStore[index].isSaved,
  };

  return { ...jobsStore[index] };
};

/**
 * Fetch all jobs that the user has saved.
 *
 * Future: GET to API_ENDPOINTS.jobs.list with saved=true param
 */
export const getSavedJobs = async (): Promise<Job[]> => {
  await delay(300);
  return jobsStore.filter((j) => j.isSaved).map((j) => ({ ...j }));
};
