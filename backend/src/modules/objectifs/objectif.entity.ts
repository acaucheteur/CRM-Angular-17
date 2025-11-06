import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Localisation } from '../localisations/localisation.entity';

export enum TypeObjectif {
  CHIFFRE_AFFAIRES = 'chiffre_affaires',
  NOMBRE_OPPORTUNITES = 'nombre_opportunites',
  TAUX_CONVERSION = 'taux_conversion',
  NOMBRE_FORMATIONS = 'nombre_formations',
  SATISFACTION_CLIENT = 'satisfaction_client',
  CUSTOM = 'custom',
}

export enum PeriodiciteObjectif {
  MENSUEL = 'mensuel',
  TRIMESTRIEL = 'trimestriel',
  ANNUEL = 'annuel',
}

@Entity('objectifs')
export class Objectif {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titre: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TypeObjectif })
  type: TypeObjectif;

  @Column({ type: 'enum', enum: PeriodiciteObjectif })
  periodicite: PeriodiciteObjectif;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  cible: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  realise: number;

  @Column({ nullable: true })
  unite: string; // €, nb, %, etc.

  @Column({ type: 'date' })
  dateDebut: Date;

  @Column({ type: 'date' })
  dateFin: Date;

  @Column({ default: true })
  isActif: boolean;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => Localisation, { nullable: true })
  @JoinColumn({ name: 'localisationId' })
  localisation: Localisation;

  @Column({ nullable: true })
  localisationId: string;

  // Suivi de l'avancement
  @Column({ type: 'json', nullable: true })
  historique: {
    date: Date;
    valeur: number;
    commentaire: string;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get tauxRealisation(): number {
    return this.cible > 0 ? (this.realise / this.cible) * 100 : 0;
  }

  get progression(): string {
    const taux = this.tauxRealisation;
    if (taux >= 100) return 'Objectif atteint';
    if (taux >= 75) return 'Bon progrès';
    if (taux >= 50) return 'En cours';
    if (taux >= 25) return 'Démarrage lent';
    return 'Nécessite attention';
  }
}
