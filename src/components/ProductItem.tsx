'use client'

import { FC } from 'react'

import { Flex, Text } from '@radix-ui/themes';

import { IProduct } from '@/models/IProduct'

const ProductItem: FC<IProduct> = ({ id, product, price, brand }) => {
  return (
    <Flex direction='column' justify={'center'} gap={'2'} style={{ flex: '30%', border: '1px solid #444' }} height={'auto'} p={'2'}>
      <Text size={'2'}>id: {id}</Text>
      <Text size={'2'}>brand: {brand || 'no brand:)'}</Text>
      <Text size={'2'}>price: {price}</Text>
      <Text size={'2'}>product: {product}</Text>
    </Flex>
  )
}

export default ProductItem