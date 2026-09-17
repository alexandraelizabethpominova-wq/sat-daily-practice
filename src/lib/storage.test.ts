import {beforeEach,describe,expect,it} from 'vitest'
import {addAttempt,clearHistory,getAttempts,getSessions,getSettings,prepareHistoryForUser,saveSession,saveSettings} from './storage'
import type {Attempt,SessionSummary,Settings} from '../types'

const attempt:Attempt={id:'a1',sessionId:'s1',questionId:'math1-1',subject:'math',module:'math1',questionNumber:1,selectedAnswer:'B',correctAnswer:'B',correct:true,elapsedMs:12000,createdAt:'2026-09-17T12:00:00.000Z'}
const session:SessionSummary={id:'s1',startedAt:'2026-09-17T12:00:00.000Z',endedAt:'2026-09-17T12:01:00.000Z',mode:'math',questionCount:1,attempts:[attempt]}
const settings:Settings={mode:'math',questionsPerSession:7,showExplanations:false,shuffle:false}

describe('practice storage',()=>{
  beforeEach(()=>localStorage.clear())

  it('appends attempts and sessions',()=>{
    addAttempt(attempt)
    saveSession(session)
    expect(getAttempts()).toEqual([attempt])
    expect(getSessions()).toEqual([session])
  })

  it('clears practice history without deleting user settings',()=>{
    saveSettings(settings)
    addAttempt(attempt)
    saveSession(session)
    clearHistory()
    expect(getAttempts()).toEqual([])
    expect(getSessions()).toEqual([])
    expect(getSettings()).toEqual(settings)
  })

  it('lets the first signed-in account claim existing local history',()=>{
    addAttempt(attempt)
    saveSession(session)
    prepareHistoryForUser('user-a')
    expect(getAttempts()).toEqual([attempt])
    expect(getSessions()).toEqual([session])
  })

  it('keeps history for the same signed-in account',()=>{
    prepareHistoryForUser('user-a')
    addAttempt(attempt)
    saveSession(session)
    prepareHistoryForUser('user-a')
    expect(getAttempts()).toEqual([attempt])
    expect(getSessions()).toEqual([session])
  })

  it('clears local history before a different account loads its cloud data',()=>{
    prepareHistoryForUser('user-a')
    addAttempt(attempt)
    saveSession(session)
    prepareHistoryForUser('user-b')
    expect(getAttempts()).toEqual([])
    expect(getSessions()).toEqual([])
  })
})
