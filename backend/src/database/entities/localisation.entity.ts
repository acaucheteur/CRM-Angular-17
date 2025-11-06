import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('localisations')
export class Localisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  nom: string;

  @Column({ length: 255, nullable: true })
  adresse: string;

  @Column({ length: 10, nullable: true })
  codePostal: string;

  @Column({ length: 100, nullable: true })
  ville: string;

  @Column({ length: 20, nullable: true })
  telephone: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ type: 'boolean', default: true })
  actif: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
