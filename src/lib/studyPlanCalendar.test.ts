import {describe,expect,it} from 'vitest'
import {buildStudyPlanCalendarDays} from './studyPlanCalendar'
import type {SessionSummary} from '../types'

function session(id:string,date:string,questionCount:number):SessionSummary{
  return {
    id,
    startedAt:`${date}T15:00:00.000Z`,
    endedAt:`${date}T15:20:00.000Z`,
    mode:'both',
    questionCount,
    attempts:[],
  }
}

describe('study plan calendar',()=>{
  it('marks practiced days ahead, on plan, or behind using the daily question target',()=>{
    const days=buildStudyPlanCalendarDays({
      year:2026,
      month:8,
      sessions:[
        session('s1','2026-09-10',5),
        session('s2','2026-09-11',10),
        session('s3','2026-09-12',15),
      ],
      recommendedSessionsPerDay:1,
      questionsPerSession:10,
      today:new Date(2026,8,13,12),
      examDate:'2026-10-19',
    })
    expect(days[9]).toMatchObject({day:10,practiced:true,status:'behind'})
    expect(days[10]).toMatchObject({day:11,practiced:true,status:'on-track'})
    expect(days[11]).toMatchObject({day:12,practiced:true,status:'ahead'})
    expect(days[12]).toMatchObject({day:13,practiced:false,status:'behind'})
    expect(days[13]).toMatchObject({day:14,status:'planned'})
  })

  it('does not label days before the first recorded practice day as behind',()=>{
    const days=buildStudyPlanCalendarDays({
      year:2026,
      month:8,
      sessions:[session('s1','2026-09-10',10)],
      recommendedSessionsPerDay:1,
      questionsPerSession:10,
      today:new Date(2026,8,12,12),
    })
    expect(days[0].status).toBe('neutral')
    expect(days[8].status).toBe('neutral')
    expect(days[9].status).toBe('on-track')
  })
})
