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
    sourceCrop:{x:.01,y:.04,width:.98,height:.13},
  },
  'practice-test-7:rw2-12':{
    title:'Percentage of Bus Shelters with Shade in a County by Areas’ Highest Average Summer Surface Temperature',
    headers:['Highest average surface temperature (Fahrenheit)','Percentage of bus stops with shaded shelter'],
    rows:[
      ['90.2°','15%'],
      ['97.7°','22%'],
      ['102.7°','24%'],
      ['111.2°','28%'],
      ['125.6°','29%'],
    ],
    sourceCrop:{x:.04,y:.035,width:.92,height:.24},
  },
  'practice-test-7:rw2-13':{
    title:'Total Areas and 2022 Populations of Smallest Arabian Peninsula Countries',
    headers:['Country','Total area (square miles)','Population'],
    rows:[
      ['Kuwait','6,880','4,268,873'],
      ['Bahrain','304','1,472,233'],
      ['Qatar','4,471','2,695,122'],
    ],
    sourceCrop:{x:.12,y:.075,width:.78,height:.36},
  },
  'rw1-17':{
    title:'Effects of Mycorrhizal Fungi on 3 Plant Species',
    headers:['Plant species','Mycorrhizal host','Average mass of plants grown in soil containing mycorrhizal fungi (in grams)','Average mass of plants grown in soil treated to kill fungi (in grams)'],
    rows:[
      ['Corn','yes','15.1','3.8'],
      ['Marigold','yes','10.2','2.4'],
      ['Broccoli','no','7.5','7'],
    ],
    sourceCrop:{x:.005,y:.04,width:.99,height:.17},
  },
}

export function readingTableSpec(questionId:string){return TABLES[questionId]}

function normalizeTableLine(value:string){
  return value.replace(/\s+/g,' ').trim().toLowerCase()
}

export function stripEmbeddedReadingTableLines(questionId:string,lines:string[]){
  const table=readingTableSpec(questionId)
  if(!table)return lines

  const forms=new Set<string>([
    table.title,
    ...table.headers,
    table.headers.join(' '),
    ...table.rows.map(row=>row.join(' ')),
  ].map(normalizeTableLine))

  let index=0
  while(index<lines.length&&forms.has(normalizeTableLine(lines[index])))index++
  return index>0?lines.slice(index):lines
}
