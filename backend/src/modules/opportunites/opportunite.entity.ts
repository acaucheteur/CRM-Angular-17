import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Entreprise } from '../entreprises/entreprise.entity';
import { Localisation } from '../localisations/localisation.entity';

export enum OpportuniteStatut {
  // SECTION 1 : COLLECTE D'INFORMATIONS (Commercial)
  EN_COURS_COLLECTE = 'en_cours_collecte',
  EN_ATTENTE_VALIDATION_RESP = 'en_attente_validation_resp',

  // SECTION 2 : DEVIS (Responsable)
  EN_COURS_DEVIS = 'en_cours_devis',
  DEVIS_ENVOYE = 'devis_envoye',
  DEVIS_ACCEPTE = 'devis_accepte',
  DEVIS_REFUSE = 'devis_refuse',

  // SECTION 3 : MONTAGE ADMINISTRATIF (Assistante)
  EN_COURS_MONTAGE = 'en_cours_montage',
  EN_ATTENTE_FINANCEMENT = 'en_attente_financement',
  FINANCEMENT_VALIDE = 'financement_valide',

  // SECTION 4 : PLANIFICATION (Planificateur)
  EN_COURS_PLANIFICATION = 'en_cours_planification',
  PLANIFIE = 'planifie',

  // SECTION 5 : DOCUMENTS ADMINISTRATIFS (Assistante)
  EN_COURS_DOCUMENTS = 'en_cours_documents',
  PRET_FORMATION = 'pret_formation',

  // SECTION 6 : FACTURATION
  EN_COURS_FACTURATION = 'en_cours_facturation',
  FACTURE = 'facture',
  PAYE = 'paye',
  TERMINE = 'termine',

  // Statuts spéciaux
  ANNULE = 'annule',
  EN_ATTENTE = 'en_attente',
}

export enum TypeFormation {
  INTER_ENTREPRISE = 'inter_entreprise',
  INTRA_ENTREPRISE = 'intra_entreprise',
  INDIVIDUELLE = 'individuelle',
  ALTERNANCE = 'alternance',
}

export enum ModePaiement {
  VIREMENT = 'virement',
  CHEQUE = 'cheque',
  CARTE_BANCAIRE = 'carte_bancaire',
  PRELEVEMENT = 'prelevement',
  OPCO = 'opco',
}

