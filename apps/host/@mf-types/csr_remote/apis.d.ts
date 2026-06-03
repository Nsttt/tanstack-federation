
    export type RemoteKeys = 'csr_remote/FederatedBadge';
    type PackageType<T> = T extends 'csr_remote/FederatedBadge' ? typeof import('csr_remote/FederatedBadge') :any;