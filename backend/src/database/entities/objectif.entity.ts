import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('objectifs')
export class Objectif {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  titre: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  utilisateurId: number;

  @Column({ nullable: true })
  localisationId: number;

  @Column({
    type: 'enum',
    enum: ['ca', 'nb_opportunites', 'taux_conversion'],
    default: 'ca',
  })
  typeObjectif: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cible: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  realise: number;

  @Column({ type: 'date' })
  dateDebut: Date;

  @Column({ type: 'date' })
  dateFin: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
