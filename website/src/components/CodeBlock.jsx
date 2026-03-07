import { useState, useCallback } from 'react'
import hljs from 'highlight.js/lib/core'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'

hljs.registerLanguage('python', python)
hljs.registerLanguage('bash', bash)

export default function CodeBlock({ code, language = 'python', caption = '' }) {
    const [copied, setCopied] = useState(false)

    const highlighted = language === 'pseudocode' || language === 'text'
        ? code
        : hljs.highlight(code.trim(), { language: language === 'bash' ? 'bash' : 'python' }).value

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code.trim())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }, [code])

    const langLabels = {
        python: 'Python',
        bash: 'Bash',
        pseudocode: 'Pseudocode',
        text: 'Output',
    }

    return (
        <div className="code-block-wrapper">
            <div className="code-block-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="code-block-lang">{langLabels[language] || language}</span>
                    {caption && <span className="code-block-caption">{caption}</span>}
                </div>
                <button
                    className={`code-copy-btn ${copied ? 'copied' : ''}`}
                    onClick={handleCopy}
                >
                    {copied ? '✓ Copied' : '⧉ Copy'}
                </button>
            </div>
            <div className="code-block-body">
                <pre>
                    <code dangerouslySetInnerHTML={{ __html: highlighted }} />
                </pre>
            </div>
        </div>
    )
}
