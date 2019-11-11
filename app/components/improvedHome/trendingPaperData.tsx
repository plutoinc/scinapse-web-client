export interface TrendingPaper {
  paperId: string;
  paperTitle: string;
  year: number;
  journalTitle: string;
  authors: string[];
}

export const TRENDING_PAPERS: TrendingPaper[] = [
  {
    paperId: '2560508391',
    paperTitle: 'A Feathered Dinosaur Tail with Primitive Plumage Trapped in Mid-Cretaceous Amber',
    year: 2016,
    journalTitle: 'Current Biology',
    authors: ['Lida Xing', 'Ryan C. McKellar', 'Xing Xu'],
  },
  {
    paperId: '2595745805',
    paperTitle: 'Work organization and mental health problems in PhD students',
    year: 2017,
    journalTitle: 'Research Policy',
    authors: ['Katia Levecque', 'Frederik Anseel', 'Alain De Beuckelaer'],
  },
  {
    paperId: '2740810575',
    paperTitle: 'Correction of a pathogenic gene mutation in human embryos',
    year: 2017,
    journalTitle: 'Nature',
    authors: ['Hong Ma', 'Nuria Marti-Gutierrez', 'Sang-Wook Park'],
  },
  {
    paperId: '2751423033',
    paperTitle:
      'Associations of fats and carbohydrate intake with cardiovascular disease and mortality in 18 countries from five continents (PURE): a prospective cohort study',
    year: 2017,
    journalTitle: 'The Lancet',
    authors: ['Mahshid Dehghan', 'Andrew Mente', 'Xiaohe Zhang'],
  },
  {
    paperId: '2766208183',
    paperTitle: 'More than 75 percent decline over 27 years in total flying insect biomass in protected areas',
    year: 2017,
    journalTitle: 'PLOS ONE',
    authors: ['Caspar A. Hallmann', 'Martin Sorg', 'Eelke Jongejans'],
  },
];
