import { useState } from 'react'

const P2PKH_STEPS = [
    {
        step: 0,
        explanation: 'Execution starts. Stack is empty.',
        script: '<Signature> <PublicKey> OP_DUP OP_HASH160 <PKHash> OP_EQUALVERIFY OP_CHECKSIG',
        highlight: null,
        stack: [],
    },
    {
        step: 1,
        explanation: 'First element is evaluated. It consists of data so it goes into the stack.',
        script: '<Signature> <PublicKey> OP_DUP OP_HASH160 <PKHash> OP_EQUALVERIFY OP_CHECKSIG',
        highlight: '<Signature>',
        stack: ['<Signature>'],
    },
    {
        step: 2,
        explanation: 'Second element is also data and goes into the stack.',
        script: '<Signature> <PublicKey> OP_DUP OP_HASH160 <PKHash> OP_EQUALVERIFY OP_CHECKSIG',
        highlight: '<PublicKey>',
        stack: ['<Signature>', '<PublicKey>'],
    },
    {
        step: 3,
        explanation: 'Next element is an operator that duplicates the top element of the stack.',
        script: '<Signature> <PublicKey> OP_DUP OP_HASH160 <PKHash> OP_EQUALVERIFY OP_CHECKSIG',
        highlight: 'OP_DUP',
        stack: ['<Signature>', '<PublicKey>', '<PublicKey>'],
    },
    {
        step: 4,
        explanation: 'Next element is an operator that calculates the HASH160 of the top stack element. HASH160 is equivalent to RIPEMD160( SHA256( element ) ) which is what is needed to calculate the PKH from a public key.',
        script: '<Signature> <PublicKey> OP_DUP OP_HASH160 <PKHash> OP_EQUALVERIFY OP_CHECKSIG',
        highlight: 'OP_HASH160',
        stack: ['<Signature>', '<PublicKey>', '<PKHash>'],
    },
    {
        step: 5,
        explanation: 'Next element is data and it is pushed into the stack.',
        script: '<Signature> <PublicKey> OP_DUP OP_HASH160 <PKHash> OP_EQUALVERIFY OP_CHECKSIG',
        highlight: '<PKHash>',
        stack: ['<Signature>', '<PublicKey>', '<PKHash>', '<PKHash>'],
    },
    {
        step: 6,
        explanation: 'Next element is an operator that checks if the top two elements of the stack are equal and fails the script if they are not. Effectively this validates that the public key provided is indeed the one that corresponds to the PKH (or address) that we are trying to spend.',
        script: '<Signature> <PublicKey> OP_DUP OP_HASH160 <PKHash> OP_EQUALVERIFY OP_CHECKSIG',
        highlight: 'OP_EQUALVERIFY',
        stack: ['<Signature>', '<PublicKey>'],
    },
    {
        step: 7,
        explanation: 'Next element is an operator that expects two elements from the stack; a signature and a public key that corresponds to that signature. If the signature is valid it returns true, otherwise false.',
        script: '<Signature> <PublicKey> OP_DUP OP_HASH160 <PKHash> OP_EQUALVERIFY OP_CHECKSIG',
        highlight: 'OP_CHECKSIG',
        stack: ['OP_TRUE'],
    },
]

export default function StackVisualizer({ steps = P2PKH_STEPS, title = 'P2PKH Validation' }) {
    const [currentStep, setCurrentStep] = useState(0)
    const step = steps[currentStep]

    const renderScript = (script, highlight) => {
        if (!highlight) return script
        const parts = script.split(highlight)
        return parts.reduce((acc, part, i) => {
            if (i === 0) return [part]
            return [...acc, <span key={i} className="highlight">{highlight}</span>, part]
        }, [])
    }

    return (
        <div className="stack-visualizer">
            <div className="stack-visualizer-header">
                <div className="stack-visualizer-title">
                    ⚡ {title}
                </div>
                <div className="stack-step-controls">
                    <button
                        className="stack-step-btn"
                        onClick={() => setCurrentStep(s => s - 1)}
                        disabled={currentStep === 0}
                    >
                        ◀ Prev
                    </button>
                    <span className="stack-step-counter">
                        Step {step.step}/{steps.length - 1}
                    </span>
                    <button
                        className="stack-step-btn"
                        onClick={() => setCurrentStep(s => s + 1)}
                        disabled={currentStep === steps.length - 1}
                    >
                        Next ▶
                    </button>
                </div>
            </div>

            <div className="stack-visualizer-body">
                <div className="stack-script-panel">
                    <div className="stack-panel-label">Script</div>
                    <div className="stack-script">
                        {renderScript(step.script, step.highlight)}
                    </div>
                </div>
                <div className="stack-state-panel">
                    <div className="stack-panel-label">Stack</div>
                    {step.stack.length === 0 ? (
                        <div className="stack-empty">Empty</div>
                    ) : (
                        <div className="stack-items">
                            {step.stack.map((item, i) => (
                                <div key={`${currentStep}-${i}`} className="stack-item">
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="stack-explanation-panel">
                <strong>Step {step.step}:</strong> {step.explanation}
            </div>
        </div>
    )
}
