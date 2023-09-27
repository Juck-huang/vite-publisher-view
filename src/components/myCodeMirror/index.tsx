import React, { useCallback, useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { langs } from '@uiw/codemirror-extensions-langs'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'

const MyCodeMirror = ({ codeValue, codeType, setCodeValue, height }) => {

  const [extension, setExtension] = useState([])

  const onChange = useCallback((value, viewUpdate) => {
    // console.log('value', value)
    setCodeValue(value)
  }, [setCodeValue])

  useEffect(()=>{
    const initCodeType = () => {
      switch(codeType) {
        case 'yml': 
          setExtension([langs.yaml()])
          break
        case 'yaml':
          setExtension([langs.yaml()])
          break
        case 'sql':
          setExtension([langs.sql()])
          break
        default:
          break
      }
    }
    initCodeType()
  },[codeType])

  return (
    <>
      <CodeMirror
        value={codeValue}
        height={height}
        theme={vscodeDark}
        extensions={extension}
        onChange={onChange}
      />
    </>
  )
}

export default MyCodeMirror