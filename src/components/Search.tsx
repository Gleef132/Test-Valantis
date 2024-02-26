'use client'

import { FC, useContext } from 'react'
import Image from 'next/image'

import { TextField } from '@radix-ui/themes'

import { AppContext } from './screens/Home/Home'


const Search: FC = () => {
  const context = useContext(AppContext)

  if (!context) throw Error('AppContext not found');
  const { searchValue, setSearchValue } = context

  return (
    <TextField.Root>
      <TextField.Slot p={'3'}>
        <Image src='/search.svg' width={20} height={20} alt='search' />
      </TextField.Slot>
      <TextField.Input placeholder="Search by product name" size='3' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
    </TextField.Root>
  )
}

export default Search