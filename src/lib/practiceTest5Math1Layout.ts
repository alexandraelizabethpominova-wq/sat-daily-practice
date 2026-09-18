import type {QuestionCrop} from './questionCrops'
import type {QuestionVisualSpec} from './questionVisuals'

export const PRACTICE_TEST_5_MATH1_CROPS:Record<number,QuestionCrop>={
  1:{x:36,y:116,width:268,height:402},
  2:{x:36,y:518,width:268,height:202},
  3:{x:318,y:116,width:267,height:604},
  4:{x:54,y:116,width:257,height:241},
  5:{x:54,y:357,width:257,height:363},
  6:{x:318,y:116,width:267,height:332},
  7:{x:318,y:448,width:267,height:272},
  8:{x:36,y:116,width:268,height:403},
  9:{x:36,y:519,width:268,height:201},
  10:{x:318,y:116,width:267,height:270},
  11:{x:318,y:386,width:267,height:334},
  12:{x:54,y:116,width:257,height:250},
  13:{x:54,y:366,width:257,height:354},
  14:{x:318,y:116,width:267,height:216},
  15:{x:318,y:332,width:267,height:388},
  16:{x:36,y:116,width:549,height:604},
  17:{x:54,y:116,width:257,height:287},
  18:{x:54,y:403,width:257,height:317},
  19:{x:318,y:116,width:267,height:274},
  20:{x:318,y:390,width:267,height:330},
  21:{x:36,y:116,width:268,height:164},
  22:{x:36,y:280,width:268,height:440},
  23:{x:318,y:116,width:267,height:253},
  24:{x:318,y:369,width:267,height:351},
  25:{x:54,y:116,width:257,height:200},
  26:{x:54,y:316,width:257,height:283},
  27:{x:318,y:116,width:267,height:483},
}

export const PRACTICE_TEST_5_MATH1_VISUALS:Record<number,QuestionVisualSpec>={
  1:{afterLine:-1,crop:{x:.04,y:.01,width:.84,height:.48},exact:true},
  3:{afterLine:-1,crop:{x:.01,y:.01,width:.90,height:.32},exact:true},
  6:{afterLine:-1,crop:{x:.06,y:.02,width:.90,height:.57},exact:true},
  8:{afterLine:-1,crop:{x:.05,y:.02,width:.88,height:.46},exact:true},
  20:{afterLine:-1,crop:{x:.10,y:.04,width:.84,height:.46},exact:true},
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
