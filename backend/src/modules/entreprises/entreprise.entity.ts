import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Opportunite } from '../opportunites/opportunite.entity';

export enum TypeEntreprise {
  PME = 'pme',
  ETI = 'eti',
  GRANDE_ENTREPRISE = 'grande_entreprise',
  TPE = 'tpe',
  ASSOCIATION = 'association',
  ORGANISME_PUBLIC = 'organisme_public',
}

@Entity('entreprises')
export class Entreprise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  raisonSociale: string;

  @Column({ unique: true })
  siret: string;

  @Column({ nullable: true })
  siren: string;

  @Column({ nullable: true })
  numeroTVA: string;

  @Column({ type: 'enum', enum: TypeEntreprise })
  type: TypeEntreprise;

  @Column({ nullable: true })
  secteurActivite: string;

  @Column({ nullable: true })
  effectif: number;

  // Adresse
  @Column()
  adresse: string;

  @Column()
  codePostal: string;

  @Column()
  ville: string;

  @Column({ nullable: true })
  pays: string;

  // Contacts
  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  siteWeb: string;

  // Contact principal
  @Column({ type: 'json', nullable: true })
  contactPrincipal: {
    nom: string;
    prenom: string;
    fonction: string;
    email: string;
    telephone: string;
  };

  // Autres contacts
  @Column({ type: 'json', nullable: true })
  autresContacts: {
    nom: string;
    prenom: string;
    fonction: string;
    email: string;
    telephone: string;
  }[];

  // Informations commerciales
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  opcoRattachement: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  // Relations
  @OneToMany(() => Opportunite, (opportunite) => opportunite.entreprise)
  opportunites: Opportunite[];

  // Synchronisation Ypareo
  @Column({ nullable: true })
  ypareoId: string;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
