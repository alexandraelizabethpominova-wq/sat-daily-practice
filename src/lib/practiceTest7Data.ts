import type {ModuleKey,SourceCrop} from '../types'

export const PRACTICE_TEST_7_PAGES:Record<ModuleKey,Record<number,number>>={
  rw1:{},
  rw2:{},
  math1:{1:34,2:34,3:34,4:34,5:35,6:35,7:35,8:35,9:36,10:36,11:36,12:37,13:37,14:37,15:37,16:37,17:37,18:38,19:38,20:38,21:38,22:39,23:39,24:39,25:39,26:40,27:40},
  math2:{},
}

export const PRACTICE_TEST_7_ANSWER_PAGES:Record<ModuleKey,Record<number,number>>={
  rw1:{},
  rw2:{},
  math1:{1:31,2:31,3:31,4:32,5:32,6:32,7:32,8:33,9:33,10:33,11:33,12:34,13:34,14:34,15:34,16:35,17:35,18:35,19:36,20:36,21:36,22:37,23:37,24:37,25:38,26:38,27:38},
  math2:{},
}

export const PRACTICE_TEST_7_ANSWERS:Record<ModuleKey,Record<number,string>>={
  rw1:{},
  rw2:{},
  math1:{1:'B',2:'D',3:'B',4:'A',5:'D',6:'9',7:'14',8:'A',9:'B',10:'D',11:'C',12:'D',13:'294',14:'3',15:'A',16:'C',17:'B',18:'B',19:'D',20:'5',21:'87',22:'B',23:'A',24:'B',25:'C',26:'A',27:'-13/2'},
  math2:{},
}

export const PRACTICE_TEST_7_ACCEPTED:Partial<Record<ModuleKey,Record<number,string[]>>>={
  math1:{
    6:['9'],
    7:['14','-5','-4'],
    13:['294'],
    14:['3'],
    20:['5'],
    21:['87'],
    27:['-13/2','-6.5'],
  },
}

export const PRACTICE_TEST_7_CROPS:Record<ModuleKey,Record<number,SourceCrop>>={
  rw1:{},
  rw2:{},
  math1:{
    1:{x:35.9,y:109.1,width:242.4,height:439.9},
    2:{x:35.9,y:549.0,width:242.4,height:171.0},
    3:{x:314.3,y:109.1,width:242.4,height:270.6},
    4:{x:314.3,y:379.7,width:242.4,height:340.3},
    5:{x:53.9,y:109.1,width:242.4,height:394.1},
    6:{x:53.9,y:503.3,width:242.4,height:216.7},
    7:{x:332.3,y:109.1,width:242.4,height:135.6},
    8:{x:332.3,y:244.7,width:242.4,height:475.3},
    9:{x:35.9,y:109.1,width:242.4,height:228.0},
    10:{x:35.9,y:337.1,width:242.4,height:382.9},
    11:{x:314.3,y:109.1,width:242.4,height:610.9},
    12:{x:53.9,y:109.1,width:242.4,height:250.1},
    13:{x:53.9,y:359.3,width:242.4,height:132.6},
    14:{x:53.9,y:491.9,width:242.4,height:228.1},
    15:{x:332.3,y:109.1,width:242.4,height:232.0},
    16:{x:332.3,y:341.2,width:242.4,height:205.4},
    17:{x:332.3,y:546.6,width:242.4,height:173.4},
    18:{x:35.9,y:109.1,width:242.4,height:295.0},
    19:{x:35.9,y:404.2,width:242.4,height:315.8},
    20:{x:314.3,y:109.1,width:242.4,height:400.3},
    21:{x:314.3,y:509.4,width:242.4,height:210.6},
    22:{x:53.9,y:109.1,width:242.4,height:246.2},
    23:{x:53.9,y:355.4,width:242.4,height:364.6},
    24:{x:332.3,y:109.1,width:242.4,height:306.4},
    25:{x:332.3,y:415.6,width:242.4,height:304.4},
    26:{x:35.9,y:109.1,width:242.4,height:190.0},
    27:{x:314.3,y:109.1,width:242.4,height:110.0},
  },
  math2:{},
}
