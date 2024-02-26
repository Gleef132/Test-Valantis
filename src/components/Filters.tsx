'use client'

import { FC, useContext, useState } from 'react'

import { AppContext } from './screens/Home/Home';

import { Button, Flex, Text, TextFieldInput } from '@radix-ui/themes';
import { Select } from 'antd';

interface IFilterProps {
  brands: string[];
}

const Filters: FC<IFilterProps> = ({ brands }) => {

  const context = useContext(AppContext)
  if (!context) throw Error('AppContext not found');
  const { priceFilter, setPriceFilter, setBrandFilter } = context
  const [priceValue, setPriceValue] = useState<string>('')
  const [brandValue, setBrandValue] = useState<string>('')

  const saveChanges = () => {
    setPriceFilter(Number(priceValue))
    setBrandFilter(brandValue === 'All' ? '' : brandValue)
  }

  return (
    <Flex direction='column' gap='4' width='auto' height={'max-content'} position={'relative'}>
      <Text mt={'2'} size='5'>Choose a brand</Text>
      <Select
        defaultValue={'All'}
        options={[
          { value: 'All', label: 'All' },
          ...brands.map(brand => ({ value: brand, label: brand }))
        ]}
        onChange={(e) => setBrandValue(e)}>
      </Select>
      <Text size='5'>Price</Text>
      <TextFieldInput
        placeholder='Price'
        value={priceValue}
        onChange={(e) => {
          // Делаем проверку что введено число
          const value = e.target.value;
          if (!isNaN(Number(value))) {
            setPriceValue(value);
          }
        }}
      />
      <Button
        size='3'
        variant='soft'
        style={!priceValue && !brandValue ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}
        disabled={(!priceValue && priceFilter === Number(priceValue)) && !brandValue || !!priceValue && priceFilter === Number(priceValue) || !brandValue}
        onClick={saveChanges}>
        Save
      </Button>
    </Flex >
  )
}

export default Filters