@Entity('opportunites')
export class Opportunite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Informations générales
  @Column({ unique: true })
  numeroOpportunite: string; // Auto-généré : OPP-2024-00001

  @Column()
  titre: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: OpportuniteStatut, default: OpportuniteStatut.EN_COURS_COLLECTE })
  statut: OpportuniteStatut;

  @Column({ type: 'enum', enum: TypeFormation })
  typeFormation: TypeFormation;

  // Relations
  @ManyToOne(() => Entreprise, (entreprise) => entreprise.opportunites)
  @JoinColumn({ name: 'entrepriseId' })
  entreprise: Entreprise;

  @Column()
  entrepriseId: string;

  @ManyToOne(() => Localisation, (localisation) => localisation.opportunites)
  @JoinColumn({ name: 'localisationId' })
  localisation: Localisation;

  @Column()
  localisationId: string;

  @ManyToOne(() => User, (user) => user.opportunites)
  @JoinColumn({ name: 'commercialId' })
  commercial: User;

  @Column()
  commercialId: string;

  // SECTION 1 : COLLECTE D'INFORMATIONS (Commercial)
  @Column({ type: 'json', nullable: true })
  contactsEntreprise: {
    nom: string;
    prenom: string;
    fonction: string;
    email: string;
    telephone: string;
  }[];

  @Column()
  intituleFormation: string;

  @Column({ type: 'text', nullable: true })
  objectifsFormation: string;

  @Column({ type: 'int', nullable: true })
  nombreParticipants: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  budgetEstime: number;

  @Column({ type: 'date', nullable: true })
  dateDebutSouhaitee: Date;

  @Column({ type: 'date', nullable: true })
  dateFinSouhaitee: Date;

  @Column({ nullable: true })
  lieuFormation: string;

  @Column({ type: 'json', nullable: true })
  prerequisParticipants: string[];

  @Column({ type: 'text', nullable: true })
  remarquesComplementaires: string;

  @Column({ default: false })
  validationResponsable: boolean;

  @Column({ nullable: true })
  validationResponsableBy: string;

  @Column({ type: 'timestamp', nullable: true })
  validationResponsableAt: Date;

  // SECTION 2 : DEVIS (Responsable)
  @Column({ nullable: true })
  numeroDevis: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  montantDevis: number;

  @Column({ type: 'date', nullable: true })
  dateEnvoiDevis: Date;

  @Column({ type: 'date', nullable: true })
  dateValiditeDevis: Date;

  @Column({ type: 'text', nullable: true })
  conditionsParticulieres: string;

  @Column({ type: 'date', nullable: true })
  dateAcceptationDevis: Date;

  @Column({ nullable: true })
  documentDevisSigne: string; // Path to file

  // SECTION 3 : MONTAGE ADMINISTRATIF (Assistante)
  @Column({ nullable: true })
  organismesFinanceur: string; // Ex: OPCO, Région, Pôle Emploi

  @Column({ nullable: true })
  numeroDossierFinancement: string;

  @Column({ type: 'date', nullable: true })
  dateDepotDossier: Date;

  @Column({ type: 'date', nullable: true })
  dateAccordFinancement: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  montantAccorde: number;

  @Column({ nullable: true })
  numeroPriseEnCharge: string;

  // SECTION 4 : PLANIFICATION (Planificateur)
  @Column({ nullable: true, type: 'date' })
  dateMiseEnProduction: Date;

  @Column({ nullable: true, type: 'date' })
  dateFormationDebut: Date;

  @Column({ nullable: true, type: 'date' })
  dateFormationFin: Date;

  @Column({ nullable: true })
  numeroStage: string;

  @Column({ nullable: true, type: 'json' })
  formateursAssignes: string[]; // Array of formateur IDs

  @Column({ default: false })
  planningFormation: boolean;

  @Column({ default: false })
  reprographieCommandee: boolean;

  @Column({ nullable: true, type: 'date' })
  dateCommandeRepro: Date;

  // SECTION 5 : DOCUMENTS ADMINISTRATIFS (Assistante)
  @Column({ type: 'json', nullable: true })
  piecesJointes: {
    ficheProgramme: boolean;
    planningFormation: boolean;
    evaluationsPreformatives: boolean;
    priseEnCharge: boolean;
    subrogationPaiement: boolean;
    demandeSubvention: boolean;
    conventionAfpi: boolean;
    bulletinsInscription: boolean;
    feuillesPresence: boolean;
    compteRenduFinFormation: boolean;
  };

  @Column({ type: 'json', nullable: true })
  documents: {
    id: string;
    nom: string;
    type: string;
    path: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];

  // SECTION 6 : FACTURATION
  @Column({ nullable: true, type: 'date' })
  dateFacturation: Date;

  @Column({ nullable: true })
  numeroFacture: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  montantFacture: number;

  @Column({ nullable: true, type: 'date' })
  datePaiementRecu: Date;

  @Column({ type: 'enum', enum: ModePaiement, nullable: true })
  modePaiement: ModePaiement;

  @Column({ default: false })
  subrogationPaiement: boolean;

  // Historique des validations
  @Column({ type: 'json', nullable: true })
  historique: {
    id: string;
    action: string;
    statutAvant: string;
    statutApres: string;
    userId: string;
    userName: string;
    commentaire: string;
    timestamp: Date;
  }[];

  // Synchronisation Ypareo
  @Column({ nullable: true })
  ypareoId: string;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncDate: Date;

  @Column({ type: 'json', nullable: true })
  ypareoData: any;

  // Champs personnalisés
  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
