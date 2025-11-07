import { DataSource } from 'typeorm';
import { Role, RoleType } from '../../modules/roles/role.entity';
import {
  Permission,
  PermissionAction,
  PermissionResource,
} from '../../modules/roles/permission.entity';

export async function seedRoles(dataSource: DataSource): Promise<void> {
  console.log('🌱 Seeding roles...');

  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);

  // Define roles
  const rolesData = [
    {
      name: 'Administrateur',
      type: RoleType.ADMIN,
      description: 'Accès complet à toutes les fonctionnalités',
      level: 0,
      permissionFilter: () => true, // All permissions
    },
    {
      name: 'Responsable Commercial',
      type: RoleType.RESPONSABLE_COMMERCIAL,
      description: 'Gestion des équipes commerciales et validation des opportunités',
      level: 1,
      permissionFilter: (perm: Permission) => {
        // Can manage most resources except settings
        return perm.resource !== PermissionResource.SETTINGS;
      },
    },
    {
      name: 'Manager',
      type: RoleType.MANAGER,
      description: "Gestion d'une localisation et de son équipe",
      level: 2,
      permissionFilter: (perm: Permission) => {
        const managedResources = [
          PermissionResource.OPPORTUNITES,
          PermissionResource.ENTREPRISES,
          PermissionResource.OBJECTIFS,
          PermissionResource.DASHBOARD,
          PermissionResource.FORMATEURS,
          PermissionResource.USERS,
        ];
        return managedResources.includes(perm.resource);
      },
    },
    {
      name: 'Commercial',
      type: RoleType.COMMERCIAL,
      description: 'Gestion des opportunités commerciales',
      level: 3,
      permissionFilter: (perm: Permission) => {
        if (perm.resource === PermissionResource.OPPORTUNITES) return true;
        if (perm.resource === PermissionResource.ENTREPRISES) {
          return [PermissionAction.READ, PermissionAction.CREATE, PermissionAction.UPDATE].includes(
            perm.action,
          );
        }
        if (perm.resource === PermissionResource.DASHBOARD) {
          return perm.action === PermissionAction.READ;
        }
        return false;
      },
    },
    {
      name: 'Planificateur',
      type: RoleType.PLANIFICATEUR,
      description: 'Planification des formations et gestion des formateurs',
      level: 3,
      permissionFilter: (perm: Permission) => {
        const managedResources = [
          PermissionResource.FORMATEURS,
          PermissionResource.OPPORTUNITES,
          PermissionResource.DASHBOARD,
        ];
        if (!managedResources.includes(perm.resource)) return false;
        return [PermissionAction.READ, PermissionAction.UPDATE].includes(perm.action);
      },
    },
    {
      name: 'Assistante',
      type: RoleType.ASSISTANTE,
      description: 'Support administratif et saisie des données',
      level: 3,
      permissionFilter: (perm: Permission) => {
        const managedResources = [
          PermissionResource.ENTREPRISES,
          PermissionResource.OPPORTUNITES,
          PermissionResource.DASHBOARD,
        ];
        if (!managedResources.includes(perm.resource)) return false;
        return [PermissionAction.READ, PermissionAction.CREATE, PermissionAction.UPDATE].includes(
          perm.action,
        );
      },
    },
    {
      name: 'Facturation',
      type: RoleType.FACTURATION,
      description: 'Gestion de la facturation',
      level: 3,
      permissionFilter: (perm: Permission) => {
        const managedResources = [
          PermissionResource.OPPORTUNITES,
          PermissionResource.ENTREPRISES,
          PermissionResource.DASHBOARD,
        ];
        if (!managedResources.includes(perm.resource)) return false;
        return (
          perm.action === PermissionAction.READ ||
          (perm.resource === PermissionResource.OPPORTUNITES &&
            perm.action === PermissionAction.UPDATE)
        );
      },
    },
  ];

  // Get all permissions
  const allPermissions = await permissionRepository.find();

  // Create roles with their permissions
  for (const roleData of rolesData) {
    const exists = await roleRepository.findOne({
      where: { type: roleData.type },
      relations: ['permissions'],
    });

    // Filter permissions for this role
    const rolePermissions = allPermissions.filter(roleData.permissionFilter);

    if (!exists) {
      const role = roleRepository.create({
        name: roleData.name,
        type: roleData.type,
        description: roleData.description,
        level: roleData.level,
        permissions: rolePermissions,
      });
      await roleRepository.save(role);
      console.log(`  ✓ Created role: ${roleData.name} with ${rolePermissions.length} permissions`);
    } else {
      // Update permissions if role already exists
      exists.permissions = rolePermissions;
      await roleRepository.save(exists);
      console.log(
        `  ⊙ Role already exists: ${roleData.name}, updated with ${rolePermissions.length} permissions`,
      );
    }
  }

  console.log('✅ Roles seeding completed');
}
