import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Permission } from './permission.entity';

export enum RoleType {
  ADMIN = 'administrateur',
  RESPONSABLE_COMMERCIAL = 'responsable_commercial',
  MANAGER = 'manager',
  COMMERCIAL = 'commercial',
  PLANIFICATEUR = 'planificateur',
  ASSISTANTE = 'assistante',
  FACTURATION = 'facturation',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'enum', enum: RoleType, unique: true })
  type: RoleType;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  level: number; // Hiérarchie : 0 = Admin, 1 = Responsable Commercial, 2 = Manager, 3 = Autres

  @Column({ default: true })
  isActive: boolean;

  // Relations
  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    eager: true,
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
