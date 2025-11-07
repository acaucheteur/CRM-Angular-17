import { DataSource } from 'typeorm';
import { Localisation } from '../../modules/localisations/localisation.entity';

export async function seedLocalisations(dataSource: DataSource): Promise<void> {
  console.log('🌱 Seeding localisations...');

  const localisationRepository = dataSource.getRepository(Localisation);

  // Define sample localisations (AFPI locations in Hauts-de-France)
  const localisationsData = [
    {
      code: 'AISNE',
      name: 'AFPI de l\'Aisne',
      ville: 'Laon',
      address: 'Parc Technologique Delta 3',
      codePostal: '02000',
      telephone: '03 23 26 30 00',
      email: 'afpi.aisne@formation-industries-aisne-oise.fr',
      siteWeb: 'https://www.formation-industries-aisne-oise.fr',
      isActive: true,
    },
    {
      code: 'OISE',
      name: 'AFPI de l\'Oise',
      ville: 'Beauvais',
      address: 'Avenue du Parc',
      codePostal: '60000',
      telephone: '03 44 12 30 00',
      email: 'afpi.oise@formation-industries-aisne-oise.fr',
      siteWeb: 'https://www.formation-industries-aisne-oise.fr',
      isActive: true,
    },
    {
      code: 'SOMME',
      name: 'AFPI de la Somme',
      ville: 'Amiens',
      address: 'Rue des Industries',
      codePostal: '80000',
      telephone: '03 22 54 30 00',
      email: 'contact@afpi-somme.fr',
      siteWeb: 'https://www.afpi-somme.fr',
      isActive: true,
    },
    {
      code: 'NORD',
      name: 'AFPI du Nord',
      ville: 'Lille',
      address: 'Boulevard de la Formation',
      codePostal: '59000',
      telephone: '03 20 54 30 00',
      email: 'contact@afpi-nord.fr',
      siteWeb: 'https://www.afpi-nord.fr',
      isActive: true,
    },
    {
      code: 'PAS_DE_CALAIS',
      name: 'AFPI du Pas-de-Calais',
      ville: 'Arras',
      address: 'Zone Industrielle',
      codePostal: '62000',
      telephone: '03 21 60 30 00',
      email: 'contact@afpi-pas-de-calais.fr',
      siteWeb: 'https://www.afpi-pas-de-calais.fr',
      isActive: true,
    },
  ];

  // Insert localisations if they don't exist
  for (const locData of localisationsData) {
    const exists = await localisationRepository.findOne({
      where: { code: locData.code },
    });

    if (!exists) {
      const localisation = localisationRepository.create(locData);
      await localisationRepository.save(localisation);
      console.log(`  ✓ Created localisation: ${locData.name}`);
    } else {
      console.log(`  ⊙ Localisation already exists: ${locData.name}`);
    }
  }

  console.log('✅ Localisations seeding completed');
}
