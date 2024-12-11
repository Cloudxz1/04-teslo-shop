import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles.interface';

export const META_ROLES = 'roles';

export const RoleProtectedTs = (...args: ValidRoles[]) => {

    return SetMetadata(META_ROLES,args);
}
