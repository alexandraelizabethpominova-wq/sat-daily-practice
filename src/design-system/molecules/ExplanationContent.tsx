import SourceViewer from './SourceViewer'
import usePracticeTestPdf from '../../hooks/usePracticeTestPdf'
import type {PracticeQuestion} from '../../types'

type Props={question:PracticeQuestion;bytes:ArrayBuffer|null}

export default function ExplanationContent({question,bytes}:Props){
  const source=usePracticeTestPdf(question,'answers',bytes)
  if(!source)return <div className="structured-loading">Preparing original explanation…</div>
  return <SourceViewer
    pdfKey="answers"
    bytes={source}
    page={question.answerPage}
    questionNumber={question.number}
    alt={`Original explanation for question ${question.number}`}
    label="Original explanation"
    practiceTestId={question.practiceTestId}
    module={question.module}
  />
}
