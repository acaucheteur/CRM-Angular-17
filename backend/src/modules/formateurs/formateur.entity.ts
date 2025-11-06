import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Localisation } from '../localisations/localisation.entity';

export enum StatutFormateur {
  ACTIF = 'actif',
  INACTIF = 'inactif',
  VACATAIRE = 'vacataire',
  PERMANENT = 'permanent',
}

@Entity('formateurs')
export class Formateur {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  telephone: string;

  @Column({ type: 'enum', enum: StatutFormateur, default: StatutFormateur.ACTIF })
  statut: StatutFormateur;

  // Compétences et domaines d'expertise
  @Column({ type: 'json', nullable: true })
  competences: string[];

  @Column({ type: 'json', nullable: true })
  domainesExpertise: string[];

  @Column({ type: 'json', nullable: true })
  certifications: {
    nom: string;
    organisme: string;
    dateObtention: Date;
    validite: Date;
  }[];

  // Disponibilités
  @Column({ default: true })
  disponible: boolean;

  @Column({ type: 'json', nullable: true })
  indisponibilites: {
    dateDebut: Date;
    dateFin: Date;
    raison: string;
  }[];

  // Localisation
  @ManyToOne(() => Localisation, (localisation) => localisation.formateurs)
  @JoinColumn({ name: 'localisationId' })
  localisation: Localisation;

  @Column()
  localisationId: string;

  // Informations administratives
  @Column({ nullable: true })
  numeroSiret: string;

  @Column({ nullable: true })
  tauxHoraire: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Synchronisation Ypareo
  @Column({ nullable: true })
  ypareoId: string;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get fullName(): string {
    return `${this.prenom} ${this.nom}`;
  }
}
