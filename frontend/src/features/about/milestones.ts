/** TODO: owner to supply real data. The milestones timeline renders nothing while this array is empty. */
export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export const ABOUT_MILESTONES: readonly Milestone[] = [];
