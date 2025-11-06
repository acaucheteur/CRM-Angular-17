import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('dashboard_stats')
export class DashboardStat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  utilisateurId: number;

  @Column({ nullable: true })
  localisationId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  ca: number;

  @Column({ type: 'int', default: 0 })
  nbOpportunites: number;

  @Column({ type: 'int', default: 0 })
  nbOpportunitesGagnees: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  tauxConversion: number;

  @CreateDateColumn()
  createdAt: Date;
}
