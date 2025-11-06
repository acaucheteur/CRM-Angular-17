import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ypareo_config')
export class YpareoConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  apiUrl: string;

  @Column({ length: 255 })
  apiKey: string;

  @Column({ type: 'int', default: 3600 })
  syncFrequency: number;

  @Column({ 
    type: 'enum', 
    enum: ['read', 'write', 'read_write'],
    default: 'read'
  })
  syncMode: string;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;

  @Column({ type: 'datetime', nullable: true })
  lastSync: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
