import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Role } from './role.entity';

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  VALIDATE = 'validate',
  EXPORT = 'export',
  MANAGE = 'manage',
}

export enum PermissionResource {
  USERS = 'users',
  ROLES = 'roles',
  ENTREPRISES = 'entreprises',
  OPPORTUNITES = 'opportunites',
  OBJECTIFS = 'objectifs',
  DASHBOARD = 'dashboard',
  LOCALISATIONS = 'localisations',
  FORMATEURS = 'formateurs',
  YPAREO = 'ypareo',
  PLUGINS = 'plugins',
  SETTINGS = 'settings',
}

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'enum', enum: PermissionAction })
  action: PermissionAction;

  @Column({ type: 'enum', enum: PermissionResource })
  resource: PermissionResource;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get fullPermission(): string {
    return `${this.action}:${this.resource}`;
  }
}
