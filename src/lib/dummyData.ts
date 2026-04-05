import type { Organization } from "@/types/user";

export const dummyOrganizations: any[] = [
  {
    id: '1',
    name: 'Acme Corp',
    slug: 'acme-corp',
    status: 'Active',
    planType: 'Enterprise',
    trialDays: null,
    admin: {
      name: 'John Doe',
      email: 'john@acme.com',
    },
  },
  {
    id: '2',
    name: 'Globex Inc',
    slug: 'globex-inc',
    status: 'Trial',
    planType: 'Trial',
    trialDays: 'Dec 31, 2025',
    admin: {
      name: 'Jane Smith',
      email: 'jane@globex.com',
    },
  },
  {
    id: '3',
    name: 'Initech LLC',
    slug: 'initech-llc',
    status: 'Inactive',
    planType: 'Basic',
    trialDays: null,
    admin: {
      name: 'Bill Lumbergh',
      email: 'bill@initech.com',
    },
  },
  {
    id: '4',
    name: 'Umbrella Ltd',
    slug: 'umbrella-ltd',
    status: 'Suspended',
    planType: 'Premium',
    trialDays: null,
    admin: {
      name: 'Albert Wesker',
      email: 'wesker@umbrella.com',
    },
  },
  {
    id: '5',
    name: 'Stark Industries',
    slug: 'stark-industries',
    status: 'Active',
    planType: 'Free',
    trialDays: 'Jan 15, 2026',
    admin: {
      name: 'Tony Stark',
      email: 'tony@stark.com',
    },
  },
]