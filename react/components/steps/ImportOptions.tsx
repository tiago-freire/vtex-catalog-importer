import type { TabState } from '@vtex/admin-ui'
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  IconArrowLeft,
  IconArrowRight,
  Radio,
  RadioGroup,
  TextInput,
  csx,
  useRadioState,
} from '@vtex/admin-ui'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import messages from '../../messages'

interface Props {
  state: TabState
}

export default function ImportOptions({ state }: Props) {
  const { formatMessage } = useIntl()
  const stateSelect = useRadioState({ defaultValue: '' })
  const [value, setValue] = useState('')
  const [checkedItems, setCheckedItems] = useState<string[]>([
    formatMessage(messages.optionsCheckbox1),
    formatMessage(messages.optionsCheckbox2),
  ])

  function handleCheck(item: string, isChecked: boolean) {
    let updatedCheckedItems = []

    if (isChecked) {
      updatedCheckedItems = [...checkedItems, item]
    } else {
      updatedCheckedItems = checkedItems.filter((i) => i !== item)
    }

    setCheckedItems(updatedCheckedItems)
  }

  const isAnyItemChecked = checkedItems.length > 0
  const isStockSelected =
    checkedItems.includes('Estoques') ||
    checkedItems.includes('Stocks') ||
    checkedItems.includes('Inventarios')

  return (
    <Flex style={{ flexDirection: 'column' }}>
      <CheckboxGroup label="" id="options-checkbox-group">
        <Checkbox
          value={formatMessage(messages.optionsCheckbox1)}
          label={formatMessage(messages.optionsCheckbox1)}
          checked={checkedItems.includes(
            formatMessage(messages.optionsCheckbox1)
          )}
          onChange={(e) => handleCheck(e.target.value, e.target.checked)}
        />
        <Checkbox
          value={formatMessage(messages.optionsCheckbox2)}
          label={formatMessage(messages.optionsCheckbox2)}
          checked={checkedItems.includes(
            formatMessage(messages.optionsCheckbox2)
          )}
          onChange={(e) => handleCheck(e.target.value, e.target.checked)}
        />
        <Checkbox
          value={formatMessage(messages.optionsCheckbox3)}
          label={formatMessage(messages.optionsCheckbox3)}
          checked={checkedItems.includes(
            formatMessage(messages.optionsCheckbox3)
          )}
          onChange={(e) => handleCheck(e.target.value, e.target.checked)}
        />
      </CheckboxGroup>
      <RadioGroup
        state={stateSelect}
        aria-label="radio-group"
        label=""
        style={{ marginLeft: 40, marginTop: 20 }}
      >
        <Radio
          value="1"
          label={formatMessage(messages.optionsRadio1)}
          disabled={!isStockSelected}
        />
        <Radio
          value="2"
          label={formatMessage(messages.optionsRadio2)}
          disabled={!isStockSelected}
        />
        {stateSelect.value === '2' && (
          <div style={{ marginLeft: 40 }}>
            <TextInput
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="number"
            />
          </div>
        )}
        <Radio
          value="3"
          label={formatMessage(messages.optionsRadio3)}
          disabled={!isStockSelected}
        />
      </RadioGroup>
      <Flex justify="space-between" className={csx({ marginTop: '$space-4' })}>
        <Button onClick={() => state.select('2')} icon={<IconArrowLeft />}>
          {formatMessage(messages.previousLabel)}
        </Button>
        <Button
          onClick={() => state.select('4')}
          icon={<IconArrowRight />}
          iconPosition="end"
          disabled={!isAnyItemChecked}
        >
          {formatMessage(messages.nextLabel)}
        </Button>
      </Flex>
    </Flex>
  )
}
