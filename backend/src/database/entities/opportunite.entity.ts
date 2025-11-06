import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('opportunites')
export class Opportunite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  titre: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  entrepriseId: number;

  @Column({ nullable: true })
  utilisateurId: number;

  @Column({ nullable: true })
  localisationId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  montant: number;

  @Column({ 
    type: 'enum', 
    enum: ['nouveau', 'section1', 'section2', 'section3', 'section4', 'section5', 'section6', 'gagne', 'perdu'],
    default: 'nouveau'
  })
  statut: string;

  @Column({ type: 'int', default: 1 })
  section: number;

  @Column({ type: 'date', nullable: true })
  dateDebut: Date;

  @Column({ type: 'date', nullable: true })
  dateFin: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
