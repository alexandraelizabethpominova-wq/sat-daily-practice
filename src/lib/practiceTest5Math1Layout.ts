import type {QuestionCrop} from './questionCrops'
import type {QuestionVisualSpec} from './questionVisuals'

export const PRACTICE_TEST_5_MATH1_CROPS:Record<number,QuestionCrop>={
  1:{x:35,y:110,width:255,height:380},
  2:{x:35,y:510,width:255,height:190},
  3:{x:310,y:110,width:260,height:400},
  4:{x:50,y:110,width:250,height:240},
  5:{x:50,y:350,width:250,height:250},
  6:{x:325,y:110,width:245,height:330},
  7:{x:325,y:440,width:245,height:130},
  8:{x:50,y:110,width:250,height:400},
  9:{x:50,y:510,width:250,height:210},
  10:{x:310,y:110,width:260,height:270},
  11:{x:310,y:380,width:260,height:140},
  12:{x:50,y:110,width:250,height:245},
  13:{x:50,y:355,width:250,height:165},
  14:{x:325,y:110,width:245,height:215},
  15:{x:325,y:325,width:245,height:195},
  16:{x:35,y:110,width:540,height:625},
  17:{x:50,y:110,width:250,height:285},
  18:{x:50,y:395,width:250,height:265},
  19:{x:325,y:110,width:245,height:270},
  20:{x:325,y:380,width:245,height:280},
  21:{x:35,y:110,width:265,height:165},
  22:{x:35,y:275,width:265,height:245},
  23:{x:310,y:110,width:260,height:250},
  24:{x:310,y:360,width:260,height:230},
  25:{x:50,y:110,width:250,height:200},
  26:{x:50,y:310,width:250,height:250},
  27:{x:325,y:110,width:245,height:190},
}

export const PRACTICE_TEST_5_MATH1_VISUALS:Record<number,QuestionVisualSpec>={
  1:{afterLine:-1,crop:{x:.16,y:.04,width:.76,height:.49},exact:true},
  3:{afterLine:-1,crop:{x:.16,y:.04,width:.76,height:.49},exact:true},
  6:{afterLine:-1,crop:{x:.18,y:.05,width:.76,height:.55},exact:true},
  8:{afterLine:-1,crop:{x:.12,y:.06,width:.80,height:.40},exact:true},
  20:{afterLine:-1,crop:{x:.20,y:.06,width:.75,height:.54},exact:true},
}

export const PRACTICE_TEST_5_MATH1_IMAGE_FALLBACK=new Set([16])

function stripHeaderArtifacts(lines:string[],questionNumber:number){
  const header=new RegExp(`^(?:[-–—~]+\\s*)?${questionNumber}(?:\\s*[-–—~]+)?$`)
  return lines.filter(line=>!header.test(line.replace(/\\s+/g,' ').trim()))
}

function beforeChoices(lines:string[]){
  const index=lines.findIndex(line=>/^[A-D][.)](?:\\s|$)/i.test(line.trim()))
  return index<0?lines:lines.slice(0,index)
}

function questionStemOnly(lines:string[]){
  return beforeChoices(lines).filter(line=>!/^I{1,2}\\./.test(line.trim()))
}

