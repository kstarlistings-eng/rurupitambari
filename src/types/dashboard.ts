type Stats = {
  organizations: {
    total: number;
    active: number;
    trial: number;
    suspended: number;
    expiring_soon: number;
  };
  users: {
    total: number;
  };
};

type SubscriptionOverviewItem = {
  month: string;
  total: number;
  active: number;
  trial: number;
};

type OrganizationVsUserItem = {
  month: string;
  organizations: number;
  users: number;
};

type Charts = {
  subscription_overview: SubscriptionOverviewItem[];
  organization_vs_user: OrganizationVsUserItem[];
};

export type DashboardData = {
  stats: Stats;
  charts: Charts;
};
