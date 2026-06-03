
    export type RemoteKeys = 'tanstack_federation/FederatedBadge';
    type PackageType<T> = T extends 'tanstack_federation/FederatedBadge' ? typeof import('tanstack_federation/FederatedBadge') :any;