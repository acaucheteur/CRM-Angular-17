import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Opportunite } from '../opportunites/opportunite.entity';
import { Formateur } from '../formateurs/formateur.entity';

@Entity('localisations')
export class Localisation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string; // Ex: AISNE, SOMME, OISE...

  @Column()
  name: string; // Ex: AFPI de l'Aisne

  @Column()
  ville: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  codePostal: string;

  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  siteWeb: string;

  @Column({ default: true })
  isActive: boolean;

  // Relations
  @OneToMany(() => User, (user) => user.localisation)
  users: User[];

  @OneToMany(() => Opportunite, (opportunite) => opportunite.localisation)
  opportunites: Opportunite[];

  @OneToMany(() => Formateur, (formateur) => formateur.localisation)
  formateurs: Formateur[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
