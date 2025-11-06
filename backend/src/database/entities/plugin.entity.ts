import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('plugins')
export class Plugin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  nom: string;

  @Column({ length: 50 })
  version: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  enabled: boolean;

  @Column({ type: 'json', nullable: true })
  config: any;

  @Column({ type: 'simple-array', nullable: true })
  hooks: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
