import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('entreprises')
export class Entreprise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nom: string;

  @Column({ length: 14, unique: true })
  siret: string;

  @Column({ length: 255, nullable: true })
  adresse: string;

  @Column({ length: 10, nullable: true })
  codePostal: string;

  @Column({ length: 100, nullable: true })
  ville: string;

  @Column({ length: 100, nullable: true })
  secteurActivite: string;

  @Column({ length: 20, nullable: true })
  telephone: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
