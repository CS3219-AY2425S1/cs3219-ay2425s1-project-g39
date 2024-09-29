import './QuestionCounter.css'

interface QuestionCounterProps {
  colour: string;
  label: string;
}

function QuestionCounter({ colour, label }: QuestionCounterProps) {
  return (
    <div className="circle-container">
      <div
        className="circle"
        style={{ borderColor: colour }}
      >
        <div className="number-container">
          <p className="number-done">3</p>
          <p className="number-remaining">/15</p>
        </div>
      </div>
      <p className="difficulty-label">{ label }</p>
    </div>
  );
}

export default QuestionCounter;