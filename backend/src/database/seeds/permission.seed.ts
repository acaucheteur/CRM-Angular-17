import { DataSource } from 'typeorm';
import {
  Permission,
  PermissionAction,
  PermissionResource,
} from '../../modules/roles/permission.entity';

export async function seedPermissions(dataSource: DataSource): Promise<void> {
  console.log('🌱 Seeding permissions...');

  const permissionRepository = dataSource.getRepository(Permission);

  // Define all permission combinations
  const permissionsData: Partial<Permission>[] = [];

  // Generate permissions for each resource and action combination
  const resources = Object.values(PermissionResource);
  const actions = Object.values(PermissionAction);

  for (const resource of resources) {
    for (const action of actions) {
      permissionsData.push({
        name: `${action}_${resource}`,
        action: action,
        resource: resource,
        description: `Permission to ${action} ${resource}`,
      });
    }
  }

  // Insert permissions if they don't exist
  for (const permData of permissionsData) {
    const exists = await permissionRepository.findOne({
      where: { name: permData.name },
    });

    if (!exists) {
      const permission = permissionRepository.create(permData);
      await permissionRepository.save(permission);
      console.log(`  ✓ Created permission: ${permData.name}`);
    } else {
      console.log(`  ⊙ Permission already exists: ${permData.name}`);
    }
  }

  console.log('✅ Permissions seeding completed');
}
