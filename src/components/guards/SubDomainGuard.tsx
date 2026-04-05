// import { mainBaseInstance } from "@/config/axios-interceptor";
// import { domainConfig } from "@/config/domain";
// import { branchEndpoints} from "@/config/endpoints";
// import { use } from "react";

// type TenantResponse = {
//   success: boolean;
//   message: string;
//   data: {
//     id: number;
//     name: string;
//     schema_name: string;
//     created_by: number | null;
//     updated_by: number | null;
//   };
// };

// const subDomainPromise = domainConfig?.SUB_DOMAIN
//   ? mainBaseInstance.post<TenantResponse>(branchEndpoints.VALIDATE_ORGANIZATION, {
//       subdomain: domainConfig.SUB_DOMAIN,
//     })
//   : Promise.resolve({
//       success: true,
//       message: "No subdomain configured, skipping validation",
//     });

// function SubDomainGuard({ children }: { children: React.ReactNode }) {
//   const subDomainCheck = use(subDomainPromise);
//   if (!subDomainCheck?.success) {
//     return <div>Subdomain not found</div>;
//   }
//   return <div>{children}</div>;
// }

// export default SubDomainGuard;
