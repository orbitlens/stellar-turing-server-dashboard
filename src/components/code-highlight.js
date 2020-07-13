import React from 'react'
import PropTypes from 'prop-types'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-solarized_dark'

function CodeHighlight({value, className, lang, readOnly = false, onChange, ...otherProps}) {
    return <AceEditor mode={lang} theme="solarized_dark" onChange={onChange} value={value} width="100%" fontSize={15}
                      readOnly={readOnly} className={className} enableBasicAutocompletion enableLiveAutocompletion
                      {...otherProps}/>
}

CodeHighlight.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    className: PropTypes.string,
    lang: PropTypes.oneOf(['javascript', 'json', 'plain']),
    readOnly: PropTypes.bool
}

export default CodeHighlight