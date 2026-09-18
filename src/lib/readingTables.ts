import type {NormalizedCrop} from './questionVisuals'

export type ReadingTableSpec={
  title:string
  headers:string[]
  rows:string[][]
  sourceCrop:NormalizedCrop
}

const TABLES:Record<string,ReadingTableSpec>={
  'rw1-15':{
    title:'Ablation Rates for Three Elements in Cosmic Dust, by Dust Source',
    headers:['Element','SPC','AST','HTC','OCC'],
    rows:[
      ['iron','20%','28%','90%','98%'],
      ['potassium','44%','74%','97%','100%'],
      ['sodium','45%','75%','99%','100%'],
    ],
    sourceCrop:{x:.01,y:.055,width:.98,height:.145},
  },
  'rw1-17':{
    title:'Effects of Mycorrhizal Fungi on 3 Plant Species',
    headers:['Plant species','Mycorrhizal host','Average mass of plants grown in soil containing mycorrhizal fungi (in grams)','Average mass of plants grown in soil treated to kill fungi (in grams)'],
    rows:[
      ['Corn','yes','15.1','3.8'],
      ['Marigold','yes','10.2','2.4'],
      ['Broccoli','no','7.5','7'],
    ],
    sourceCrop:{x:.005,y:.055,width:.99,height:.215},
  },
}

export function readingTableSpec(questionId:string){return TABLES[questionId]}