export function normalizePracticeTest5Math1Lines(questionNumber:number,rawLines:string[]){
  let lines=stripHeaderArtifacts(rawLines,questionNumber)
    .map(line=>line.replace(/\\s+/g,' ').trim())
    .filter(Boolean)

  if(questionNumber===3){
    const stem=beforeChoices(lines)
    return [...stem,'A) $(0,0)$','B) $\\left(0,-\\frac{16}{11}\\right)$','C) $(0,-8)$','D) $(0,8)$']
  }

  if(questionNumber===4){
    const rest=lines.filter(line=>!/^s\\s*\\+\\s*7r\\s*=\\s*27$/i.test(line)&&!/^r\\s*=\\s*3$/i.test(line))
    const insert=Math.max(0,rest.findIndex(line=>/^What is/i.test(line)))
    return [...rest.slice(0,insert),'$$\\begin{aligned}s+7r&=27\\\\r&=3\\end{aligned}$$',...rest.slice(insert)]
  }

  if(questionNumber===11){
    return lines.map(line=>line.replace(/4x\\s*−?\\s*28\\s*=\\s*−?\\s*24/,'$4x-28=-24$').replace(/x\\s*−?\\s*7/,'$x-7$'))
  }

  if(questionNumber===12){
    lines=lines.map(line=>line.replace(/where\\s+s,?\\s+where\\s+represents/i,'where $s$ represents').replace(/where\\s+represents/i,'where $s$ represents'))
    const stem=beforeChoices(lines)
    return [...stem,'A) $s\\ge 2.4$','B) $s\\ge 1.8$','C) $0\\le s\\le 0.6$','D) $0.6\\le s\\le 1.8$']
  }

  if(questionNumber===13){
    const rest=lines.filter(line=>!/^y\\s*=\\s*4x$/i.test(line)&&!/^y\\s*=\\s*x2\\s*[−-]\\s*12$/i.test(line))
    const insert=Math.max(0,rest.findIndex(line=>/^A solution/i.test(line)))
    return [...rest.slice(0,insert),'$$\\begin{aligned}y&=4x\\\\y&=x^2-12\\end{aligned}$$',...rest.slice(insert)]
  }

  if(questionNumber===17){
    const stem=beforeChoices(lines)
    return [...stem,'A) $\\frac{x}{26}$','B) $26x$','C) $x+26$','D) $\\frac{26}{x}$']
  }

  if(questionNumber===19){
    const stem=questionStemOnly(lines).filter(line=>!/^(?:92π|3|√?3)$/i.test(line))
    const first=stem.findIndex(line=>/^What is the value of tan/i.test(line))
    const cleanStem=first>=0?[...stem.slice(0,first), 'What is the value of $\\tan\\left(\\frac{92\\pi}{3}\\right)$?']:stem
    return [...cleanStem,'A) $-\\sqrt{3}$','B) $-\\frac{\\sqrt{3}}{3}$','C) $\\frac{\\sqrt{3}}{3}$','D) $\\sqrt{3}$']
  }

  if(questionNumber===20){
    return lines.filter(line=>!/^11$/.test(line)&&!/^28$/.test(line))
      .map(line=>line.replace(/cos\\s+x°/i,'$\\cos x^\\circ$'))
  }

  if(questionNumber===22){
    return lines.map(line=>line.replace(/\\(x\\s*\\+\\s*4\\)2\\s*\\+\\s*\\(y\\s*[−-]\\s*19\\)2\\s*=\\s*121/,'$$(x+4)^2+(y-19)^2=121$$'))
  }

  if(questionNumber===24){
    const stem=lines.filter(line=>!/^I{1,2}\\./.test(line)&&!/f\\(x\\).*6\\(3\\)/.test(line)&&!/g\\(x\\).*3\\(6\\)/.test(line))
    const choiceIndex=stem.findIndex(line=>/^[A-D][.)]/i.test(line))
    const before=choiceIndex<0?stem:stem.slice(0,choiceIndex)
    const choices=choiceIndex<0?[]:stem.slice(choiceIndex)
    return [...before,'I. $f(x)=-6(3)^x-3$','II. $g(x)=-3(6)^x$',...choices]
  }

  if(questionNumber===26){
    return lines.map(line=>line
      .replace(/f\\s*\\(x\\)\\s*=\\s*ax2\\s*\\+\\s*bx\\s*\\+\\s*c/i,'$f(x)=ax^2+bx+c$')
      .replace(/y\\s*=\\s*f\\s*\\(x\\)/i,'$y=f(x)$'))
  }

  if(questionNumber===27){
    return lines.map(line=>line
      .replace(/g\\s*\\(x\\)\\s*=\\s*x\\(x\\s*[−-]\\s*2\\)\\(x\\s*\\+\\s*6\\)2/i,'$g(x)=x(x-2)(x+6)^2$')
      .replace(/g\\(7\\s*[−-]\\s*w\\)\\s+is\\s+0/i,'$g(7-w)=0$'))
  }

  return lines
}

export function isPracticeTest5Math1Verified(questionId:string){
  return /^practice-test-5:math1-(?:[1-9]|1\\d|2[0-7])$/.test(questionId)
}
