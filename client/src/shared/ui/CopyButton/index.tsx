import { type FC, memo, useState } from 'react'

import { CopyIcon, DoneIcon } from 'shared/assets'
import { Button } from 'shared/ui/Button'

interface IProps {
  copy: string
}

const COPY_TIME = 2000

export const CopyButton: FC<IProps> = memo(({ copy }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const copyToClipboard = async (): Promise<void> => {
    await navigator.clipboard.writeText(copy)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), COPY_TIME)
  }

  return (
    <Button icon size="sm" onClick={copyToClipboard}>
      {!isCopied ? <CopyIcon /> : <DoneIcon />}
    </Button>
  )
})
